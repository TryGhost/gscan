const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const spec = require('../specs');
const debug = require('ghost-ignition').debug('checks:deprecations');

let checkDeprecations;

const v1RulesToCheck = [
    'GS001-DEPR-PURL',
    'GS001-DEPR-MD',
    'GS001-DEPR-IMG',
    'GS001-DEPR-COV',
    'GS001-DEPR-AIMG',
    'GS001-DEPR-PIMG',
    'GS001-DEPR-BC',
    'GS001-DEPR-AC',
    'GS001-DEPR-TIMG',
    'GS001-DEPR-TSIMG',
    'GS001-DEPR-PAIMG',
    'GS001-DEPR-PAC',
    'GS001-DEPR-PTIMG',
    'GS001-DEPR-CON-IMG',
    'GS001-DEPR-CON-COV',
    'GS001-DEPR-CON-BC',
    'GS001-DEPR-CON-AC',
    'GS001-DEPR-CON-AIMG',
    'GS001-DEPR-CON-PAC',
    'GS001-DEPR-CON-PAIMG',
    'GS001-DEPR-CON-TIMG',
    'GS001-DEPR-CON-PTIMG',
    'GS001-DEPR-CON-TSIMG',
    'GS001-DEPR-PPP',
    'GS001-DEPR-C0H',
    'GS001-DEPR-CSS-AT',
    'GS001-DEPR-CSS-PA',
    'GS001-DEPR-CSS-PATS'
];

const latestRulesToCheck = [
    'GS001-DEPR-CSS-KGMD',
    'GS001-DEPR-AUTH-INCL',
    'GS001-DEPR-AUTH-FIELD',
    'GS001-DEPR-AUTH-FILT',
    'GS001-DEPR-AUTHBL',
    'GS001-DEPR-CON-AUTH',
    'GS001-DEPR-CON-PAUTH',
    'GS001-DEPR-AUTH',
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
    'GS001-DEPR-AUTH-URL',
    'GS001-DEPR-PAUTH',
    'GS001-DEPR-PAUTH-ID',
    'GS001-DEPR-PAUTH-SLUG',
    'GS001-DEPR-PAUTH-MAIL',
    'GS001-DEPR-PAUTH-MT',
    'GS001-DEPR-PAUTH-MD',
    'GS001-DEPR-PAUTH-NAME',
    'GS001-DEPR-PAUTH-BIO',
    'GS001-DEPR-PAUTH-LOC',
    'GS001-DEPR-PAUTH-WEB',
    'GS001-DEPR-PAUTH-TW',
    'GS001-DEPR-PAUTH-FB',
    'GS001-DEPR-PAUTH-PIMG',
    'GS001-DEPR-PAUTH-CIMG',
    'GS001-DEPR-PAUTH-URL',
    'GS001-DEPR-NAUTH',
    'GS001-DEPR-IUA',
    'GS001-DEPR-ESC',
    'GS001-DEPR-BPL'
];

checkDeprecations = function checkDeprecations(theme, options, themePath) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);
    
    const rulesToCheck = checkVersion === 'v1' ? v1RulesToCheck : _.union(v1RulesToCheck, latestRulesToCheck);

    _.each(rulesToCheck, function (ruleCode) {
        let check = ruleSet.rules[ruleCode];

        if (!check) {
            debug(`Rule '${ruleCode}' is not defined in rulesest for version '${checkVersion}'`);
            return;
        }

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
