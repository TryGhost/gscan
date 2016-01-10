var _       = require('lodash'),
    Promise = require('bluebird'),
    fs      = require('fs-extra'),
    path    = require('path'),
    PJV     = require('package-json-validator').PJV,
    checkPackageJSON;

checkPackageJSON = function checkPackageJSON(theme) {
    var out = [],
        packageJSONFile = 'package.json',
        packageJSONPath = path.join(theme.path, packageJSONFile),
        result,
        contents;

    if (!_.some(theme.files, {file: packageJSONFile})) {
        // file doesn't exist
        out.push({
            type: 'warning',
            ref: packageJSONFile,
            message: 'file not present'
        });
    } else {
        // @TODO de-sync this...
        contents = fs.readFileSync(packageJSONPath).toString();
        result = PJV.validate(contents);

        if (!result.valid) {
            // TODO separate out critical JSON issues and validation errors
            out.push({
                type: 'error',
                ref: packageJSONFile,
                message: 'file is invalid - ' + (result.critical || result.errors.join(', '))
            });
        }

        // Come back to this later, packageJSON validator is out of date and we have our own idea of what is important
        //out.warnings = result.warnings ? out.warnings.concat(result.warnings) : out.warnings;
        //out.recommendations = result.recommendations ? out.recommendations.concat(result.recommendations) : out.recommendations;
    }

    return Promise.resolve(out);
};

module.exports = checkPackageJSON;
