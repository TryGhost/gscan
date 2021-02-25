const _ = require('lodash');
const {oneLineTrim} = require('common-tags');
const previousSpec = require('./v3');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://ghost.org/docs/api/handlebars-themes/`;
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v3.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = [];
let templates = [];
let rules = {
    // New rules
    'GS010-PJ-GHOST-API': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is recommended. Otherwise, it falls back to "v4"',
        details: oneLineTrim`Please add <code>"ghost-api"</code> to your <code>package.json</code>. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If no <code>"ghost-api"</code> property is provided, Ghost will use its default setting of "v4" Ghost API.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-GHOST-API-V01': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is incompatible with current version of Ghost API and will fall back to "v4"',
        details: oneLineTrim`Please change <code>"ghost-api"</code> in your <code>package.json</code> to higher version. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If <code>"ghost-api"</code> property is left at "v0.1", Ghost will use its default setting of "v4".<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-GHOST-API-V2': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is using a deprecated version of Ghost API',
        details: oneLineTrim`Please change <code>"ghost-api"</code> in your <code>package.json</code> to higher version. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If <code>"ghost-api"</code> property is left at "v2", it will stop working with next major version upgrade and default to v5.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS001-DEPR-LABS-MEMBERS': {
        level: 'warning',
        rule: 'The <code>{{@labs.members}}</code> helper should not be used and removed from the theme.',
        details: oneLineTrim`Please remove <code>{{@labs.members}}</code> from the theme.<br>
        The <code>{{@labs.members}}</code> helper will default to "true" value in Ghost v4 and will be removed from Ghost v5, thus resolving to "false" value.
        Find more information about the <code>@labs.members</code> property <a href="${docsBaseUrl}helpers/labs/" target=_blank>here</a>.`,
        regex: /@labs\.members/g,
        helper: '{{@labs.members}}'
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
