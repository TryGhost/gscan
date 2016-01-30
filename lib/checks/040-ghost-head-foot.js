var _       = require('lodash'),
    Promise = require('bluebird'),
    spec    = require('../../spec.js'),
    checkGhostHeadFoot;

checkGhostHeadFoot = function checkGhostHeadFoot(theme) {
    var out = [],
        checks = [
            {
                helper: 'ghost_head',
                ruleCode: 'ghost_head-required'
            },
            {
                helper: 'ghost_foot',
                ruleCode: 'ghost_foot-required'
            }
        ];

    _.each(checks, function (check) {
        if (!theme.helpers || !theme.helpers.hasOwnProperty(check.helper)) {
            out.push(_.extend({}, spec.rules[check.ruleCode], {
                ref: check.helper,
                message: 'helper not present'
            }));
        }
    });

    return Promise.resolve(out);
};

module.exports = checkGhostHeadFoot;
