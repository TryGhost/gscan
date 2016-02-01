var _        = require('lodash'),
    Promise = require('bluebird'),
    checkGhostHeadFoot;

checkGhostHeadFoot = function checkGhostHeadFoot(theme) {
    var out = [],
        checks = [
            {
                helper: 'ghost_head',
                type: 'warning'
            },
            {
                helper: 'ghost_foot',
                type: 'warning'
            }
        ];

    _.each(checks, function (check) {
        if (!theme.helpers || !theme.helpers.hasOwnProperty(check.helper)) {
            out.push({
                type: check.type,
                ref: check.helper,
                message: 'helper not present'
            });
        }
    });

    return Promise.resolve(out);
};

module.exports = checkGhostHeadFoot;
