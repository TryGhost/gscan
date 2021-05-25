const _ = require('lodash');
const semver = require('semver');
const isEmail = require('validator/lib/isEmail');
const _private = {};
const packageJSONFileName = 'package.json';
const versions = require('../utils').versions;
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

const v2PackageJSONConditionalRules = {};

const v2PackageJSONValidationRules = _.extend({},
    {isMarkedGhostTheme: 'GS010-PJ-KEYWORDS'},
    v2PackageJSONConditionalRules);

const v3PackageJSONConditionalRules = {};
const v3PackageJSONValidationRules = _.extend({},
    {isPresentEngineGhostAPI: 'GS010-PJ-GHOST-API'},
    {isv01EngineGhostAPI: 'GS010-PJ-GHOST-API-V01'},
    v3PackageJSONConditionalRules
);

const canaryPackageJSONConditionalRules = {};
const canaryPackageJSONValidationRules = _.extend({},
    {isv2EngineGhostAPI: 'GS010-PJ-GHOST-API-V2'},
    canaryPackageJSONConditionalRules
);

_private.validatePackageJSONFields = function validatePackageJSONFields(packageJSON, theme, packageJSONValidationRules) {
    let failed = [];
    const passedRulesToOmit = [];

    // Only add this rule to the failed list if it's defined in packageJSONValidationRules
    function markFailed(rule) {
        if (packageJSONValidationRules[rule]) {
            failed.push(packageJSONValidationRules[rule]);
        }
    }

    if (!packageJSON.name) {
        markFailed('nameIsRequired');
        passedRulesToOmit.push('nameIsLowerCase');
        passedRulesToOmit.push('nameIsHyphenated');
    }

    if (!packageJSON.version) {
        markFailed('versionIsRequired');
        passedRulesToOmit.push('versionIsSemverCompliant');
    }

    if (!packageJSON.config || _.isNil(packageJSON.config.posts_per_page)) {
        markFailed('configPPPIsRequired');
        passedRulesToOmit.push('configPPIsInteger');
    } else if (!_.isNumber(packageJSON.config.posts_per_page) || packageJSON.config.posts_per_page < 1) {
        failed = _.without(failed, packageJSONValidationRules.configPPPIsRequired);
        markFailed('configPPIsInteger');
    }

    if (!packageJSON.author || !packageJSON.author.email) {
        markFailed('authorEmailIsRequired');
        passedRulesToOmit.push('authorEmailIsValid');
    }

    if (!packageJSON.keywords || !_.isArray(packageJSON.keywords) || !_.includes(packageJSON.keywords, 'ghost-theme')) {
        markFailed('isMarkedGhostTheme');
    }

    if (packageJSON.name && packageJSON.name !== packageJSON.name.toLowerCase()) {
        markFailed('nameIsLowerCase');
    }

    if (packageJSON.name && !packageJSON.name.match(/^[a-z0-9]+(-?[a-z0-9]+)*$/gi)) {
        markFailed('nameIsHyphenated');
    }

    if (packageJSON.version && !semver.valid(packageJSON.version)) {
        markFailed('versionIsSemverCompliant');
    }

    if (packageJSON.author && packageJSON.author.email && !isEmail(packageJSON.author.email)) {
        markFailed('authorEmailIsValid');
    }

    if (!packageJSON.engines || !packageJSON.engines['ghost-api']) {
        markFailed('isPresentEngineGhostAPI');
    }

    if (packageJSON.engines && packageJSON.engines['ghost-api']) {
        // NOTE: checks for same versions as were available in Ghost 2.0 (v0.1, ^0.1 etc.)
        //      ref.: https://github.com/TryGhost/Ghost/blob/bc41550/core/frontend/services/themes/engines/create.js#L10-L16
        const coerced = semver.coerce(packageJSON.engines['ghost-api']);

        if (coerced !== null) {
            const major = semver.major(coerced);

            if (major === 0) {
                markFailed('isv01EngineGhostAPI');
            }

            if (major === 2) {
                markFailed('isv2EngineGhostAPI');
            }
        }
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
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let packageJSONValidationRules;
    let packageJSONConditionalRules;

    if (checkVersion === 'v1') {
        packageJSONValidationRules = v1PackageJSONValidationRules;
        packageJSONConditionalRules = v1PackageJSONConditionalRules;
    } else if (checkVersion === 'v2') {
        packageJSONValidationRules = _.merge({}, v1PackageJSONValidationRules, v2PackageJSONValidationRules);
        packageJSONConditionalRules = _.merge({}, v1PackageJSONConditionalRules, v2PackageJSONConditionalRules);
    } else if (checkVersion === 'v3') {
        packageJSONValidationRules = _.merge({}, v1PackageJSONValidationRules, v2PackageJSONValidationRules, v3PackageJSONValidationRules);
        packageJSONConditionalRules = _.merge({}, v1PackageJSONConditionalRules, v2PackageJSONConditionalRules, v3PackageJSONConditionalRules);
    } else {
        // default check for current version 'v4'/'canary' rules
        packageJSONValidationRules = _.merge({}, v1PackageJSONValidationRules, v2PackageJSONValidationRules, v3PackageJSONValidationRules, canaryPackageJSONValidationRules);
        packageJSONConditionalRules = _.merge({}, v1PackageJSONConditionalRules, v2PackageJSONConditionalRules, v3PackageJSONConditionalRules, canaryPackageJSONConditionalRules);
    }

    let [packageJSON] = _.filter(theme.files, {file: packageJSONFileName});

    // CASE: package.json must be valid
    if (packageJSON && packageJSON.content) {
        try {
            let packageJSONParsed = JSON.parse(packageJSON.content);
            theme = _private.validatePackageJSONFields(packageJSONParsed, theme, packageJSONValidationRules);

            theme.name = packageJSONParsed.name;
            theme.version = packageJSONParsed.version;
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
    } else {
        // CASE: package.json must be present (if not, all validation rules fail)
        const rules = _private.getFailedRules(_.values(_.omit(packageJSONValidationRules, _.keys(packageJSONConditionalRules))));

        _.each(rules, (rule, key) => {
            theme.results.fail[key] = {};
            theme.results.fail[key].failures = [
                {
                    ref: packageJSONFileName
                }
            ];
        });

        return theme;
    }
};
