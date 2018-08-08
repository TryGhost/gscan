const _ = require('lodash');
const previousSpec = require('./v1');
const ghostVersions = require('../utils').versions;
const latestDocsBaseUrl = `https://themes.ghost.org/docs/`;
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v1.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

let knownHelpers = [];
let templates = [];
let rules = {};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);

templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules, but overwrite any specified property,
// as well as adding any new rule to the spec.
// Furthermore, replace the usage of the old doc URLs that we're linking to, with the
// new version.
rules = _.each(_.merge(previousRules, rules), function replaceDocsUrl(value) {
    value.details = value.details.replace(prevDocsBaseUrlRegEx, latestDocsBaseUrl);
});

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules
};
