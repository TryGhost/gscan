const Promise = require('bluebird');
const _ = require('lodash');
const requireDir = require('require-dir');
const {errors} = require('ghost-ignition');
const readTheme = require('./read-theme');
const versions = require('./utils').versions;

const checks = requireDir('./checks');

/**
 * Check theme
 *
 * Takes a theme path, reads the theme, and checks it for issues.
 * Returns a theme object.
 * @param {string} themePath
 * @param {Object} options
 * @param {string} [options.checkVersion] version to check the theme against
 * @param {string} [options.themeName] name of the checked theme
 * @returns {Promise<Object>}
 */
const checker = function checkAll(themePath, options = {}) {
    const passedVersion = _.get(options, 'checkVersion', versions.default);
    let version = passedVersion;

    if (passedVersion === 'v4') {
        version = 'canary';
    }

    return readTheme(themePath)
        .then(function (theme) {
            // set the major version to check
            theme.checkedVersion = versions[version].major;

            return Promise.reduce(_.values(checks), function (themeToCheck, check) {
                return check(themeToCheck, options, themePath);
            }, theme);
        })
        .catch((error) => {
            throw new errors.ValidationError({
                message: 'Failed theme files check',
                help: 'Your theme file structure is corrupted or contains errors',
                errorDetails: error.message,
                context: options.themeName,
                err: error
            });
        });
};

module.exports = checker;
