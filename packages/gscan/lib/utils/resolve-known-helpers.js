const _ = require('lodash');
const labsEnabledHelpers = require('./labs-enabled-helpers');

/**
 * Return known helpers for a check run, including any labs-flagged helpers
 * that are enabled for this invocation.
 *
 * Does not mutate the shared spec's `knownHelpers` array.
 *
 * @param {string[]} knownHelpers - base helpers from the version spec
 * @param {Object} [labs] - labs flags passed into gscan (truthy values enable)
 * @returns {string[]}
 */
module.exports = function resolveKnownHelpers(knownHelpers, labs = {}) {
    const extras = [];

    _.each(labsEnabledHelpers, (flag, helper) => {
        if (labs && labs[flag]) {
            extras.push(helper);
        }
    });

    if (!extras.length) {
        return knownHelpers;
    }

    return _.union(knownHelpers, extras);
};
