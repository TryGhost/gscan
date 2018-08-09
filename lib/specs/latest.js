const _ = require('lodash');
const previousSpec = require('./v1');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://themes.ghost.org/docs/`;
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v1.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

let knownHelpers = [];
let templates = [];
let rules = {};

rules = {
    // TODO: link to 2.0 docs for these
    // TODO: WORDING!!!!
    'GS001-DEPR-CSS-KGMD': {
        level: 'warning',
        rule: `<code>.kg-card-markdown</code> doesn't exist in Ghost 2.0, ensure your theme works without it`,
        details: `The <code>.kg-card-markdown</code> CSS class is deprecated and will no longer be used in Ghost 2.0. 
        It's recommended to add your own wrapper around the <code>{{content}}</code> helper and target that instead if needed.`,
        regex: /\.kg-card-markdown/g,
        className: '.kg-card-markdown',
        css: true
    },
    // TODO: link to 2.0 docs for these
    // TODO: WORDING!!!!
    'GS050-CSS-KGWW': {
        level: 'error',
        fatal: true,
        rule: 'The <code>.kg-width-wide</code> CSS class is required to use your theme with 2.0',
        details: `The <code>.kg-width-wide</code> CSS class is required to use your theme with 2.0.`,
        regex: /\.kg-width-wide/g,
        className: '.kg-width-wide',
        css: true
    },
    // TODO: link to 2.0 docs for these
    // TODO: WORDING!!!!
    'GS050-CSS-KGWF': {
        level: 'error',
        fatal: true,
        rule: 'The <code>.kg-width-full</code> CSS class is required to use your theme with 2.0',
        details: `The <code>.kg-width-full</code>  CSS class is required to use your theme with 2.0.`,
        regex: /\.kg-width-full/g,
        className: '.kg-width-full',
        css: true

    }
};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules, but overwrite any specified property,
// as well as adding any new rule to the spec.
// Furthermore, replace the usage of the old doc URLs that we're linking to, with the
// new version.
rules = _.each(_.merge(previousRules, rules), function replaceDocsUrl(value) {
    value.details = value.details.replace(prevDocsBaseUrlRegEx, docsBaseUrl);
});

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules
};
