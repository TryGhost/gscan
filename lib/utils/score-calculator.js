const levelWeights = {
    error: 10,
    warning: 3,
    recommendation: 1
};

/**
 *
 * @param {Object} results
 * @param {Object} results.error
 * @param {Object} results.warning
 * @param {Object} results.recommendation
 * @param {Object} stats
 * @param {Object} stats.error
 * @param {Object} stats.warning
 * @param {Object} stats.recommendation
* @returns {Object}
 */
const calcScore = function calcScore(results, stats) {
    var maxScore, actualScore, balancedScore;

    maxScore = Object.entries(levelWeights).reduce((max, [level, weight]) => {
        const levelTotal = Number(stats?.[level]) || 0;
        return max + (weight * levelTotal);
    }, 0);

    actualScore = Object.entries(levelWeights).reduce((max, [level, weight]) => {
        return max - (weight * (results[level] || []).length);
    }, maxScore);

    balancedScore = Math.floor((100 / maxScore) * actualScore);

    return {
        value: balancedScore,
        level: (results.error || []).length > 0 ? 'error' : balancedScore < 60 ? 'warning' : 'passing'
    };
};

module.exports = calcScore;
