const _ = require('lodash');
const spec = require('../specs');
const debug = require('ghost-ignition').debug('checks:theme-structure');

let checkThemeStructure;

// TODO: template inspection
//_.each(spec.templates, function (template) {
//    var match = _.find(theme.files, function (themeFile) {
//        return themeFile.file.match(template.pattern);
//    });
//
//    if (match) {
//        out.push({
//            level: 'feature',
//            ref: template.name,
//            message: 'template is provided'
//        });
//    }
//});

const v1RulesToCheck = ['GS020-INDEX-REQ', 'GS020-POST-REQ', 'GS020-DEF-REC'];

const latestRulesToCheck = [];

checkThemeStructure = function checkThemeStructure(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);
    
    const rulesToCheck = checkVersion === 'v1' ? v1RulesToCheck : _.union(v1RulesToCheck, latestRulesToCheck);

    _.each(rulesToCheck, function (ruleCode) {
        let check = ruleSet.rules[ruleCode];

        if (!check) {
            debug(`Rule '${ruleCode}' is not defined in rulesest for version '${checkVersion}'`);
            return;
        }

        if (!_.some(theme.files, {file: check.path})) {
            // file doesn't exist
            theme.results.fail[ruleCode] = {};
        } else {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkThemeStructure;
