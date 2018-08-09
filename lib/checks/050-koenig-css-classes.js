const _ = require('lodash');
const spec = require('../specs');
const fs = require('fs-extra');
const path = require('path');
const debug = require('ghost-ignition').debug('checks:koenig-css-classes');

let checkKoenigCssClasses;

const v1RulesToCheck = [];

const latestRulesToCheck = ['GS050-CSS-KGWW', 'GS050-CSS-KGWF'];

checkKoenigCssClasses = function checkKoenigCssClasses(theme, options, themePath) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);
    
    const rulesToCheck = checkVersion === 'v1' ? v1RulesToCheck : _.union(v1RulesToCheck, latestRulesToCheck);

    _.each(rulesToCheck, function (ruleCode) {
        let check = ruleSet.rules[ruleCode];
        let cssFiles = [];

        if (!check) {
            debug(`Rule '${ruleCode}' is not defined in rulesest for version '${checkVersion}'`);
            return;
        }

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
        }
    });

    return theme;
};

module.exports = checkKoenigCssClasses;
