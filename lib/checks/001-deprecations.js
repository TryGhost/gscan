const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;

// {{author}} and its properties are correctly available in the current context
// while inside an {{#is "author"}}...{{/is}} block (e.g. in default.hbs), so
// deprecation checks for those helpers should ignore content in these blocks.
const authorIsBlockRegex = /{{#is\s+[^}]*\bauthor\b[^}]*}}[\s\S]*?{{\/is}}/g;

const authorContextAwareRules = [
    'GS001-DEPR-AUTH',
    'GS001-DEPR-CON-AUTH',
    'GS001-DEPR-AUTH-ID',
    'GS001-DEPR-AUTH-SLUG',
    'GS001-DEPR-AUTH-MAIL',
    'GS001-DEPR-AUTH-MT',
    'GS001-DEPR-AUTH-MD',
    'GS001-DEPR-AUTH-NAME',
    'GS001-DEPR-AUTH-BIO',
    'GS001-DEPR-AUTH-LOC',
    'GS001-DEPR-AUTH-WEB',
    'GS001-DEPR-AUTH-TW',
    'GS001-DEPR-AUTH-FB',
    'GS001-DEPR-AUTH-PIMG',
    'GS001-DEPR-AUTH-CIMG',
    'GS001-DEPR-AUTH-URL'
];

function getCheckableContent(content, ruleCode) {
    if (authorContextAwareRules.includes(ruleCode)) {
        return content.replace(authorIsBlockRegex, '');
    }

    return content;
}

const checkDeprecations = function checkDeprecations(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);

    // CASE: 001-deprecations checks only needs `rules` that start with `GS001-`
    const ruleRegex = /GS001-.*/g;

    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    _.each(ruleSet, function (check, ruleCode) {
        _.each(theme.files, function (themeFile) {
            const template = themeFile.file.match(/^.+\.hbs$/);
            const skipTemplateCheck = check.notValidIn && check.notValidIn.match(template);
            let css = themeFile.file.match(/\.css$/);
            let cssDeprecations;

            if (template && !check.css && !skipTemplateCheck) {
                if (getCheckableContent(themeFile.content, ruleCode).match(check.regex)) {
                    if (!Object.prototype.hasOwnProperty.call(theme.results.fail, (ruleCode))) {
                        theme.results.fail[ruleCode] = {failures: []};
                    }

                    theme.results.fail[ruleCode].failures.push(
                        {
                            ref: themeFile.file,
                            message: 'Please remove or replace ' + check.helper + ' from this template'
                        }
                    );
                }
            } else if (css && check.css && !skipTemplateCheck) {
                try {
                    css = themeFile.content;
                    cssDeprecations = css.match(check.regex);

                    if (cssDeprecations) {
                        _.each(cssDeprecations, function (cssDeprecation) {
                            if (!Object.prototype.hasOwnProperty.call(theme.results.fail, ruleCode)) {
                                theme.results.fail[ruleCode] = {failures: []};
                            }

                            theme.results.fail[ruleCode].failures.push(
                                {
                                    ref: themeFile.file,
                                    message: 'Please remove or replace ' + cssDeprecation.trim() + ' from this css file.'
                                }
                            );
                        });
                    }
                } catch (err) {
                // ignore for now
                }
            }
        });

        if (theme.results.pass.indexOf(ruleCode) === -1 && !Object.prototype.hasOwnProperty.call(theme.results.fail, ruleCode)) {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkDeprecations;
