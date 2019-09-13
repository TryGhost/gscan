const _ = require('lodash');
const previousSpec = require('./v2');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://ghost.org/docs/api/handlebars-themes/`;
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v2.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = [];
let templates = [];
let rules = {
    // New rules
};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules, but overwrite any specified property,
// as well as adding any new rule to the spec.
// Furthermore, replace the usage of the old doc URLs that we're linking to, with the
// new version.
rules = _.each(_.merge({}, previousRules, rules), function replaceDocsUrl(value) {
    value.details = value.details.replace(prevDocsBaseUrlRegEx, docsBaseUrl);
});

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules
};
