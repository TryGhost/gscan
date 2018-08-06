var _ = require('lodash'),
    hbs = require('express-hbs'),
    spec = require('../spec.js'),
    checkTemplatesCompile,
    fakeData = require('../faker');

checkTemplatesCompile = function checkTemplatesCompile(theme) {
    var compileRuleCode = 'GS005-TPL-ERR',
        eachRuleCode = 'GS005-FOREACH-REQ',
        localHbs = hbs.create(),
        compileFailures = [],
        eachFailures = [],
        missingHelper;

    _.each(theme.partials, function (partial) {
        // ensures partials work when running gscan on windows
        var partialName = partial.split('\\').join('/');
        var partialContent = _.find(theme.files, {file: 'partials/' + partial + '.hbs'});
        var partialContentWindows = _.find(theme.files, {file: 'partials\\' + partial + '.hbs'});
        partialContent = partialContent ? partialContent.content : partialContentWindows.content;

        localHbs.registerPartial(partialName, partialContent);
    });

    _.each(spec.knownHelpers, function (helper) {
        // Use standard handlebars {{each}} method for simplicity
        if (helper === 'foreach') {
            localHbs.handlebars.registerHelper('foreach', hbs.handlebars.helpers.each);
        } else if (helper === 'each') {
            localHbs.handlebars.registerHelper('each', function (file) {
                eachFailures.push({ref: file});
            });
        } else {
            localHbs.handlebars.registerHelper(helper, _.noop);
        }
    });

    _.each(theme.files, function (themeFile) {
        var templateTest = themeFile.file.match(/^[^/]+.hbs$/),
            compiled;

        // If this is a main template, test compiling it properly
        if (templateTest) {
            try {
                // When we read the theme, we precompile, here we compile with registered partials and helpers
                // Which will let us detect any missing partials, helpers or parse errors
                compiled = localHbs.handlebars.compile(themeFile.content, {
                    knownHelpers: _.zipObject(spec.knownHelpers, _.map(spec.knownHelpers, function () {
                        return true;
                    })),
                    knownHelpersOnly: true
                });

                // NOTE: fakeData does not resolve finding unknown helpers in context objects!
                compiled(fakeData(themeFile));
            } catch (error) {
                // CASE: transform ugly error message from hbs to the known error message: Missing helper: "X"
                if (error.message.match(/you specified knownhelpersOnly/gi)) {
                    try {
                        missingHelper = error.message.match(/but\sused\sthe\sunknown\shelper\s(.*)\s-/)[1];
                    } catch (err) {
                        missingHelper = 'unknown helper name';
                    }

                    error.message = 'Missing helper: "' + missingHelper + '"';
                }

                compileFailures.push({
                    ref: themeFile.file,
                    message: error.message
                });
            }
        }
    });

    if (compileFailures.length > 0) {
        theme.results.fail[compileRuleCode] = {failures: compileFailures};
    } else {
        theme.results.pass.push(compileRuleCode);
    }

    if (eachFailures.length > 0) {
        theme.results.fail[eachRuleCode] = {failures: eachFailures};
    } else {
        theme.results.pass.push(eachRuleCode);
    }

    return theme;
};

module.exports = checkTemplatesCompile;
