const spec = require('../specs');
const versions = require('../utils').versions;

const checkAssets = function checkAssets(theme, options) {
    const checkVersion = options?.checkVersion ?? versions.default;
    const ruleSet = spec.get([checkVersion]);

    let ruleToCheck = 'GS030-ASSET-REQ';
    let failures = [];
    let assetMatch;

    theme.files.filter(file => file.ext === '.hbs').forEach(function (template) {
        try {
            while ((assetMatch = ruleSet.rules[ruleToCheck].regex.exec(template.content)) !== null) {
                failures.push({ref: template.file, message: assetMatch[2]});
            }
        } catch (err) {
            // ignore
        }
    });

    if (failures.length > 0) {
        theme.results.fail[ruleToCheck] = {failures: failures};
    } else {
        theme.results.pass.push(ruleToCheck);
    }

    ruleToCheck = 'GS030-ASSET-SYM';
    failures = theme
        .files
        .filter(f => f.symlink)
        .map(f => ({ref: f.file}));

    if (failures.length > 0) {
        theme.results.fail[ruleToCheck] = {failures: failures};
    } else {
        theme.results.pass.push(ruleToCheck);
    }

    return theme;
};

module.exports = checkAssets;
