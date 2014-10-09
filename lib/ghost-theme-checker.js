var path    = require('path'),
    fs      = require('fs'),
    check,
    checks;

function pathToPackageJSON(themePath) {
    var packageJSON = 'package.json';
    return path.join(themePath, packageJSON);
}


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
checks = {
    checkPackageJSON: function (themePath) {
        var out = {
                errors: [],
                warnings: [],
                recommendations: []
            },
            packageJSONPath = pathToPackageJSON(themePath),
            contents;

        if (!fs.existsSync(packageJSONPath)) {
            // file doesn't exist
            out.warnings.push('package.json: file not present');
        } else {
            contents = fs.readFileSync(packageJSONPath).toString();
            if (!contents.name) {
                out.warnings.push('package.json: missing `name`');
            }

            if (!contents.version) {
                out.warnings.push('package.json: missing `version`');
            }

            if (!contents.author) {
                out.warnings.push('package.json: missing `author`');
            }
        }

        return out;
    }
};


check = function (themePath) {
    return checks.checkPackageJSON(themePath);
};

module.exports.check = check;

