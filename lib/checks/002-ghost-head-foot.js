var _        = require('lodash'),
    Promise = require('bluebird'),
    hbs      = require('express-hbs'),
    checkGhostHeadFoot;

checkGhostHeadFoot = function checkGhostHeadFoot(theme) {
    var out = [];

    if (!theme.helpers || !theme.helpers.hasOwnProperty('ghost_head')) {
        out.push({
            type: 'warning',
            ref: 'ghost_head',
            message: 'helper not present'
        });
    }

    if (!theme.helpers || !theme.helpers.hasOwnProperty('ghost_foot')) {
        out.push({
            type: 'warning',
            ref: 'ghost_foot',
            message: 'helper not present'
        });
    }

    return Promise.resolve(out);
};

module.exports.check = checkGhostHeadFoot;
