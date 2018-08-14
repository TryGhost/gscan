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
        let cssFiles = [];

        // Get all CSS files
        _.each(theme.files, function (themeFile) {
            if (themeFile.file.match(/\.css/)) {
                cssFiles.push(themeFile);
            }
        });

        if (cssFiles.length) {
            // Cheeck CSS files for presence of the classes
            _.each(cssFiles, function (cssFile) {
                try {
                    cssFile = fs.readFileSync(path.join(themePath, cssFile.file), 'utf8');
                    let cssPresent = cssFile.match(check.regex);

                    if (cssPresent && theme.results.pass.indexOf(ruleCode) === -1) {
                        theme.results.pass.push(ruleCode);
                    }
                } catch (err) {
                    // ignore for now
                }
            });
        }

        if (!cssFiles || (theme.results.pass.indexOf(ruleCode) === -1 && !theme.results.fail.hasOwnProperty(ruleCode))) {
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
