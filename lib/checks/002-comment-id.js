const _ = require('lodash');
const spec = require('../specs');
const debug = require('ghost-ignition').debug('checks:comment-id');

let checkCommentID;

// Check 1: 'GS002-DISQUS-ID'
// Look for instances of: this.page.identifier = 'ghost-{{id}}';
// Also the old style disqus embed: var disqus_identifier = 'ghost-{{id}}';
// Check 2: 'GS002-ID-HELPER'
// Look for other usages of {{id}}
const v1RulesToCheck = ['GS002-DISQUS-ID', 'GS002-ID-HELPER'];
const latestRulesToCheck = [];

checkCommentID = function checkCommentID(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);
    
    const rulesToCheck = checkVersion === 'v1' ? v1RulesToCheck : _.union(v1RulesToCheck, latestRulesToCheck);

    _.each(rulesToCheck, function (ruleCode) {
        let check = ruleSet.rules[ruleCode];

        if (!check) {
            debug(`Rule '${ruleCode}' is not defined in rulesest for version '${checkVersion}'`);
            return;
        }

        _.each(theme.files, function (themeFile) {
            var template = themeFile.file.match(/^[^/]+.hbs$/) || themeFile.file.match(/^partials[/\\]+(.*)\.hbs$/);

            if (template) {
                if (themeFile.content.match(check.regex)) {
                    if (!theme.results.fail.hasOwnProperty(ruleCode)) {
                        theme.results.fail[ruleCode] = {failures: []};
                    }

                    theme.results.fail[ruleCode].failures.push(
                        {
                            ref: themeFile.file
                        }
                    );
                }
            }
        });

        if (theme.results.pass.indexOf(ruleCode) === -1 && !theme.results.fail.hasOwnProperty(ruleCode)) {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkCommentID;
