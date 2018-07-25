const _ = require('lodash');
const spec = require('../specs');
const debug = require('ghost-ignition').debug('checks:ghost-head-foot');

let checkGhostHeadFoot;

const v1RulesToCheck = ['GS040-GH-REQ', 'GS040-GF-REQ'];

const latestRulesToCheck = [];

checkGhostHeadFoot = function checkGhostHeadFoot(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);
    
    const rulesToCheck = checkVersion === 'v1' ? v1RulesToCheck : _.union(v1RulesToCheck, latestRulesToCheck);

    _.each(rulesToCheck, function (ruleCode) {
        let check = ruleSet.rules[ruleCode];

        if (!check) {
            debug(`Rule '${ruleCode}' is not defined in rulesest for version '${checkVersion}'`);
            return;
        }

        if (!theme.helpers || !theme.helpers.hasOwnProperty(check.helper)) {
            theme.results.fail[ruleCode] = {};
        } else {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkGhostHeadFoot;
