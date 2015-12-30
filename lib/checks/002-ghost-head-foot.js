var _        = require('lodash'),
    hbs      = require('express-hbs'),
    checkGhostHeadFoot;

checkGhostHeadFoot = function checkGhostHeadFoot(theme) {
    var out = {
            errors: [],
            warnings: [],
            recommendations: []
        };

    if (!theme.helpers || !theme.helpers.hasOwnProperty('ghost_head')) {
        out.errors.push('ghost_head: helper not present')
    }

    if (!theme.helpers || !theme.helpers.hasOwnProperty('ghost_foot')) {
        out.errors.push('ghost_foot: helper not present')
    }

    return out;
};

module.exports.check = checkGhostHeadFoot;
