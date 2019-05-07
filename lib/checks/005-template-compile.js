const _ = require('lodash');
const hbs = require('express-hbs');
const fakeData = require('../faker');
const spec = require('../specs');
// const debug = require('ghost-ignition').debug('checks:template-compiler');

let checkTemplatesCompile;

checkTemplatesCompile = function checkTemplatesCompile(theme, options) {
    const localHbs = hbs.create();
    const failures = [];
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);

    let missingHelper;

    // CASE: 001-deprecations checks only needs `rules` that start with `GS001-DEPR-`
    const ruleRegex = /GS005-.*/g;

    const rulesToCheck = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    _.each(theme.partials, function (partial) {
        // ensures partials work when running gscan on windows
        let partialName = partial.split('\\').join('/');
        let partialContent = _.find(theme.files, {file: 'partials/' + partial + '.hbs'});
        let partialContentWindows = _.find(theme.files, {file: 'partials\\' + partial + '.hbs'});
        partialContent = partialContent ? partialContent.content : partialContentWindows.content;

        localHbs.registerPartial(partialName, partialContent);
    });

    _.each(rulesToCheck, function (check, ruleCode) {
        _.each(ruleSet.knownHelpers, function (helper) {
            // Use standard handlebars {{each}} method for simplicity
            if (helper === 'foreach') {
                localHbs.handlebars.registerHelper('foreach', hbs.handlebars.helpers.each);
            } else {
                localHbs.handlebars.registerHelper(helper, _.noop);
            }
        });

        _.each(theme.files, function (themeFile) {
            let templateTest = themeFile.file.match(/^[^/]+.hbs$/);
            let compiled;

            // If this is a main template, test compiling it properly
            if (templateTest) {
                try {
                    // When we read the theme, we precompile, here we compile with registered partials and helpers
                    // Which will let us detect any missing partials, helpers or parse errors
                    compiled = localHbs.handlebars.compile(themeFile.content, {
                        knownHelpers: _.zipObject(ruleSet.knownHelpers, _.map(ruleSet.knownHelpers, function () {
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
    });

    return theme;
};

module.exports = checkTemplatesCompile;
