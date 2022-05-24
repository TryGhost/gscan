const assert = require('assert');
const calculateScore = require('../../lib/utils/score-calculator');

describe('Score calculator', function () {
    it('Returns a 100 score when there are no errors in the theme', function () {
        const results = {
            error: [],
            warning: [],
            recommendation: []
        };
        const stats = {
            error: 1,
            warning: 1,
            recommendation: 1
        };

        const {value, level} = calculateScore(results, stats);

        assert.equal(value, 100);
        assert.equal(level, 'passing');
    });

    it('Returns a 99 score when there is at least one error in the theme', function () {
        const results = {
            error: [1],
            warning: [],
            recommendation: []
        };
        const stats = {
            error: 1000,
            warning: 1000,
            recommendation: 1000
        };

        const {value, level} = calculateScore(results, stats);

        assert.equal(value, 99);
        assert.equal(level, 'error');
    });
});
