const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;
const ASTLinter = require('../ast-linter');
const {normalizePath} = require('../utils');

function processFileFunction(files, failures, theme, partialsFound) {
    const processedFiles = [];

    return function processFile(linter, themeFile) {
        if (processedFiles.includes(themeFile.file)) {
            return;
        }

        processedFiles.push(themeFile.file);

        const astResults = linter.verify({
            parsed: themeFile.parsed,
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
            if (!theme.helpers[helper.name]) {
                theme.helpers[helper.name] = [];
            }
            theme.helpers[helper.name].push(themeFile.file);
        });

        linter.partials.forEach((partial) => {
            partialsFound[partial] = true;
            const file = files.find(f => normalizePath(f.file) === `partials/${normalizePath(partial)}.hbs`);
            if (file) {
                processFile(linter, file);
            }
        });
    };
}

const checkTemplatesCompile = function checkTemplatesCompile(theme, options) {
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

    const processFile = processFileFunction(theme.files, failures, theme, partialsFound);

    _.each(rulesToCheck, function (check, ruleCode) {
        const linter = new ASTLinter({
            partials: theme.partials,
            helpers: ruleSet.knownHelpers
        });

        _.each(theme.files, function (themeFile) {
            let templateTest = themeFile.file.match(/^[^/\\]+.hbs$/);

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
