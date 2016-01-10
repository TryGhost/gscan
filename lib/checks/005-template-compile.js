var _       = require('lodash'),
    Promise = require('bluebird'),
    hbs     = require('express-hbs'),
    spec    = require('../../spec.js'),
    checkTemplatesCompile;

checkTemplatesCompile = function checkTemplatesCompile(theme) {
    var out = [],
        localHbs = hbs.create();

    _.each(theme.partials, function (partial) {
        localHbs.handlebars.registerPartial(partial, '');
    });

    _.each(spec.knownHelpers, function (helper) {
        localHbs.handlebars.registerHelper(helper, _.noop);
    });

    _.each(theme.files, function (themeFile) {
        var templateTest = themeFile.file.match(/^[^\/]+.hbs$/),
            compiled;

        // If this is a main template, test compiling it properly
        if (templateTest) {
            try {
                // When we read the theme, we precompile, here we compile with registered partials and helpers
                // Which will let us detect any missing partials, helpers or parse errors
                compiled = localHbs.handlebars.compile(themeFile.content);
                compiled({});
            } catch (error) {
                out.push({
                    type: 'error',
                    ref: themeFile.file,
                    message: error.message
                });
            }

        }
    });

    return Promise.resolve(out);
};

module.exports = checkTemplatesCompile;
