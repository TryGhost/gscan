var Promise = require('bluebird'),
    requireDir = require('require-dir'),
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
    var output = {},
        ops = {};

    Object.keys(checks).forEach(function (key) {
        ops[key] = checks[key].check(themePath);
    });

    return Promise.props(ops);
};

module.exports.check = check;
