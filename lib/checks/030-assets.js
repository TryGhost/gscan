const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const spec = require('../specs');
// const debug = require('ghost-ignition').debug('checks:assets');

let checkAssets;

checkAssets = function checkAssets(theme, options, themePath) {
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);

    let ruleToCheck = 'GS030-ASSET-REQ';
    let failures = [];
    let defaultHbs = _.filter(theme.files, {file: 'default.hbs'});
    let assetMatch;
    let stats;

    if (!_.isEmpty(defaultHbs)) {
        defaultHbs = defaultHbs[0];
        while ((assetMatch = ruleSet.rules[ruleToCheck].regex.exec(defaultHbs.content)) !== null) {
            failures.push({ref: 'default.hbs', message: `${assetMatch[2]}`});
        }
    }

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
