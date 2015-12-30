var _       = require('lodash'),
    fs      = require('fs-extra'),
    path    = require('path'),
    PJV     = require('package-json-validator').PJV,
    checkPackageJSON;

checkPackageJSON = function checkPackageJSON(theme) {
    var out = {
            errors: [],
            warnings: [],
            recommendations: []
        },
        packageJSONFile = 'package.json',
        packageJSONPath = path.join(theme.path, packageJSONFile),
        result,
        contents;

    if (!_.some(theme.files, {file: packageJSONFile})) {
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
