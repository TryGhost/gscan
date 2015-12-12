var _        = require('lodash'),
    hbs      = require('express-hbs'),
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
            var compiledContent;
            try {
                compiledContent = hbs.handlebars.precompile(content);
            } catch (e) {
                out.errors.push('Invalid template');
            }

            if (compiledContent.match(/helpers\.ghost_head/)) {
                hasGhostHead = true;
            }
            if (compiledContent.match(/helpers\.ghost_foot/)) {
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
