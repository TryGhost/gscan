var _          = require('lodash'),
    spec       = require('./spec'),
    format,
    calcScore,
    levelWeights = {
        error: 10,
        warning: 3,
        recommendation: 1
    };

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
format = function format(theme, options) {
    options = _.extend({onlyFatalErrors: false}, options);

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
        var rule = spec.rules[code];

        if (rule.fatal && options.onlyFatalErrors || options.onlyFatalErrors === false) {
            if (rule.fatal) {
                hasFatalErrors = true;
            }

            theme.results[rule.level].push(_.extend({}, _.merge({}, {fatal: false}, rule), info, {code: code}));
            stats[rule.level]++;
            processedCodes.push(code);
        }
    });

    delete theme.results.fail;

    _.each(theme.results.pass, function (code, index) {
        var rule = spec.rules[code];
        theme.results.pass[index] = _.extend({}, rule, {code: code});
        stats[rule.level]++;
        processedCodes.push(code);
    });

    _.each(_.difference(_.keys(spec.rules), processedCodes), function (code) {
        theme.results.missing.push(spec.rules[code]);
    });

    theme.results.score = calcScore(theme.results, stats);
    theme.results.hasFatalErrors = hasFatalErrors;

    // SORT errors!
    theme.results.error = _.orderBy(theme.results.error, 'fatal', 'desc');

    return theme;
};


module.exports = format;
