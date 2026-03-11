const _ = require('lodash');
const {getRules, applyRule, parseWithAST} = require('../utils/check-utils');

const ruleImplementations = {
    'GS100-NO-UNUSED-CUSTOM-THEME-SETTING': {
        isEnabled: ({theme}) => {
            return !!theme.customSettings;
        },
        init: ({result}) => {
            result.customThemeSettings = new Set();
        },
        eachFile: ({file, theme, log, result, partialVerificationCache}) => {
            let templateTest = file.file.match(/(?<!partials\/.+?)\.hbs$/);

            if (templateTest) {
                parseWithAST({file, theme, rules: {
                    'mark-used-custom-theme-setting': require(`../ast-linter/rules/mark-used-custom-theme-settings`)
                }, log, partialVerificationCache, callback: (linter) => {
                    linter.customThemeSettings.forEach((variable) => {
                        result.customThemeSettings.add(variable);
                    });
                }});
            }
        },
        done: ({log, theme, result}) => {
            const config = Object.keys(theme.customSettings);
            const notUsedVariable = config.filter(x => !result.customThemeSettings.has(x));

            if (notUsedVariable.length > 0) {
                log.failure({
                    message: `Found unused variables: ${notUsedVariable.map(x => '@custom.' + x).join(', ')}`,
                    ref: 'package.json'
                });
            }
        }
    }
};

function checkUsage(theme, options) {
    const rules = getRules('GS100', options);

    _.each(rules, function (check, ruleCode) {
        applyRule({
            code: ruleCode,
            ...check,
            ...ruleImplementations[ruleCode]
        }, theme);
    });

    return theme;
}

module.exports = checkUsage;
