var _ = require('lodash'),
    checkCommentID;

checkCommentID = function checkCommentID(theme, themePath) {
    var checks = [
        // Check 1:
        // Look for instances of: this.page.identifier = 'ghost-{{id}}';
        // Also the old style disqus embed: var disqus_identifier = 'ghost-{{id}}';
        {
            regex: /(page\.|disqus_)identifier\s?=\s?['"].*?({{\s*?id\s*?}}).*?['"];?/g,
            ruleCode: 'GS002-DISQUS-ID'
        },
        // Check 2:
        // Look for other usages of {{id}}
        {
            regex: /({{\s*?id\s*?}})/g,
            ruleCode: 'GS002-ID-HELPER'
        }
    ];

    _.each(checks, function (check) {
        _.each(theme.files, function (themeFile) {
            var template = themeFile.file.match(/^[^\/]+.hbs$/) || themeFile.file.match(/^partials[\/\\]+(.*)\.hbs$/);

            if (template) {
                if (themeFile.content.match(check.regex)) {
                    if (!theme.results.fail.hasOwnProperty(check.ruleCode)) {
                        theme.results.fail[check.ruleCode] = {failures: []};
                    }

                    theme.results.fail[check.ruleCode].failures.push(
                        {
                            ref: themeFile.file
                        }
                    );
                }
            }
        });

        if (theme.results.pass.indexOf(check.ruleCode) === -1 && !theme.results.fail.hasOwnProperty(check.ruleCode)) {
            theme.results.pass.push(check.ruleCode);
        }
    });

    return theme;
};

module.exports = checkCommentID;
