var _       = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    checkAssets;

checkAssets = function checkAssets(theme, themePath) {
    var ruleCode = 'GS030-ASSET-REQ',
        failures = [],
        defaultHbs = _.filter(theme.files, {file: 'default.hbs'}),
        assetRegex = /(src|href)=['"](.*?\/assets\/.*?)['"]/gmi,
        assetMatch, stats;

    if (!_.isEmpty(defaultHbs)) {
        defaultHbs = defaultHbs[0];
        while ((assetMatch = assetRegex.exec(defaultHbs.content)) !== null) {
            failures.push({ref: assetMatch[2]});
        }
    }

    if (failures.length > 0) {
        theme.results.fail[ruleCode] = {failures: failures};
    } else {
        theme.results.pass.push(ruleCode);
    }

    ruleCode = 'GS030-ASSET-SYM';
    failures = [];

    theme.files.forEach(function (theme) {
        try {
            stats = fs.lstatSync(path.join(themePath, theme.file));

            if (stats.isSymbolicLink()) {
                failures.push({ref: theme.file});
            }
        } catch(err) {
            // ignore
        }

    });

    if (failures.length > 0) {
        theme.results.fail[ruleCode] = {failures: failures};
    } else {
        theme.results.pass.push(ruleCode);
    }

    return theme;
};

module.exports = checkAssets;
