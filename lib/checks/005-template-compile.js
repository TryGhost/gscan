const _ = require('lodash');
const hbs = require('express-hbs');
const spec = require('../specs');
const versions = require('../utils').versions;
const ASTLinter = require('../../lib/ast-linter');

function processFileFunction(files, failures, theme, partialsFound) {
    return function processFile(linter, themeFile) {
        const astResults = linter.verify({
            rules: [
                require('../ast-linter/rules/lint-no-unknown-partials'),
                require('../ast-linter/rules/mark-used-partials'),
                require('../ast-linter/rules/lint-no-unknown-helpers'),
                require('../ast-linter/rules/mark-used-helpers')
            ],
            source: themeFile.content,
            moduleId: themeFile.file
        });

        if (astResults.length) {
            failures.push({
                ref: themeFile.file,
                message: astResults[0].message
            });
        }

        theme.helpers = theme.helpers || {};
        linter.helpers.forEach((helper) => {
            if (!theme.helpers[helper.node]) {
                theme.helpers[helper.node] = [];
            }
            theme.helpers[helper.node].push(themeFile.file);
        });

        linter.partials.forEach((partial) => {
            partialsFound[partial] = true;
            const file = files.find(f => f.file === `partials/${partial}.hbs`);
            if (file) {
                processFile(linter, file);
            }
        });
    };
}

const checkTemplatesCompile = function checkTemplatesCompile(theme, options) {
    const localHbs = hbs.create();
    const failures = [];
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    const ruleSet = spec.get([checkVersion]);

    let partialsFound = {};

    // Reset theme.helpers to make sure we only get helpers that are used
    theme.helpers = {};

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

    const processFile = processFileFunction(theme.files, failures, theme, partialsFound);

    _.each(rulesToCheck, function (check, ruleCode) {
        const linter = new ASTLinter({
            partials: theme.partials,
            helpers: ruleSet.knownHelpers
        });

        _.each(theme.files, function (themeFile) {
            let templateTest = themeFile.file.match(/^[^/]+.hbs$/);

            if (templateTest) {
                processFile(linter, themeFile);
            }
        });

        theme.partials = Object.keys(partialsFound);

        if (failures.length > 0) {
            theme.results.fail[ruleCode] = {failures: failures};
        } else {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkTemplatesCompile;
