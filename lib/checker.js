const _ = require('lodash');
const nodeFs = require('fs');
const nodePath = require('path');
const debug = require('@tryghost/debug')('checker');

const errors = require('@tryghost/errors');
const versions = require('./utils').versions;

// An object containing helpers as keys and their labs flag as values
// E.g. match:  'matchHelper'
const labsEnabledHelpers = {
};

function loadChecks(deps = {}) {
    const fsImpl = deps.nodeFs || nodeFs;
    const pathImpl = deps.nodePath || nodePath;
    const checksDir = pathImpl.join(__dirname, 'checks');

    return fsImpl.readdirSync(checksDir)
        .filter(fileName => fileName.endsWith('.js'))
        .reduce((checks, fileName) => {
            const checkName = pathImpl.basename(fileName, '.js');
            checks[checkName] = require(pathImpl.join(checksDir, fileName));
            return checks;
        }, {});
}

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
const check = async function checkAll(themePath, options = {}, deps = {}) {
    const debugImpl = deps.debug || debug;
    const enabledHelpers = deps.labsEnabledHelpers || labsEnabledHelpers;
    const errorsImpl = deps.errors || errors;
    const loadChecksFn = deps.loadChecks || loadChecks;
    const readTheme = deps.readTheme || require('./read-theme');
    const specsImpl = deps.specs || require('./specs');
    const versionsImpl = deps.versions || versions;

    // Require checks late to avoid loading all until used
    const checks = options.skipChecks === true ? {} : loadChecksFn();
    const passedVersion = _.get(options, 'checkVersion', versionsImpl.default);
    let version = passedVersion;

    if (passedVersion === 'canary') {
        version = versionsImpl.canary;
        options.checkVersion = versionsImpl.canary;
    }

    _.each(enabledHelpers, (flag, helper) => {
        if (_.has(options.labs, flag)) {
            const spec = specsImpl.get([version]);
            if (!spec.knownHelpers.includes(helper)) {
                spec.knownHelpers.push(helper);
            }
        }
    });

    try {
        const theme = await readTheme(themePath);

        // set the major version to check
        theme.checkedVersion = versionsImpl[version].major;

        const timeBeforeChecks = Date.now();

        for (const checkName in checks) {
            const now = Date.now();
            await checks[checkName](theme, options, themePath);
            debugImpl(checkName, 'took', Date.now() - now, 'ms');
        }

        debugImpl('All checks took', Date.now() - timeBeforeChecks, 'ms');

        return theme;
    } catch (err) {
        throw new errorsImpl.ValidationError({
            message: 'Failed theme files check',
            help: 'Your theme file structure is corrupted or contains errors',
            errorDetails: err.message,
            context: options.themeName,
            err
        });
    }
};

const checkZip = async function checkZip(path, options, deps = {}) {
    const checkFn = deps.check || check;
    const errorsImpl = deps.errors || errors;
    const fsImpl = deps.fs || require('fs-extra');
    const readZip = deps.readZip || require('./read-zip');

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
        ({path: extractedZipPath} = await readZip(zip));
        return await checkFn(extractedZipPath, Object.assign({themeName: zip.name}, options), deps);
    } catch (error) {
        if (!errorsImpl.utils.isGhostError(error)) {
            throw new errorsImpl.ValidationError({
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
            await fsImpl.remove(zip.origPath);
        }
    }
};

module.exports = {
    check,
    checkZip,
    _private: {
        labsEnabledHelpers,
        loadChecks
    }
};
