const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;
const packageJSONFileName = 'package.json';

module.exports = function checkPresence(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);
    let [packageJSON] = _.filter(theme.files, {file: packageJSONFileName});
    let targetApiVersion = versions.default;
    if (packageJSON && packageJSON.content) {
        let packageJSONParsed = JSON.parse(packageJSON.content);
        targetApiVersion = (packageJSONParsed && packageJSONParsed.engines && packageJSONParsed.engines['ghost-api']) || versions.default;
    }

    const ruleRegex = /GS081-.*/g;
    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    _.each(ruleSet, function (check, ruleCode) {
        let helperExists = false;

        _.each(theme.files, function (themeFile) {
            const template = themeFile.file.match(/[^/]+.hbs$/);
            const validApi = check.validInAPI ? check.validInAPI.includes(targetApiVersion) : true;

            if (template) {
                if (validApi && themeFile.content.match(check.regex)) {
                    helperExists = true;

                    return false; // break loop early
                }
            }
        });

        if (helperExists) {
            // pass
            if (theme.results.pass.indexOf(ruleCode) === -1) {
                theme.results.pass.push(ruleCode);
            }
        } else {
            // fail
            if (!Object.prototype.hasOwnProperty.call(theme.results.fail, ruleCode)) {
                theme.results.fail[ruleCode] = {};
                theme.results.fail[ruleCode].failures = [];
            }
        }
    });

    return theme;
};
