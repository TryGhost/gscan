var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    checkAssets;

checkAssets = function checkAssets(theme, themePath) {
    var assetRegex = /(src|href)=['"](.*?\/assets\/.*?)['"]/gmi,
        assetMatch, stats, ruleCode, failures;

    // Use Asset helper
    ruleCode = 'GS030-ASSET-REQ';
    failures = [];

    theme.files.forEach(function (theme) {

      try {
        while ((assetMatch = assetRegex.exec(theme.content)) !== null) {
          failures.push({ref: assetMatch[2]});
        }
      }  catch (err) {
          // ignore
      }
    });

    if (failures.length > 0) {
        theme.results.fail[ruleCode] = {failures: failures};
    } else {
        theme.results.pass.push(ruleCode);
    }

    // no symlinks
    ruleCode = 'GS030-ASSET-SYM';
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
        theme.results.fail[ruleCode] = {failures: failures};
    } else {
        theme.results.pass.push(ruleCode);
    }

    return theme;
};

module.exports = checkAssets;
