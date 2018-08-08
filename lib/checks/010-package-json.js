const _ = require('lodash');
const path = require('path');
const semver = require('semver');
const validator = require('validator');
const pfs = require('../promised-fs');
const _private = {};
const packageJSONFile = 'package.json';
// const debug = require('ghost-ignition').debug('checks:package-json');

const v1PackageJSONConditionalRules = {
    configPPIsInteger: 'GS010-PJ-CONF-PPP-INT'
};
const v1PackageJSONValidationRules = _.extend({
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
}, v1PackageJSONConditionalRules);

const latestPackageJSONConditionalRules = {};

const latestPackageJSONValidationRules = _.extend({}, latestPackageJSONConditionalRules);

_private.validatePackageJSONFields = function validatePackageJSONFields(packageJSON, theme, packageJSONValidationRules) {
    let failed = [];
    const passedRulesToOmit = [];

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

    if (packageJSON.name && !packageJSON.name.match(/^[a-z0-9]+(-?[a-z0-9]+)*$/gi)) {
        failed.push(packageJSONValidationRules.nameIsHyphenated);
    }

    if (packageJSON.version && !semver.valid(packageJSON.version)) {
        failed.push(packageJSONValidationRules.versionIsSemverCompliant);
    }

    if (packageJSON.author && packageJSON.author.email && !validator.isEmail(packageJSON.author.email)) {
        failed.push(packageJSONValidationRules.authorEmailIsValid);
    }

    const failedRules = _private.getFailedRules(failed);
    _.each(failedRules, (rule, key) => {
        theme.results.fail[key] = {};
        theme.results.fail[key].failures = [
            {
                ref: 'package.json'
            }
        ];
    });

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

module.exports = function checkPackageJSON(theme, options) {
    const packageJSONPath = path.join(theme.path, packageJSONFile);
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const packageJSONValidationRules = checkVersion === 'v1' ? v1PackageJSONValidationRules : _.merge(v1PackageJSONValidationRules, latestPackageJSONValidationRules);
    const packageJSONConditionalRules = checkVersion === 'v1' ? v1PackageJSONConditionalRules : _.merge(v1PackageJSONConditionalRules, latestPackageJSONConditionalRules);

    // CASE: package.json must be present (if not, all validation rules fail)
    if (!_.some(theme.files, {file: packageJSONFile})) {
        const rules = _private.getFailedRules(_.values(_.omit(packageJSONValidationRules, _.keys(packageJSONConditionalRules))));

        _.each(rules, (rule, key) => {
            theme.results.fail[key] = {};
            theme.results.fail[key].failures = [
                {
                    ref: 'package.json'
                }
            ];
        });

        return theme;
    }

    // CASE: package.json must be valid
    return pfs.readFile(packageJSONPath, 'utf8')
        .then((packageJSON) => {
            try {
                packageJSON = JSON.parse(packageJSON);
                theme = _private.validatePackageJSONFields(packageJSON, theme, packageJSONValidationRules);

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
        .catch((err) => {
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
