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

function cssCardRule(cardName, className) {
    return {
        level: 'warning',
        rule: `The <code>.${className}</code> CSS class is required to appear styled in your theme`,
        details: oneLineTrim`The <code>.${className}</code> CSS class is required otherwise the ${cardName} card will appear unstyled.
        Find out more about required theme changes for the Koenig editor <a href="${docsBaseUrl}editor/" target=_blank>here</a>.`,
        regex: new RegExp(`\\.${className}`, 'g'),
        className: `.${className}`,
        css: true,
        cardAsset: cardName
    };
}

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = ['match'];
let templates = [];
let rules = {
    // New rules
    'GS010-PJ-GHOST-API': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is recommended. Otherwise, it falls back to "v4"',
        details: oneLineTrim`Add <code>"ghost-api"</code> to your <code>package.json</code>. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If no <code>"ghost-api"</code> property is provided, Ghost will use its default setting of "v4" Ghost API.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-GHOST-API-V01': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is incompatible with current version of Ghost API and will fall back to "v4"',
        details: oneLineTrim`Change <code>"ghost-api"</code> in your <code>package.json</code> to higher version. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If <code>"ghost-api"</code> property is left at "v0.1", Ghost will use its default setting of "v4".<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-GHOST-API-V2': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is using a deprecated version of Ghost API',
        details: oneLineTrim`Change <code>"ghost-api"</code> in your <code>package.json</code> to higher version. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If <code>"ghost-api"</code> property is left at "v2", it will stop working with next major version upgrade and default to v5.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"config.custom"</code> contains too many settings',
        details: oneLineTrim`Remove key from <code>"config.custom"</code> in your <code>package.json</code> to have less than or exactly 15 settings.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-CASE': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"config.custom"</code> contains a property that isn\'t snake-cased',
        details: oneLineTrim`Rewrite all property in <code>"config.custom"</code> in your <code>package.json</code> in snake case.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-TYPE': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> should have a known <code>"type"</code>.',
        details: oneLineTrim`Only use the following types: <code>"select"</code>, <code>"boolean"</code>, <code>"color"</code>, <code>"image"</code>, <code>"text"</code>.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-GROUP': {
        level: 'recommendation',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> should have a known <code>"group"</code>.',
        details: oneLineTrim`Only use the following groups: <code>"post"</code>, <code>"homepage"</code>.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"select"</code> need to have at least 2 <code>"options"</code>.',
        details: oneLineTrim`Make sure there is at least 2 <code>"options"</code> in each <code>"select"</code> custom theme property.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"select"</code> need to have a valid <code>"default"</code>.',
        details: oneLineTrim`Make sure the <code>"default"</code> property matches a value in <code>"options"</code> of the same <code>"select"</code>.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"boolean"</code> need to have a valid <code>"default"</code>.',
        details: oneLineTrim`Make sure the <code>"default"</code> property is either <code>true</code> or <code>false</code>.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"color"</code> need to have a valid <code>"default"</code>.',
        details: oneLineTrim`Make sure the <code>"default"</code> property is a valid 6-hexadecimal-digit color code like <code>#15171a</code>.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"image"</code> can\'t have a <code>"default"</code> value.',
        details: oneLineTrim`Make sure the <code>"default"</code> property is either <code>null</code>, an empty string <code>''</code> or isn't present.<br>
        Check the <a href="${docsBaseUrl}packagejson/" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS001-DEPR-LABS-MEMBERS': {
        level: 'warning',
        rule: 'The <code>{{@labs.members}}</code> helper should not be used.',
        details: oneLineTrim`Remove <code>{{@labs.members}}</code> from the theme.<br>
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
        details: oneLineTrim`Replace <code>{{@site.lang}}</code> helper with <code>{{@site.locale}}</code>.<br>
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
    },
    'GS100-NO-UNUSED-CUSTOM-THEME-SETTING': {
        level: 'error',
        rule: 'A custom theme setting defined in <code>package.json</code> hasn\'t been used in any theme file.',
        details: oneLineTrim`Custom theme settings defined in <code>package.json</code> must be used at least once in the theme templates.`
    },
    'GS050-CSS-KGCO': cssCardRule('callout', 'kg-card-callout'),
    'GS050-CSS-KGCOE': cssCardRule('callout', 'kg-card-callout-emoji'),
    'GS050-CSS-KGCOT': cssCardRule('callout', 'kg-card-callout-text'),
    'GS050-CSS-KGCOBGGY': cssCardRule('callout', 'kg-card-callout-background-grey'),
    'GS050-CSS-KGCOBGW': cssCardRule('callout', 'kg-card-callout-background-white'),
    'GS050-CSS-KGCOBGB': cssCardRule('callout', 'kg-card-callout-background-blue'),
    'GS050-CSS-KGCOBGGN': cssCardRule('callout', 'kg-card-callout-background-green'),
    'GS050-CSS-KGCOBGY': cssCardRule('callout', 'kg-card-callout-background-yellow'),
    'GS050-CSS-KGCOBGR': cssCardRule('callout', 'kg-card-callout-background-red'),
    'GS050-CSS-KGCOBGPK': cssCardRule('callout', 'kg-card-callout-background-pink'),
    'GS050-CSS-KGCOBGPE': cssCardRule('callout', 'kg-card-callout-background-purple'),
    'GS050-CSS-KGCOBGA': cssCardRule('callout', 'kg-card-callout-background-accent'),

    'GS050-CSS-KG-NFT': cssCardRule('nft', 'kg-nft-card'),
    'GS050-CSS-KG-NFTCO': cssCardRule('nft', 'kg-nft-card-container'),
    'GS050-CSS-KG-NFTMD': cssCardRule('nft', 'kg-nft-metadata'),
    'GS050-CSS-KG-NFTIMG': cssCardRule('nft', 'kg-nft-image'),
    'GS050-CSS-KG-NFTHD': cssCardRule('nft', 'kg-nft-header'),
    'GS050-CSS-KG-NFTTIT': cssCardRule('nft', 'kg-nft-title'),
    'GS050-CSS-KG-NFTLG': cssCardRule('nft', 'kg-nft-logo'),
    'GS050-CSS-KG-NFTCTR': cssCardRule('nft', 'kg-nft-creator'),
    'GS050-CSS-KG-NFTDSC': cssCardRule('nft', 'kg-nft-description'),

    'GS050-CSS-KGBTN': cssCardRule('button', 'kg-button-card'),
    'GS050-CSS-KGBTNL': cssCardRule('button', 'kg-button-card.kg-align-left'),
    'GS050-CSS-KGBTNC': cssCardRule('button', 'kg-button-card.kg-align-center'),
    'GS050-CSS-KGBTNBTN': cssCardRule('button', 'kg-btn'),
    'GS050-CSS-KGBTNBTNA': cssCardRule('button', 'kg-btn-accent')
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
