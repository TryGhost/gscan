var Promise    = require('bluebird'),
    _          = require('lodash'),
    requireDir = require('require-dir'),
    readTheme  = require('./read-theme'),
    checker,
    checks;

checks = requireDir('./checks');

/**
 * Check theme
 *
 * Takes a theme path, reads the theme, and checks it for issues.
 * Returns a theme object.
 * @param themePath
 * @returns {Object}
 */
checker = function checkAll(themePath, options) {
    options = options || {};

    return readTheme(themePath).then(function (theme) {
        return Promise.reduce(_.values(checks), function (theme, check) {
            return check(theme, themePath, options);
        }, theme);
    });
};

module.exports = checker;
