var _       = require('lodash'),
    Promise = require('bluebird'),
    checkThemeStructure;

checkThemeStructure = function checkThemeStructure(theme) {
    var out = [],
    defaultPath = 'default.hbs',
    postPath = 'post.hbs',
    indexPath = 'index.hbs';

    if (!_.some(theme.files, {file: indexPath})) {
        // file doesn't exist
        out.push({
            type: 'error',
            ref: indexPath,
            message: 'file not present'
        });
    }

    if (!_.some(theme.files, {file: postPath})) {
        // file doesn't exist
        out.push({
            type: 'error',
            ref: postPath,
            message: 'file not present'
        });
    }

    if (!_.some(theme.files, {file: defaultPath})) {
        // file doesn't exist
        out.push({
            type: 'recommendation',
            ref: defaultPath,
            message: 'file not present'
        });
    }

    return Promise.resolve(out);
};

module.exports.check = checkThemeStructure;
