const _ = require('lodash');
const debug = require('@tryghost/debug')('checker');

const errors = require('@tryghost/errors');
const versions = require('./utils').versions;
const allChecks = require('./checks');

// See lib/utils/labs-enabled-helpers.js to add/remove labs-flagged helpers
const labsEnabledHelpers = require('./utils/labs-enabled-helpers');

function loadChecks() {
    // Checks are listed statically in lib/checks/index.js so the checker stays
    // filesystem-free and bundleable for non-Node runtimes.
    return {...allChecks};
}

/**
 * Resolves the version to check against, normalises `canary`, and applies any
 * labs-flagged helpers to the matching spec. Mutates `options.checkVersion`
 * for the canary case to preserve existing behaviour.
 *
 * @param {Object} options
 * @returns {string} the resolved version key
 */
function resolveVersion(options) {
    const passedVersion = _.get(options, 'checkVersion', versions.default);
    let version = passedVersion;

    if (passedVersion === 'canary') {
        version = versions.canary;
        options.checkVersion = versions.canary;
    }

    _.each(labsEnabledHelpers, (flag, helper) => {
        if (_.has(options.labs, flag)) {
            const spec = require('./specs').get([version]);
            if (!spec.knownHelpers.includes(helper)) {
                spec.knownHelpers.push(helper);
            }
        }
    });

    return version;
}

/**
 * Runs all checks against an already-read theme object. This is the
 * filesystem-free core shared by the on-disk reader (check), the zip reader
 * (checkZip) and the in-memory readers (checkFiles / checkBuffer).
 *
 * @param {Object} theme - a theme object produced by a reader
 * @param {Object} options
 * @param {string} [themePath] - optional path/name passed through to checks
 * @returns {Promise<Object>}
 */
const runChecks = async function runChecks(theme, options = {}, themePath) {
    const checks = options.skipChecks === true ? {} : loadChecks();
    const version = resolveVersion(options);

    // set the major version to check
    theme.checkedVersion = versions[version].major;

    const timeBeforeChecks = Date.now();

    for (const checkName in checks) {
        const now = Date.now();
        await checks[checkName](theme, options, themePath);
        debug(checkName, 'took', Date.now() - now, 'ms');
    }

    debug('All checks took', Date.now() - timeBeforeChecks, 'ms');

    return theme;
};

/**
 * Check theme
 *
 * Takes a theme path, reads the theme, and checks it for issues.
 * Returns a theme object.
 * @param {string} themePath
 * @param {Object} options
 * @param {string} [options.checkVersion] version to check the theme against
 * @param {string} [options.themeName] name of the checked theme
 * @param {Object=} [options.labs] object containing boolean flags for enabled labs features
 * @param {boolean} [options.skipChecks] flag to allow reading theme without incurring check costs
 * @param {Object=} [options.limits] zip extraction size limits
 * @returns {Promise<Object>}
 */
const check = async function checkAll(themePath, options = {}) {
    // Require readTheme late to avoid loading entire AST parser until used
    const readTheme = require('./read-theme');

    try {
        const theme = await readTheme(themePath);
        return await runChecks(theme, options, themePath);
    } catch (err) {
        throw new errors.ValidationError({
            message: 'Failed theme files check',
            help: 'Your theme file structure is corrupted or contains errors',
            errorDetails: err.message,
            context: options.themeName,
            err
        });
    }
};

/**
 * Check theme from an in-memory list of files.
 *
 * Filesystem-free entry point for non-Node runtimes (e.g. Cloudflare Workers).
 * Each file is `{file, content}` where `file` is the theme-relative path and
 * `content` is the UTF-8 string content.
 *
 * @param {Array<{file: string, content?: string}>} files
 * @param {Object} options - same options as check(), plus options.themeName
 * @returns {Promise<Object>}
 */
const checkFiles = async function checkFiles(files, options = {}) {
    // Require buildTheme late to avoid loading the AST parser until used
    const buildTheme = require('./build-theme');

    try {
        const theme = buildTheme(options.themeName || '', files);
        return await runChecks(theme, options, theme.path);
    } catch (err) {
        throw new errors.ValidationError({
            message: 'Failed theme files check',
            help: 'Your theme file structure is corrupted or contains errors',
            errorDetails: err.message,
            context: options.themeName,
            err
        });
    }
};

/**
 * Check theme from an in-memory zip buffer.
 *
 * Filesystem-free entry point for non-Node runtimes (e.g. Cloudflare Workers).
 * Unzips the buffer in memory (no temp files), then runs checkFiles.
 *
 * @param {ArrayBuffer|Uint8Array} buffer - zip file contents
 * @param {Object} options - same options as checkFiles(), plus options.themeName
 * @returns {Promise<Object>}
 */
const checkBuffer = async function checkBuffer(buffer, options = {}) {
    const unzipBuffer = require('./read-buffer');

    let files;
    try {
        files = await unzipBuffer(buffer);
    } catch (error) {
        if (!errors.utils.isGhostError(error)) {
            throw new errors.ValidationError({
                message: 'Failed to read zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: error.message,
                context: options.themeName,
                err: error
            });
        }

        throw error;
    }

    return checkFiles(files, options);
};

const checkZip = async function checkZip(path, options) {
    options = Object.assign({}, {
        keepExtractedDir: false
    }, options);

    let zip;

    if (_.isString(path)) {
        zip = {
            path,
            name: path.match(/(.*\/)?(.*).zip$/)[2]
        };
    } else {
        zip = _.clone(path);
    }

    let extractedZipPath;

    try {
        const readZip = require('./read-zip');
        ({path: extractedZipPath} = await readZip(zip, {limits: options.limits}));
        return await check(extractedZipPath, Object.assign({themeName: zip.name}, options));
    } catch (error) {
        if (!errors.utils.isGhostError(error)) {
            throw new errors.ValidationError({
                message: 'Failed to check zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: error.message,
                context: zip.name,
                err: error
            });
        }

        throw error;
    } finally {
        if (!options.keepExtractedDir && zip.origPath) {
            const fs = require('fs/promises');
            await fs.rm(zip.origPath, {recursive: true, force: true});
        }
    }
};

module.exports = {
    check,
    checkZip,
    checkFiles,
    checkBuffer
};
