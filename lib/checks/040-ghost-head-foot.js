var _       = require('lodash'),
    checkGhostHeadFoot;

checkGhostHeadFoot = function checkGhostHeadFoot(theme) {
    var checks = [
            {
                helper: 'ghost_head',
                ruleCode: 'GS040-GH-REQ'
            },
            {
                helper: 'ghost_foot',
                ruleCode: 'GS040-GF-REQ'
            }
        ];

    _.each(checks, function (check) {
        if (!theme.helpers || !theme.helpers.hasOwnProperty(check.helper)) {
            theme.results.fail[check.ruleCode] = {};
        } else {
            theme.results.pass.push(check.ruleCode);
        }
    });

    return theme;
};

module.exports = checkGhostHeadFoot;
