var _       = require('lodash'),
    hbs     = require('express-hbs'),
    spec    = require('../spec.js'),
    checkTemplatesCompile,
    fakeData = require('../faker');

checkTemplatesCompile = function checkTemplatesCompile(theme) {
    var ruleCode = 'GS005-TPL-ERR',
        localHbs = hbs.create(),
        failures = [];

    _.each(theme.partials, function (partial) {
        var partialContent = _.find(theme.files, {file: 'partials/' + partial + '.hbs'}).content;
        localHbs.registerPartial(partial, partialContent);
    });

    _.each(spec.knownHelpers, function (helper) {
        // Use standard handlebars {{each}} method for simplicity
        if (helper === 'foreach') {
            localHbs.handlebars.registerHelper('foreach', hbs.handlebars.helpers.each);
        } else {
            localHbs.handlebars.registerHelper(helper, _.noop);
        }
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
                // We need to provide a minimum dataset to enable certain blocks such as {{#post}}.. to execute
                compiled(fakeData(themeFile));
            } catch (error) {
                failures.push({
                    ref: themeFile.file,
                    message: error.message
                });
            }
        }
    });

    if (failures.length > 0) {
        theme.results.fail[ruleCode] = {failures: failures};
    } else {
        theme.results.pass.push(ruleCode);
    }

    return theme;
};

module.exports = checkTemplatesCompile;
