const spec = require('../specs');
const versions = require('../utils').versions;

const checkGhostHeadFoot = function checkGhostHeadFoot(theme, options) {
    const checkVersion = options?.checkVersion ?? versions.default;
    let ruleSet = spec.get([checkVersion]);

    // CASE: 040-ghost-head-foot checks only needs `rules` that start with `GS040-`
    const ruleRegex = /GS040-.*/g;

    ruleSet = Object.fromEntries(Object.entries(ruleSet.rules).filter(([ruleCode]) => ruleCode.match(ruleRegex)));

    Object.entries(ruleSet).forEach(([ruleCode, check]) => {
        if (!theme.helpers || !Object.prototype.hasOwnProperty.call(theme.helpers, check.helper)) {
            theme.results.fail[ruleCode] = {
                failures: [{
                    ref: 'default.hbs'
                }]
            };
        } else {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkGhostHeadFoot;
