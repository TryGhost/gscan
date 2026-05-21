const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;
const ASTLinter = require('../ast-linter');

function processFileFunction(files, failures, theme, partialsFound) {
    const processedFiles = [];

    return function processFile(linter, themeFile, parentInlinePartials = []) {
        if (processedFiles.includes(themeFile.file)) {
            return;
        }

        processedFiles.push(themeFile.file);

        // Reset inline partial variables
        linter.inlinePartials = [];
        linter.options.inlinePartials = [];

        linter.verify({
            parsed: themeFile.parsed,
            rules: [
                require('../ast-linter/rules/mark-declared-inline-partials')
            ],
            source: themeFile.content,
            moduleId: themeFile.file
        });

        // Store the inline partials for the actual partial linting
        const inlinePartials = linter.inlinePartials;
        linter.options.inlinePartials = [...inlinePartials, ...parentInlinePartials];

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
            const first = astResults[0];
            failures.push({
                ref: themeFile.file,
                message: first.message,
                ...(first.code ? {code: first.code} : {})
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
            const partialName = partial.node;
            partialsFound[partialName] = true;

            const file = files.find(f => f.normalizedFile === `partials/${partial.normalizedName}.hbs`);
            if (file) {
                // Find all inline partial declaration that were within the partial usage block
                const childrenInlinePartials = [...parentInlinePartials];
                for (const inline of inlinePartials) {
                    //Only partials that are in scope
                    if (inline.parents.some(node => node.type === partial.type &&
                        node.loc.source === partial.loc.source &&
                        node.loc.start.line === partial.loc.start.line &&
                        node.loc.start.column === partial.loc.start.column &&
                        node.loc.end.line === partial.loc.end.line &&
                        node.loc.end.column === partial.loc.end.column)) {
                        // Override the `parents` attribute as the inline partials are in another context than the children file
                        childrenInlinePartials.push({
                            ...inline,
                            parents: []
                        });
                    }
                }
                processFile(linter, file, childrenInlinePartials);
            }
        });
    };
}

const DEFAULT_CODE = 'GS005-TPL-ERR';

const checkTemplatesCompile = function checkTemplatesCompile(theme, options) {
    const failures = [];
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    const ruleSet = spec.get([checkVersion]);

    let partialsFound = {};

    // Reset theme.helpers to make sure we only get helpers that are used
    theme.helpers = {};

    const rulesToCheck = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        return /^GS005-/.test(ruleCode);
    });

    const processFile = processFileFunction(theme.files, failures, theme, partialsFound);

    const linter = new ASTLinter({
        partials: theme.partials,
        helpers: ruleSet.knownHelpers
    });

    _.each(theme.files, function (themeFile) {
        if (themeFile.file.match(/(?<!partials\/.+?)\.hbs$/)) {
            processFile(linter, themeFile);
        }
    });

    theme.partials = Object.keys(partialsFound);

    // Route each failure to its target rule code (default for parse errors,
    // missing partials, and missing helpers — they're all GS005-TPL-ERR).
    // The lint rules attach a `code` field to flag the rule they belong to.
    const failuresByCode = _.groupBy(failures, f => f.code || DEFAULT_CODE);

    _.each(rulesToCheck, function (rule, ruleCode) {
        const matchingFailures = (failuresByCode[ruleCode] || []).map(f => _.omit(f, 'code'));
        if (matchingFailures.length > 0) {
            theme.results.fail[ruleCode] = {failures: matchingFailures};
        } else {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkTemplatesCompile;
