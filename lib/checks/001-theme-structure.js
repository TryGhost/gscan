var _ = require('lodash'),
    checkThemeStructure;

checkThemeStructure = function checkThemeStructure(theme) {
    var out = {
        errors: [],
        warnings: [],
        recommendations: []
    },
    defaultPath = 'default.hbs',
    postPath = 'post.hbs',
    indexPath = 'index.hbs';

    if (!_.some(theme.files, {file: indexPath})) {
        // file doesn't exist
        out.errors.push('index.hbs: file not present');
    }

    if (!_.some(theme.files, {file: postPath})) {
        // file doesn't exist
        out.errors.push('post.hbs: file not present');
    }

    if (!_.some(theme.files, {file: defaultPath})) {
        // file doesn't exist
        out.recommendations.push('default.hbs: file not present');
    }

    return out;
};

module.exports.check = checkThemeStructure;
