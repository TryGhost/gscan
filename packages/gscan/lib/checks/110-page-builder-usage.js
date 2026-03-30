const _ = require('lodash');
const {getRules, applyRule, parseWithAST} = require('../utils/check-utils');

const ruleImplementations = {
    'GS110-NO-MISSING-PAGE-BUILDER-USAGE': {
        isEnabled: true,
        init: ({result}) => {
            result.pageBuilderProperties = new Set();
        },
        eachFile: ({file, theme, log, result, partialVerificationCache}) => {
            const templateTest = file.file.match(/(?<!partials\/.+?)\.hbs$/);

            if (templateTest) {
                parseWithAST({file, theme, rules: {
                    'mark-used-page-properties': require(`../ast-linter/rules/mark-used-page-properties`)
                }, log, partialVerificationCache, callback: (linter) => {
                    linter.usedPageProperties.forEach((variable) => {
                        result.pageBuilderProperties.add(variable);
                    });
                }});
            }
        },
        done: ({log, result}) => {
            // TODO: get this from the spec rather than hard-coding to account for version changes
            const knownPageBuilderProperties = ['show_title_and_feature_image'];
            const notUsedProperties = knownPageBuilderProperties.filter(x => !result.pageBuilderProperties.has(x));

            notUsedProperties.forEach((property) => {
                log.failure({
                    ref: `page.hbs`,
                    message: `@page.${property} is not used`
                });
            });
        }
    },
    'GS110-NO-UNKNOWN-PAGE-BUILDER-USAGE': {
        isEnabled: true,
        eachFile: ({file, theme, log, partialVerificationCache}) => {
            const templateTest = file.file.match(/(?<!partials\/.+?)\.hbs$/);

            if (templateTest) {
                parseWithAST({
                    file, theme, rules: {
                        'no-unknown-page-properties': require(`../ast-linter/rules/lint-no-unknown-page-properties`)
                    }, log, partialVerificationCache, callback: () => {}
                });
            }
        }
    }
};

function checkUsage(theme, options) {
    const rules = getRules('GS110', options);

    _.each(rules, function (check, ruleCode) {
        applyRule({
            code: ruleCode,
            ...check,
            ...ruleImplementations[ruleCode],
            options
        }, theme);
    });

    return theme;
}

module.exports = checkUsage;
