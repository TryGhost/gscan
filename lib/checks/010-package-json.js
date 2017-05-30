var _ = require('lodash'),
    path = require('path'),
    semver = require('semver'),
    validator = require('validator'),
    pfs = require('../promised-fs'),
    _private = {},
    packageJSONFile = 'package.json',
    packageJSONValidationRules = {
        isPresent: 'GS010-PJ-REQ',
        canBeParsed: 'GS010-PJ-PARSE',
        nameIsRequired: 'GS010-PJ-NAME-REQ',
        nameIsLowerCase: 'GS010-PJ-NAME-LC',
        nameIsHyphenated: 'GS010-PJ-NAME-HY',
        versionIsSemverCompliant: 'GS010-PJ-VERSION-SEM',
        versionIsRequired: 'GS010-PJ-VERSION-REQ',
        authorEmailIsValid: 'GS010-PJ-AUT-EM-VAL',
        authorEmailIsRequired: 'GS010-PJ-AUT-EM-REQ'
    };

_private.validatePackageJSONFields = function validatePackageJSONFields(packageJSON, theme) {
    var failed = {};

    if (!packageJSON.name) {
        failed[packageJSONValidationRules.nameIsRequired] = {};
    }

    if (!packageJSON.version) {
        failed[packageJSONValidationRules.versionIsRequired] = {};
    }

    if (!packageJSON.author || !packageJSON.author.email) {
        failed[packageJSONValidationRules.authorEmailIsRequired] = {};
    }

    if (!packageJSON.name || packageJSON.name !== packageJSON.name.toLowerCase()) {
        failed[packageJSONValidationRules.nameIsLowerCase] = {};
    }

    if (!packageJSON.name || !packageJSON.name.match(/^[a-z0-9]+\-?[a-z0-9]+$/gi)) {
        failed[packageJSONValidationRules.nameIsHyphenated] = {};
    }

    if (!packageJSON.version || !semver.valid(packageJSON.version)) {
        failed[packageJSONValidationRules.versionIsSemverCompliant] = {};
    }

    if (!packageJSON.author || !validator.isEmail(packageJSON.author.email)) {
        failed[packageJSONValidationRules.authorEmailIsValid] = {};
    }

    _.extend(theme.results.fail, failed);

    // add intersection as passed
    theme.results.pass = theme.results.pass.concat(_.xor(Object.keys(failed), _.values(packageJSONValidationRules)));

    return theme;
};

/**
 * Sucks!
 * The current implementation expects:
 *
 * { 'rule-code': {} }
 */
_private.getFailedRules = function getFailedRules(keys) {
    return _.zipObject(keys, _.map(keys, function () {
        return {};
    }));
};

module.exports = function checkPackageJSON(theme) {
    var packageJSONPath = path.join(theme.path, packageJSONFile);

    // CASE: package.json must be present (if not, all validation rules fail)
    if (!_.some(theme.files, {file: packageJSONFile})) {
        _.extend(theme.results.fail, _private.getFailedRules(_.values(packageJSONValidationRules)));
        return theme;
    }

    // CASE: package.json must be valid
    return pfs.readFile(packageJSONPath, 'utf8')
        .then(function (packageJSON) {
            try {
                packageJSON = JSON.parse(packageJSON);
                theme = _private.validatePackageJSONFields(packageJSON, theme);

                theme.name = packageJSON.name;
                theme.version = packageJSON.version;
                return theme;
            } catch (err) {
                _.extend(theme.results.fail, _private.getFailedRules(_.values(_.omit(packageJSONValidationRules, 'isPresent'))));
                return theme;
            }
        })
        .catch(function () {
            _.extend(theme.results.fail, _private.getFailedRules(_.values(_.omit(packageJSONValidationRules, 'isPresent'))));
            return theme;
        });
};
