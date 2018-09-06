const _ = require('lodash');
const spec = require('../specs');
const fs = require('fs-extra');
const path = require('path');

let checkKoenigCssClasses;

checkKoenigCssClasses = function checkKoenigCssClasses(theme, options, themePath) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    let ruleSet = spec.get([checkVersion]);

    // CASE: 050-koenig-css-classes checks only needs `rules` that start with `GS050-`
    const ruleRegex = /GS050-.*/g;

    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    _.each(ruleSet, function (check, ruleCode) {
        if (theme.files) {
            // Check CSS files and HBS files for presence of the classes
            _.each(theme.files, function (themeFile) {
                if (!['.css', '.hbs'].includes(themeFile.ext)) {
                    return;
                }

                try {
                    themeFile = fs.readFileSync(path.join(themePath, themeFile.file), 'utf8');
                    let cssPresent = themeFile.match(check.regex);

                    if (cssPresent && theme.results.pass.indexOf(ruleCode) === -1) {
                        theme.results.pass.push(ruleCode);
                    }
                } catch (err) {
                    // ignore for now
                }
            });
        }

        if (!theme.files || (theme.results.pass.indexOf(ruleCode) === -1 && !theme.results.fail.hasOwnProperty(ruleCode))) {
            theme.results.fail[ruleCode] = {};
            theme.results.fail[ruleCode].failures = [
                {
                    ref: 'styles'
                }
            ];
        }
    });

    return theme;
};

module.exports = checkKoenigCssClasses;
