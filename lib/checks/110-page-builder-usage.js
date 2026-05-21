const _ = require('lodash');
const spec = require('../specs');
const {versions} = require('../utils');
const {getRules, applyRule, parseWithAST} = require('../utils/check-utils');

function findPageTemplateRef(theme) {
    if (!theme || !Array.isArray(theme.files)) {
        return 'page.hbs';
    }

    const pageHbs = theme.files.find(f => f.normalizedFile === 'page.hbs');
    if (pageHbs) {
        return pageHbs.normalizedFile;
    }

    const pageOverride = theme.files.find(f => /^page-[^/]+\.hbs$/.test(f.normalizedFile));
    if (pageOverride) {
        return pageOverride.normalizedFile;
    }

    return 'page.hbs';
}

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
        done: ({theme, log, result, options}) => {
            const checkVersion = _.get(options, 'checkVersion', versions.default);
            const knownPageBuilderProperties = spec.get([checkVersion]).pageBuilderProperties || [];
            const notUsedProperties = knownPageBuilderProperties.filter(x => !result.pageBuilderProperties.has(x));

            if (!notUsedProperties.length) {
                return;
            }

            const ref = findPageTemplateRef(theme);

            notUsedProperties.forEach((property) => {
                log.failure({
                    ref,
                    message: `<code>{{@page.${property}}}</code> is not used in any template — gate the relevant markup with <code>{{#if @page.${property}}}…{{/if}}</code> so this editor setting takes effect.`
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
