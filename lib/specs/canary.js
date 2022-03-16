const _ = require('lodash');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const previousSpec = require('./v4');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://ghost.org/docs/api/handlebars-themes/`;
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.canary.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = [];
let templates = [];
let rules = {
    // New rules
    'GS010-PJ-GHOST-API-PRESENT': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is not supported.',
        details: oneLineTrim`Remove <code>"ghost-api"</code> from your <code>package.json</code>.<br>
        The <code>ghost-api</code> is not supported starting Ghost v5 and should not be used.
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    }
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
