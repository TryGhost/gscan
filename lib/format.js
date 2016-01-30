var _          = require('lodash'),
    format,
    formatExample,
    calcScore,
    levelWeights = {
        error: 10,
        warning: 3,
        recommendation: 1
    };

format = function format(theme) {
    theme.errors = _.where(theme.results, {level: 'error'});
    theme.features = _.where(theme.results, {level: 'feature'});
    theme.info = _.reject(theme.results, function (result) {
        return _.includes(['error', 'feature'], result.level);
    });

    return theme;
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
        level: _.size(results.error) > 0 ? 'error' : balancedScore > 50 ? 'warning' : 'passing'
    };
};

/**
 * This is an example of how this might work
 * It needs cleaning up, a lot
 */
formatExample = function formatExample(theme) {
    var processedCodes = [],
        stats = {
            error: 0,
            warning: 0,
            recommendation: 0
        };

    if (theme.rules) {
        theme.results.error = [];
        theme.results.warning = [];
        theme.results.recommendation = [];
        theme.results.missing = [];

        _.each(theme.results.fail, function (info, code) {
            var rule = theme.rules[code];
            theme.results[rule.level].push(_.extend({}, rule, info));
            stats[rule.level]++;
            processedCodes.push(code);
        });

        delete theme.results.fail;

        _.each(theme.results.pass, function (code, index) {
            var rule = theme.rules[code];
            theme.results.pass[index] = rule;
            stats[rule.level]++;
            processedCodes.push(code);
        });

        _.each(_.difference(_.keys(theme.rules), processedCodes), function (code) {
            theme.results.missing.push(theme.rules[code]);
        });

        theme.results.score = calcScore(theme.results, stats);

    }

    return theme;
};


module.exports = format;
module.exports.example = formatExample;
