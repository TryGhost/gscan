const spec = require('../specs');
const versions = require('../utils').versions;

const checkCustomFontsCssProperties = function checkCustomFontsCssProperties(theme, options) {
    const checkVersion = options?.checkVersion ?? versions.default;
    let ruleSet = spec.get([checkVersion]);

    // CASE: 051-custom-fonts-css-properties checks only needs `rules` that start with `GS051-`
    const ruleRegex = /GS051-.*/g;

    ruleSet = Object.fromEntries(Object.entries(ruleSet.rules).filter(([ruleCode]) => ruleCode.match(ruleRegex)));

    Object.entries(ruleSet).forEach(([ruleCode, check]) => {
        if (theme.files) {
            // Check CSS files and HBS files for presence of the classes
            theme.files.forEach((themeFile) => {
                if (!['.css', '.hbs'].includes(themeFile.ext)) {
                    return;
                }

                try {
                    let cssPresent = themeFile.content.match(check.regex);

                    if (cssPresent && theme.results.pass.indexOf(ruleCode) === -1) {
                        theme.results.pass.push(ruleCode);
                    }
                } catch (err) {
                    // ignore for now
                }
            });
        }

        if (!theme.files || (theme.results.pass.indexOf(ruleCode) === -1 && !Object.prototype.hasOwnProperty.call(theme.results.fail, ruleCode))) {
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

module.exports = checkCustomFontsCssProperties;
