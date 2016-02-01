var _       = require('lodash'),
    Promise = require('bluebird'),
    checkThemeStructure;

// TODO: template inspection
//_.each(spec.templates, function (template) {
//    var match = _.find(theme.files, function (themeFile) {
//        return themeFile.file.match(template.pattern);
//    });
//
//    if (match) {
//        out.push({
//            level: 'feature',
//            ref: template.name,
//            message: 'template is provided'
//        });
//    }
//});

checkThemeStructure = function checkThemeStructure(theme) {
    var out = [],
        checks = [
            {
                path: 'index.hbs',
                type: 'error'
            },
            {
                path: 'post.hbs',
                type: 'error'
            },
            {
                path: 'default.hbs',
                type: 'recommendation'
            }
        ];

    _.each(checks, function (check) {
        if (!_.some(theme.files, {file: check.path})) {
            // file doesn't exist
            out.push({
                type: check.type,
                ref: check.path,
                message: 'file not present'
            });
        }
    });

    return Promise.resolve(out);
};

module.exports = checkThemeStructure;
