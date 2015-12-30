var _        = require('lodash'),
    hbs      = require('express-hbs'),
    checkGhostHeadFoot;

checkGhostHeadFoot = function checkGhostHeadFoot(theme) {
    var out = {
            errors: [],
            warnings: [],
            recommendations: []
        },
        hasGhostHead = false,
        hasGhostFoot = false;

    _.each(theme.files, function (themeFile) {
        if (themeFile.ext === '.hbs') {
            if (themeFile.compiled.match(/helpers\.ghost_head/)) {
                hasGhostHead = true;
            }
            if (themeFile.compiled.match(/helpers\.ghost_foot/)) {
                hasGhostFoot = true;
            }
        }
    });

    if (!hasGhostHead) {
        out.errors.push('ghost_head: helper not present')
    }

    if (!hasGhostFoot) {
        out.errors.push('ghost_foot: helper not present')
    }

    return out;
};

module.exports.check = checkGhostHeadFoot;
