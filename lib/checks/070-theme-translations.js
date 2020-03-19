const {get} = require('lodash');
const spec = require('../specs');

module.exports = function checkTranslations(theme, options) {
    const ruleToCheck = 'GS070-VALID-TRANSLATIONS';

    const checkVersion = get(options, 'checkVersion', 'latest');
    let ruleSet = spec.get([checkVersion]);
    const failures = [];

    if (!(ruleToCheck in ruleSet.rules)) {
        return theme;
    }

    for (const file of theme.files) {
        if (!file.file.match(/locales\/.*\.json$/)) {
            continue;
        }

        try {
            JSON.parse(file.content);
        } catch (error) {
            failures.push({
                ref: file.file,
                message: 'Unable to parse'
            });
        }
    }

    if (failures.length > 0) {
        theme.results.fail[ruleToCheck] = {failures};
    } else {
        theme.results.pass.push(ruleToCheck);
    }

    return theme;
};
