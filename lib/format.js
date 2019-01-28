const _ = require('lodash');
const spec = require('./specs');
const levelWeights = {
    error: 10,
    warning: 3,
    recommendation: 1
};

let format;
let calcScore;

calcScore = function calcScore(results, stats) {
    var maxScore, actualScore, balancedScore;

    maxScore = _.reduce(levelWeights, function (max, weight, level) {
        return max + (weight * stats[level]);
    }, 0);

    actualScore = _.reduce(levelWeights, function (max, weight, level) {
        return max - (weight * _.size(results[level]));
    }, maxScore);

    balancedScore = _.ceil((100 / maxScore) * actualScore);

    return {
        value: balancedScore,
        level: _.size(results.error) > 0 ? 'error' : balancedScore < 60 ? 'warning' : 'passing'
    };
};

/**
 * TODO: This needs cleaning up, a lot
 */
format = function format(theme, options = {}) {
    options = _.extend({onlyFatalErrors: false, sortByFiles: false}, options);
    const checkVersion = _.get(options, 'checkVersion', 'latest');
    const ruleSet = spec.get([checkVersion]);

    var processedCodes = [],
        hasFatalErrors = false,
        stats = {
            error: 0,
            warning: 0,
            recommendation: 0
        };

    theme.results.error = [];
    theme.results.warning = [];
    theme.results.recommendation = [];
    theme.results.missing = [];

    _.each(theme.results.fail, function (info, code) {
        const rule = ruleSet.rules[code];

        if (rule.fatal && options.onlyFatalErrors || options.onlyFatalErrors === false) {
            if (rule.fatal) {
                hasFatalErrors = true;
            }

            theme.results[rule.level].push(_.extend({}, _.merge({}, {fatal: false}, rule), info, {code: code}));
            stats[rule.level] += 1;
            processedCodes.push(code);
        }
    });

    delete theme.results.fail;

    _.each(theme.results.pass, function (code, index) {
        const rule = ruleSet.rules[code];
        theme.results.pass[index] = _.extend({}, rule, {code: code});
        stats[rule.level] += 1;
        processedCodes.push(code);
    });

    _.each(_.difference(_.keys(ruleSet.rules), processedCodes), function (code) {
        theme.results.missing.push(ruleSet.rules[code]);
    });

    theme.results.score = calcScore(theme.results, stats);
    theme.results.hasFatalErrors = hasFatalErrors;

    // CASE 1: sort by files (@TODO: sort by passed rules is not possible, because we don't push the file reference)
    // CASE 2: (default): sort by rules
    if (options.sortByFiles) {
        const recommendationsByFile = {};
        const errorsByFile = {};
        const warningsByFile = {};

        theme.results.error.forEach((error) => {
            const failures = error.failures;

            if (!failures || !failures.length) {
                return;
            }

            failures.forEach((failure) => {
                if (!errorsByFile.hasOwnProperty(failure.ref)) {
                    errorsByFile[failure.ref] = [];
                }

                errorsByFile[failure.ref].push(error);
            });
        });

        theme.results.warning.forEach((warning) => {
            const failures = warning.failures;

            if (!failures || !failures.length) {
                return;
            }

            failures.forEach((failure) => {
                if (!warningsByFile.hasOwnProperty(failure.ref)) {
                    warningsByFile[failure.ref] = [];
                }

                warningsByFile[failure.ref].push(warning);
            });
        });

        theme.results.recommendation.forEach((passed) => {
            const failures = passed.failures;

            if (!failures || !failures.length) {
                return;
            }

            failures.forEach((failure) => {
                if (!recommendationsByFile.hasOwnProperty(failure.ref)) {
                    recommendationsByFile[failure.ref] = [];
                }

                recommendationsByFile[failure.ref].push(passed);
            });
        });

        theme.results.recommendation = {
            all: theme.results.recommendation,
            byFiles: recommendationsByFile
        };

        theme.results.error = {
            all: theme.results.error,
            byFiles: errorsByFile
        };

        theme.results.warning = {
            all: theme.results.warning,
            byFiles: warningsByFile
        };
    } else {
        theme.results.error = _.orderBy(theme.results.error, 'fatal', 'desc');
    }

    return theme;
};

module.exports = format;
