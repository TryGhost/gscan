var Promise    = require('bluebird'),
    requireDir = require('require-dir'),
    readTheme  = require('./read-theme'),
    check,
    checks;

checks = requireDir('./checks');

/**
 * Each check takes a themePath
 *
 * Each check has a glob for the files it operates on
 *
 * Response object from a check is:
 * {
 *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */

check = function (themePath) {
    return readTheme(themePath).then(function (theme) {
        return Promise.reduce(Object.keys(checks), function (results, key) {
            return checks[key].check(theme).then(function (result) {
                return results.concat(result);
            });
        }, []);
    });
};

module.exports.check = check;
