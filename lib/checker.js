const _ = require('lodash');

const errors = require('@tryghost/errors');
const {runChecks, checkFiles, checkBuffer} = require('./run-checks');

// This module holds the Node-only entry points that read from the filesystem.
// The filesystem-free core (runChecks, checkFiles, checkBuffer) lives in
// run-checks.js so it can be bundled for non-Node runtimes; importing this
// file pulls in the on-disk readers (read-theme.js / read-zip.js).

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
