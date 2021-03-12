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
        rule: 'The <code>{{@labs.members}}</code> helper should not be used.',
        details: oneLineTrim`Please remove <code>{{@labs.members}}</code> from the theme.<br>
        The <code>{{@labs.members}}</code> helper will always return <code>true</code> in Ghost v4 and will be removed from Ghost v5, at which point it will return <code>null</code> and evaluate to <code>false</code>.
        Find more information about the <code>@labs</code> property <a href="${docsBaseUrl}helpers/labs/" target=_blank>here</a>.`,
        regex: /@labs\.members/g,
        helper: '{{@labs.members}}'
    },
    'GS080-FEACH-POSTS': {
        level: 'warning',
        rule: 'The default visibility for posts in <code>{{#foreach}}</code> block helper has changed in v4.',
        details: oneLineTrim`The default visibility for posts in <code>{{#foreach}}</code> block helper has changed from <code>public</code> to <code>all</code> in Ghost v4.
        Find more information about the <code>{{foreach}}</code> helper <a href="${docsBaseUrl}helpers/foreach/" target=_blank>here</a>.`,
        regex: /{{\s*?#foreach\s*?\w*?\s*?}}/g,
        helper: '{{#foreach}}',
        validInAPI: ['v3']
    },
    'GS080-CARD-LAST4': {
        level: 'warning',
        rule: 'The <code>default_payment_card_last4</code> field now coalesces to <code>****</code> in Ghost 4.x instead of null.',
        details: oneLineTrim`The <code>default_payment_card_last4</code> field no longer outputs a falsy(null) value in case of missing card details starting from Ghost 4.x and instead coalesces to <code>****</code>
        Find more information about the <code>default_payment_card_last4</code> attribute <a href="${docsBaseUrl}members/#subscription-attributes" target=_blank>here</a>.`,
        regex: /default_payment_card_last4/g,
        helper: '{{default_payment_card_last4}}',
        validInAPI: ['v3']
    },
    'GS080-FEACH-PV': {
        level: 'recommendation',
        rule: 'The use of <code>visibility="all"</code> is no longer required for posts in <code>{{#foreach}}</code> helper.',
        details: oneLineTrim`The default visibility in <code>{{#foreach}}</code> helper for posts has changed in v4 from "public" to "all" and is no longer required when looping over posts.
        Check out the documentation for <code>{{#foreach}}</code> <a href="${docsBaseUrl}helpers/foreach/" target=_blank>here</a>.<br>.`,
        regex: /{{\s*?#foreach\b[\w\s='"]*?visibility=("|')all("|')[\w\s='"]*?}}/g,
        helper: '{{#foreach}}',
        validInAPI: ['v3']
    },
    'GS001-DEPR-CURR-SYM': {
        level: 'warning',
        rule: 'Replace <code>{{[#].currency_symbol}}</code> with <code>{{price currency=currency}}</code>.',
        details: oneLineTrim`The hardcoded <code>currency_symbol</code> attribute was removed in favour of passing the currency to updated <code>{{price}}</code> helper.
        Find more information about the updated <code>{{price}}</code> helper <a href="${docsBaseUrl}members/#the-price-helper" target=_blank>here</a>.`,
        helper: '{{[#].currency_symbol}}',
        regex: /currency_symbol/g
    },
    'GS001-DEPR-SITE-LANG': {
        level: 'warning',
        rule: 'The <code>{{@site.lang}}</code> helper should be replaced with <code>{{@site.locale}}</code>',
        details: oneLineTrim`Please replace <code>{{@site.lang}}</code> helper with <code>{{@site.locale}}</code>.<br>
        The <code>{{@site.lang}}</code> helper will be removed in next version of Ghost and should not be used.
        Find more information about the <code>@site</code> property <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /@site\.lang/g,
        helper: '{{@site.lang}}'
    },
    'GS070-VALID-TRANSLATIONS': {
        level: 'error',
        rule: 'Theme translations must be parsable',
        fatal: true, // overwritten from v3 to be fattal
        details: oneLineTrim`Theme translations (located in <code>locales/*.json</code>) need to be readable by the node JSON parser, or they will not be applied.`
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
