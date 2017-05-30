var _       = require('lodash'),
    checkDeprecations,
    warnings = [];

checkDeprecations = function checkDeprecations(theme) {
    var checks = [
            {
                helper: new RegExp(/{{pageUrl(\s\S+)?}}/i),
                ruleCode: 'GS001-DEPR-PURL'
            },
            {
                helper: '{{meta_description}}',
                ruleCode: 'GS001-DEPR-MD'
            },
            {
                helper: '{{image}}',
                ruleCode: 'GS001-DEPR-IMG'
            },
            {
                helper: '{{author.image}}',
                ruleCode: 'GS001-DEPR-AIMG'
            },
            {
                helper: '{{post.image}}',
                ruleCode: 'GS001-DEPR-PIMG'
            },
            {
                helper: '{{@blog.cover}}',
                ruleCode: 'GS001-DEPR-BC'
            },
            {
                helper: '{{author.cover}}',
                ruleCode: 'GS001-DEPR-AC'
            },
            {
                helper: '{{post.image}}',
                ruleCode: 'GS001-DEPR-TIMG'
            },
            {
                helper: '{{@blog.posts_per_page}}',
                ruleCode: 'GS001-DEPR-PPP'
            },
            {
                helper: new RegExp(/{{content words=("|')0("|')}}/),
                ruleCode: 'GS001-DEPR-C0H'
            }
        ];


    _.each(theme.files, function (themeFile) {
        var template = themeFile.file.match(/^[^\/]+.hbs$/) || themeFile.file.match(/^partials[\/\\]+(.*)+\.hbs$/);

        if (template) {
            _.each(checks, function (check) {
                if (themeFile.content.match(check.helper)) {
                    theme.results.fail[check.ruleCode] = {};
                } else {
                    theme.results.pass.push(check.ruleCode);
                }
            });
        }
    });

    return theme;
};

module.exports = checkDeprecations;
