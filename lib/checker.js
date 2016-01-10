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
checker = function checkAll(themePath) {
    return readTheme(themePath).then(function (theme) {
        return Promise.map(_.values(checks), function (check) {
            return check(theme);
        }).then(function (result) {
            theme.results = theme.results.concat(_.flatten(result));
            return theme;
        });
    });
};

module.exports = checker;
