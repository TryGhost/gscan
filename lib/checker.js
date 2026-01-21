const requireDir = require('require-dir');
const debug = require('@tryghost/debug')('checker');

const errors = require('@tryghost/errors');
const versions = require('./utils').versions;

// An object containing helpers as keys and their labs flag as values
// E.g. match:  'matchHelper'
const labsEnabledHelpers = {
};

function registerLabsHelpers(resolvedVersion, labs) {
    if (!labs) {
        return;
    }

    Object.entries(labsEnabledHelpers).forEach(([helper, flag]) => {
        if (flag in labs) {
            const spec = require('./specs').get([resolvedVersion]);
            if (!spec.knownHelpers.includes(helper)) {
                spec.knownHelpers.push(helper);
            }
        }
    });
}

// Lazy loads readTheme (and its AST parser) only when this function is called
async function readAndPrepareTheme(path, resolvedVersion) {
    const readTheme = require('./read-theme');
    const theme = await readTheme(path);
    theme.checkedVersion = versions[resolvedVersion].major;
    return theme;
}

async function runCheckModules(checkModules, theme, options, themePath) {
    const startTime = Date.now();

    for (const checkName in checkModules) {
        const checkStartTime = Date.now();
        await checkModules[checkName](theme, options, themePath);
        debug(checkName, 'took', Date.now() - checkStartTime, 'ms');
    }

    debug('All checks took', Date.now() - startTime, 'ms');
}

/**
 * Check theme
 *
 * Takes a theme path, reads the theme, and checks it for issues.
 * Returns a theme object.
 * @param {string} path
 * @param {Object} options
 * @param {string} [options.checkVersion] version to check the theme against
 * @param {string} [options.themeName] name of the checked theme
 * @param {Object=} [options.labs] object containing boolean flags for enabled labs features
 * @param {boolean} [options.skipChecks] flag to allow reading theme without incurring check costs
 * @returns {Promise<Object>}
 */
const check = async function validateTheme(path, options = {}) {
    // Require check modules late to avoid loading all until used
    const checkModules = options.skipChecks === true ? {} : requireDir('./checks');
    const requestedVersion = options.checkVersion ?? versions.default;
    let resolvedVersion = requestedVersion;

    if (requestedVersion === 'canary') {
        resolvedVersion = versions.canary;
        options.checkVersion = versions.canary;
    }

    registerLabsHelpers(resolvedVersion, options.labs);

    try {
        const theme = await readAndPrepareTheme(path, resolvedVersion);
        await runCheckModules(checkModules, theme, options, path);
        return theme;
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

async function withExtractedThemeDir(zipDescriptor, {keepExtractedDir = false} = {}, fn) {
    const extractTheme = require('./read-zip');
    const fs = require('fs-extra');

    const {path: extractedPath, origPath} = await extractTheme(zipDescriptor);

    try {
        return await fn(extractedPath);
    } finally {
        if (!keepExtractedDir) {
            await fs.remove(origPath);
        }
    }
}

function toZipDescriptor(input) {
    if (typeof input === 'string') {
        return {
            path: input,
            name: input.match(/(.*\/)?(.*).zip$/)[2]
        };
    }
    return {...input};
}

const checkZip = async function validateZippedTheme(pathOrDescriptor, options) {
    const zipDescriptor = toZipDescriptor(pathOrDescriptor);
    options = {keepExtractedDir: false, ...options};

    try {
        return await withExtractedThemeDir(zipDescriptor, options, (extractedPath) => {
            return check(extractedPath, {themeName: zipDescriptor.name, ...options});
        });
    } catch (error) {
        if (!errors.utils.isGhostError(error)) {
            throw new errors.ValidationError({
                message: 'Failed to check zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: error.message,
                context: zipDescriptor.name,
                err: error
            });
        }

        throw error;
    }
};

module.exports = {
    check,
    checkZip
};
