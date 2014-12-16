var fs      = require('fs'),
    path    = require('path'),
    PJV     = require('package-json-validator').PJV,
    checkPackageJSON;


function pathToPackageJSON(themePath) {
    var packageJSON = 'package.json';
    return path.join(themePath, packageJSON);
}

checkPackageJSON = function checkPackageJSON(themePath) {
    var out = {
            errors: [],
            warnings: [],
            recommendations: []
        },
        packageJSONPath = pathToPackageJSON(themePath),
        result,
        contents;

    if (!fs.existsSync(packageJSONPath)) {
        // file doesn't exist
        out.errors.push('package.json: file not present');
    } else {
        contents = fs.readFileSync(packageJSONPath).toString();
        result = PJV.validate(contents);

        if (!result.valid) {
            out.errors.push('package.json: file is invalid - ' + result.critical);
        }

        out.warnings = result.warnings ? out.warnings.concat(result.warnings) : out.warnings;
        out.recommendations = result.recommendations ? out.recommendations.concat(result.recommendations) : out.recommendations;
    }

    return out;
};

module.exports.check = checkPackageJSON;
