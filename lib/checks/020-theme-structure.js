var _       = require('lodash'),
    Promise = require('bluebird'),
    spec    = require('../../spec.js'),
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
                ruleCode: 'index.hbs-required'
            },
            {
                path: 'post.hbs',
                ruleCode: 'post.hbs-required'
            },
            {
                path: 'default.hbs',
                ruleCode: 'default.hbs-recommended'
            }
        ];

    _.each(checks, function (check) {
        if (!_.some(theme.files, {file: check.path})) {
            // file doesn't exist
            out.push(_.extend({}, spec.rules[check.ruleCode], {
                ref: check.path,
                message: 'file not present'
            }));
        }
    });

    return Promise.resolve(out);
};

module.exports = checkThemeStructure;
