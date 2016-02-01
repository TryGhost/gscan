var _       = require('lodash'),
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
    var checks = [
            {
                path: 'index.hbs',
                ruleCode: 'GS020-INDEX-REQ'
            },
            {
                path: 'post.hbs',
                ruleCode: 'GS020-POST-REQ'
            },
            {
                path: 'default.hbs',
                ruleCode: 'GS020-DEF-REC'
            }
        ];

    _.each(checks, function (check) {
        if (!_.some(theme.files, {file: check.path})) {
            // file doesn't exist
            theme.results.fail[check.ruleCode] = {};
        } else {
            theme.results.pass.push(check.ruleCode);
        }
    });

    return theme;
};

module.exports = checkThemeStructure;
