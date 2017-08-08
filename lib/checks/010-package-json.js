var _ = require('lodash'),
    path = require('path'),
    semver = require('semver'),
    validator = require('validator'),
    pfs = require('../promised-fs'),
    _private = {},
    packageJSONFile = 'package.json',
    packageJSONConditionalRules = {
        configPPIsInteger: 'GS010-PJ-CONF-PPP-INT'
    },
    packageJSONValidationRules = _.extend({
        isPresent: 'GS010-PJ-REQ',
        canBeParsed: 'GS010-PJ-PARSE',
        nameIsRequired: 'GS010-PJ-NAME-REQ',
        nameIsLowerCase: 'GS010-PJ-NAME-LC',
        nameIsHyphenated: 'GS010-PJ-NAME-HY',
        versionIsSemverCompliant: 'GS010-PJ-VERSION-SEM',
        versionIsRequired: 'GS010-PJ-VERSION-REQ',
        authorEmailIsValid: 'GS010-PJ-AUT-EM-VAL',
        authorEmailIsRequired: 'GS010-PJ-AUT-EM-REQ',
        configPPPIsRequired: 'GS010-PJ-CONF-PPP'
    }, packageJSONConditionalRules);

_private.validatePackageJSONFields = function validatePackageJSONFields(packageJSON, theme) {
    var failed = [],
        passedRulesToOmit = [];

    if (!packageJSON.name) {
        failed.push(packageJSONValidationRules.nameIsRequired);
        failed.push(packageJSONValidationRules.nameIsLowerCase);
        failed.push(packageJSONValidationRules.nameIsHyphenated);
    }

    if (!packageJSON.version) {
        failed.push(packageJSONValidationRules.versionIsRequired);
        failed.push(packageJSONValidationRules.versionIsSemverCompliant);
    }

    if (!packageJSON.config || _.isNil(packageJSON.config.posts_per_page)) {
        failed.push(packageJSONValidationRules.configPPPIsRequired);
        passedRulesToOmit.push('configPPIsInteger');
    } else if (!_.isNumber(packageJSON.config.posts_per_page) || packageJSON.config.posts_per_page < 1) {
        failed = _.without(failed, packageJSONValidationRules.configPPPIsRequired);
        failed.push(packageJSONValidationRules.configPPIsInteger);
    }

    if (!packageJSON.author || !packageJSON.author.email) {
        failed.push(packageJSONValidationRules.authorEmailIsRequired);
        failed.push(packageJSONValidationRules.authorEmailIsValid);
    }

    if (packageJSON.name && packageJSON.name !== packageJSON.name.toLowerCase()) {
        failed.push(packageJSONValidationRules.nameIsLowerCase);
    }

    if (packageJSON.name && !packageJSON.name.match(/^[a-z0-9]+(\-?[a-z0-9]+)*$/gi)) {
        failed.push(packageJSONValidationRules.nameIsHyphenated);
    }

    if (packageJSON.version && !semver.valid(packageJSON.version)) {
        failed.push(packageJSONValidationRules.versionIsSemverCompliant);
    }

    if (packageJSON.author && packageJSON.author.email && !validator.isEmail(packageJSON.author.email)) {
        failed.push(packageJSONValidationRules.authorEmailIsValid);
    }

    _.extend(theme.results.fail, _private.getFailedRules(failed));

    // add intersection as passed
    theme.results.pass = theme.results.pass.concat(_.xor(failed, _.values(_.omit(packageJSONValidationRules, passedRulesToOmit))));

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

module.exports = function checkPackageJSON(theme, themePath) {
    var packageJSONPath = path.join(theme.path, packageJSONFile);

    // CASE: package.json must be present (if not, all validation rules fail)
    if (!_.some(theme.files, {file: packageJSONFile})) {
        _.extend(theme.results.fail, _private.getFailedRules(_.values(_.omit(packageJSONValidationRules, _.keys(packageJSONConditionalRules)))));
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
                _.extend(theme.results.fail, _private.getFailedRules(_.values(_.omit(packageJSONValidationRules, ['isPresent'].concat(_.keys(packageJSONConditionalRules))))));

                theme.results.fail[packageJSONValidationRules.canBeParsed].failures = [
                    {
                        ref: 'package.json',
                        message: err.message
                    }
                ];

                return theme;
            }
        })
        .catch(function (err) {
            _.extend(theme.results.fail, _private.getFailedRules(_.values(_.omit(packageJSONValidationRules, ['isPresent'].concat(_.keys(packageJSONConditionalRules))))));

            theme.results.fail[packageJSONValidationRules.canBeParsed].failures = [
                {
                    ref: 'package.json',
                    message: err.message
                }
            ];

            return theme;
        });
};
