const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const spec = require('../specs');

let checkDeprecations;

checkDeprecations = function checkDeprecations(theme, options, themePath) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
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
            const template = themeFile.file.match(/^[^/]+.hbs$/) || themeFile.file.match(/^partials[/\\]+(.*)\.hbs$/);
            const skipTemplateCheck = check.notValidIn && check.notValidIn.match(template);
            let css = themeFile.file.match(/\.css/);
            let cssDeprecations;

            if (template && !check.css && !skipTemplateCheck) {
                if (themeFile.content.match(check.regex)) {
                    if (!theme.results.fail.hasOwnProperty(ruleCode)) {
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
                    css = fs.readFileSync(path.join(themePath, themeFile.file), 'utf8');
                    cssDeprecations = css.match(check.regex);

                    if (cssDeprecations) {
                        _.each(cssDeprecations, function (cssDeprecation) {
                            if (!theme.results.fail.hasOwnProperty(ruleCode)) {
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

        if (theme.results.pass.indexOf(ruleCode) === -1 && !theme.results.fail.hasOwnProperty(ruleCode)) {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkDeprecations;
