var path = require('path'),
    fs = require('fs'),
    checkThemeStructure;

function pathToTemplate(themePath, template) {
    return path.join(themePath, template);
}

checkThemeStructure = function checkThemeStructure(themePath) {
    var out = {
        errors: [],
        warnings: [],
        recommendations: []
    },
    defaultPath = pathToTemplate(themePath, 'default.hbs'),
    postPath = pathToTemplate(themePath, 'post.hbs'),
    indexPath = pathToTemplate(themePath, 'index.hbs');

    if (!fs.existsSync(indexPath)) {
        // file doesn't exist
        out.errors.push('index.hbs: file not present');
    }

    if (!fs.existsSync(postPath)) {
        // file doesn't exist
        out.errors.push('post.hbs: file not present');
    }

    if (!fs.existsSync(defaultPath)) {
        // file doesn't exist
        out.recommendations.push('default.hbs: file not present');
    }

    return out;
};

module.exports.check = checkThemeStructure;
