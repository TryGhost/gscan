const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const spec = require('../specs');
const versions = require('../utils').versions;

let checkAssets = function checkAssets(theme, options, themePath) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    const ruleSet = spec.get([checkVersion]);

    let ruleToCheck = 'GS030-ASSET-REQ';
    let failures = [];
    let assetMatch;
    let stats;

    _.filter(theme.files, {ext: '.hbs'}).forEach(function (template) {
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
    failures = [];

    theme.files.forEach(function (theme) {
        try {
            stats = fs.lstatSync(path.join(themePath, theme.file));

            if (stats.isSymbolicLink()) {
                failures.push({ref: theme.file});
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

    return theme;
};

module.exports = checkAssets;
