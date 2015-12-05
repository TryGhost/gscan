var _        = require('lodash'),
    readGlob = require('read-glob-promise'),
    checkGhostHeadFoot,

    hbsGlob = '**/*.hbs';

checkGhostHeadFoot = function checkGhostHeadFoot(themePath) {
    var out = {
        errors: [],
        warnings: [],
        recommendations: []
    };

    return readGlob(hbsGlob, {cwd: themePath, realpath: true, encoding: 'utf8'}).then(function (contents) {
        var hasGhostHead = false,
            hasGhostFoot = false;
        _.each(contents, function (content) {
            if (content.match(/{\{ghost_head}}/)) {
                hasGhostHead = true;
            }
            if (content.match(/{\{ghost_foot}}/)) {
                hasGhostFoot = true;
            }
        });

        if (!hasGhostHead) {
            out.errors.push('ghost_head: helper not present')
        }

        if (!hasGhostFoot) {
            out.errors.push('ghost_foot: helper not present')
        }

        return out;
    });
};

module.exports.check = checkGhostHeadFoot;
