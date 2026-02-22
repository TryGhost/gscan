const spec = require('../specs');
const versions = require('../utils').versions;
const {getPackageJSON} = require('../utils');

const checkKoenigCssClasses = function checkKoenigCssClasses(theme, options) {
    const checkVersion = options?.checkVersion ?? versions.default;
    let ruleSet = spec.get([checkVersion]);

    // CASE: 050-koenig-css-classes checks only needs `rules` that start with `GS050-`
    const ruleRegex = /GS050-.*/g;

    // Following the introduction of card assets, we disable certain rules
    // when it's enabled by the theme.
    const packageJson = getPackageJSON(theme, ruleSet.defaultPackageJSON);
    const cardAssetsEnabled = packageJson
        && packageJson.config
        && packageJson.config.card_assets === true;
    const enabledCards = packageJson
        && packageJson.config
        && packageJson.config.card_assets
        && Array.isArray(packageJson.config.card_assets.include)
        && packageJson.config.card_assets.include;
    const disabledCards = !enabledCards // include takes priority over exclude
        && packageJson
        && packageJson.config
        && packageJson.config.card_assets
        && Array.isArray(packageJson.config.card_assets.exclude)
        && packageJson.config.card_assets.exclude;

    ruleSet = Object.fromEntries(Object.entries(ruleSet.rules).filter(([ruleCode, rule]) => {
        if (rule.cardAsset && (cardAssetsEnabled
            || (enabledCards && enabledCards.includes(rule.cardAsset))
            || (disabledCards && !disabledCards.includes(rule.cardAsset)))) {
            return false; // skip rule
        }
        if (ruleCode.match(ruleRegex)) {
            return true;
        }
        return false;
    }));

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

module.exports = checkKoenigCssClasses;
