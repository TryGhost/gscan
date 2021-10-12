const _ = require('lodash');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const previousSpec = require('./v3');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://ghost.org/docs/api/handlebars-themes/`;
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v3.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = ['match'];
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
    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"config.custom"</code> contains too many settings',
        details: oneLineTrim`Please remove key from <code>"config.custom"</code> in your <code>package.json</code> to have less than or exactly 15 settings.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-CASE': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"config.custom"</code> contains a property that isn\'t snake-cased',
        details: oneLineTrim`Please rewrite all property in <code>"config.custom"</code> in your <code>package.json</code> in snake case.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-TYPE': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> should have a known <code>"type"</code>.',
        details: oneLineTrim`Please only use the following types: <code>"select"</code>, <code>"boolean"</code>, <code>"color"</code>, <code>"image"</code>, <code>"text"</code>.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-GROUP': {
        level: 'recommendation',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> should have a known <code>"group"</code>.',
        details: oneLineTrim`Please only use the following groups: <code>"post"</code>, <code>"homepage"</code>.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"select"</code> need to have at least 2 <code>"options"</code>.',
        details: oneLineTrim`Please make sure there is at least 2 <code>"options"</code> in each <code>"select"</code> custom theme property.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"select"</code> need to have a valid <code>"default"</code>.',
        details: oneLineTrim`Please make sure the <code>"default"</code> property matches a value in <code>"options"</code> of the same <code>"select"</code>.<br>
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
        Check out the documentation for <code>{{#foreach}}</code> <a href="${docsBaseUrl}helpers/foreach/" target=_blank>here</a>.`,
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
        fatal: true, // overwritten from v3 to be fatal
        details: oneLineTrim`Theme translations (located in <code>locales/*.json</code>) need to be readable by the node JSON parser, or they will not be applied.`
    },
    'GS090-NO-IMG-URL-IN-CONDITIONALS': {
        level: 'warning',
        rule: 'The {{img_url}} helper should not be used as a parameter to {{#if}} or {{#unless}}',
        fatal: false,
        details: oneLineTrim`The {{img_url}} helper should not be used as a parameter to {{#if}} or {{#unless}}`
    },
    'GS090-NO-UNKNOWN-CUSTOM-THEME-SETTINGS': {
        level: 'error',
        rule: 'An unkown custom theme setting has been used.',
        fatal: false,
        details: oneLineTrim`The custom theme setting should all be defined in the package.json <code>config.custom</code> object.`
    },
    'GS090-NO-UNKNOWN-CUSTOM-THEME-SELECT-VALUE-IN-MATCH': {
        level: 'error',
        rule: 'A custom theme setting of type <code>select</code> has been compared to a value that isn\'t defined.',
        fatal: false,
        details: oneLineTrim`Custom theme settings of type <code>select</code> can only be compared to their defined <code>options</code> when used in a <code>match</code> block.`
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
