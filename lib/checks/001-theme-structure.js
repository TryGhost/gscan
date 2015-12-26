var _ = require('lodash'),
    checkThemeStructure;

checkThemeStructure = function checkThemeStructure(themePath, themeFiles) {
    var out = {
        errors: [],
        warnings: [],
        recommendations: []
    },
    defaultPath = 'default.hbs',
    postPath = 'post.hbs',
    indexPath = 'index.hbs';

    if (!_.some(themeFiles, {file: indexPath})) {
        // file doesn't exist
        out.errors.push('index.hbs: file not present');
    }

    if (!_.some(themeFiles, {file: postPath})) {
        // file doesn't exist
        out.errors.push('post.hbs: file not present');
    }

    if (!_.some(themeFiles, {file: defaultPath})) {
        // file doesn't exist
        out.recommendations.push('default.hbs: file not present');
    }

    return out;
};

module.exports.check = checkThemeStructure;
