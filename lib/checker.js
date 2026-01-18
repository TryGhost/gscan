const requireDir = require('require-dir');
const debug = require('@tryghost/debug')('checker');

const errors = require('@tryghost/errors');
const versions = require('./utils').versions;

// An object containing helpers as keys and their labs flag as values
// E.g. match:  'matchHelper'
const labsEnabledHelpers = {
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
 * @returns {Promise<Object>}
 */
const check = async function checkAll(themePath, options = {}) {
    // Require check modules late to avoid loading all until used
    const checkModules = options.skipChecks === true ? {} : requireDir('./checks');
    const requestedVersion = options.checkVersion ?? versions.default;
    let resolvedVersion = requestedVersion;

    if (requestedVersion === 'canary') {
        resolvedVersion = versions.canary;
        options.checkVersion = versions.canary;
    }

    Object.entries(labsEnabledHelpers).forEach(([helper, flag]) => {
        if (options.labs && flag in options.labs) {
            const spec = require('./specs').get([resolvedVersion]);
            if (!spec.knownHelpers.includes(helper)) {
                spec.knownHelpers.push(helper);
            }
        }
    });

    // Require readTheme late to avoid loading entire AST parser until used
    const readTheme = require('./read-theme');

    try {
        const theme = await readTheme(themePath);

        // set the major version to check
        theme.checkedVersion = versions[resolvedVersion].major;

        const timeBeforeChecks = Date.now();

        for (const checkName in checkModules) {
            const now = Date.now();
            await checkModules[checkName](theme, options, themePath);
            debug(checkName, 'took', Date.now() - now, 'ms');
        }

        debug('All checks took', Date.now() - timeBeforeChecks, 'ms');

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

const checkZip = async function checkZip(pathOrDescriptor, options) {
    function toZipDescriptor(input) {
        if (typeof input === 'string') {
            return {
                path: input,
                name: input.match(/(.*\/)?(.*).zip$/)[2]
            };
        }
        return {...input};
    }

    options = Object.assign({}, {
        keepExtractedDir: false
    }, options);

    const zipDescriptor = toZipDescriptor(pathOrDescriptor);

    try {
        const readZip = require('./read-zip');
        const {path: extractedZipPath} = await readZip(zipDescriptor);
        const theme = await check(extractedZipPath, Object.assign({themeName: zipDescriptor.name}, options));

        if (options.keepExtractedDir) {
            return theme;
        } else {
            const fs = require('fs-extra');
            await fs.remove(zipDescriptor.origPath);
            return theme;
        }
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
