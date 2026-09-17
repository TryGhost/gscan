const _ = require('lodash');
const oneLineTrim = require('../utils/one-line-trim');
const previousSpec = require('./v5');
const docsBaseUrl = `https://docs.ghost.org/themes/`;

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = ['split', 'json', 'color_to_rgba', 'contrast_text_color', 'raw', 'search', 'social_accounts'];
let templates = [];
let rules = {
    'GS090-NO-INVALID-CONDITIONAL-ARGUMENTS': {
        level: 'error',
        fatal: true,
        rule: 'Use exactly one argument in <code>{{#if}}</code> and <code>{{#unless}}</code> helpers',
        details: oneLineTrim`The <code>{{#if}}</code> and <code>{{#unless}}</code> helpers only support one argument. To compare values, use a supported helper such as <code>{{#match}}</code>, for example <code>{{#match statusCode 404}}</code>.`
    },
    'GS090-NO-LIMIT-ALL-IN-GET-HELPER': {
        level: 'warning',
        rule: 'Using <code>limit="all"</code> in <code>{{#get}}</code> helper is not supported',
        details: oneLineTrim`In Ghost 6.0 and later, <code>limit="all"</code> will return at most 100 results. Consider using a specific limit number or implementing pagination instead.<br>
        Find more information about the <code>{{#get}}</code> helper <a href="${docsBaseUrl}helpers/functional/get/" target=_blank>here</a>.`,
        helper: '{{#get}}'
    },
    'GS090-NO-LIMIT-OVER-100-IN-GET-HELPER': {
        level: 'warning',
        rule: 'Using <code>limit</code> values greater than 100 in <code>{{#get}}</code> helper is not supported',
        details: oneLineTrim`Ghost automatically caps <code>limit</code> values at 100, so using higher values will not return more results.
        Consider using pagination or setting the limit to 100 or lower.<br>
        Find more information about the <code>{{#get}}</code> helper <a href="${docsBaseUrl}helpers/functional/get/" target=_blank>here</a>.`,
        helper: '{{#get}}'
    },
    'GS090-NO-INVALID-FILTER-IN-GET-HELPER': {
        level: 'warning',
        rule: 'Use a valid <code>filter</code> in the <code>{{#get}}</code> helper',
        details: oneLineTrim`The <code>filter</code> passed to <code>{{#get}}</code> is applied by the Content API.
        A filter that isn't valid NQL makes the helper render its <code>{{else}}</code> block instead of any content, and a filter on a
        field the Content API doesn't allow &mdash; such as <code>html</code> or <code>plaintext</code> &mdash; is dropped from the query
        without an error, so the helper quietly returns more results than you asked for and Ghost does more work to produce them.<br>
        Find more information about the <code>{{#get}}</code> helper <a href="${docsBaseUrl}helpers/functional/get/" target=_blank>here</a>.`,
        helper: '{{#get}}'
    },
    'GS090-NO-GET-HELPER-IN-LOOP': {
        level: 'warning',
        rule: 'Avoid using the <code>{{#get}}</code> helper inside a loop or another <code>{{#get}}</code>',
        details: oneLineTrim`Every <code>{{#get}}</code> is a Content API query. Placing one inside <code>{{#foreach}}</code> runs that query
        once per item, and nesting one inside another <code>{{#get}}</code> means the inner query can only start once the outer one has
        finished. Both patterns make a page slower in proportion to how much content it renders.<br>
        Fetch what you need in a single <code>{{#get}}</code> &mdash; for example with a combined <code>filter</code> &mdash; instead.<br>
        Find more information about the <code>{{#get}}</code> helper <a href="${docsBaseUrl}helpers/functional/get/" target=_blank>here</a>.`,
        helper: '{{#get}}'
    },
    'GS001-DEPR-TWITTER-URL': {
        level: 'warning',
        rule: 'Replace <code>{{twitter_url}}</code> with <code>{{social_url type="twitter"}}</code>',
        details: oneLineTrim`The <code>{{twitter_url}}</code> helper is no longer supported and should be replaced with <code>{{social_url type="twitter"}}</code>.<br>
        Find more information about the <code>{{social_url}}</code> helper <a href="${docsBaseUrl}helpers/data/social_url/" target=_blank>here</a>.`,
        regex: /{{\s*?twitter_url(\s+[^}]*)?\s*?}}/g,
        helper: '{{twitter_url}}'
    },
    'GS001-DEPR-FACEBOOK-URL': {
        level: 'warning',
        rule: 'Replace <code>{{facebook_url}}</code> with <code>{{social_url type="facebook"}}</code>',
        details: oneLineTrim`The <code>{{facebook_url}}</code> helper is no longer supported and should be replaced with <code>{{social_url type="facebook"}}</code>.<br>
        Find more information about the <code>{{social_url}}</code> helper <a href="${docsBaseUrl}helpers/data/social_url/" target=_blank>here</a>.`,
        regex: /{{\s*?facebook_url(\s+[^}]*)?\s*?}}/g,
        helper: '{{facebook_url}}'
    },
    'GS001-DEPR-AMP-TEMPLATE': {
        level: 'warning',
        rule: 'AMP templates are no longer supported in Ghost 6.0',
        details: 'AMP support was removed in Ghost 6.0. Remove AMP templates and use responsive design instead.',
        // Matches <html amp> or <html ⚡>, with or without other attributes mixed in
        regex: /<html\s+(?:amp|⚡)(?:\s|>)|<html\s+[^>]*\s(?:amp|⚡)(?:\s|>)/i
    },
    'GS130-NO-RECURSIVE-LAYOUT': {
        level: 'error',
        fatal: true,
        rule: 'Templates must not recursively inherit layouts',
        details: oneLineTrim`Remove recursive layout inheritance such as <code>{{!&lt; default}}</code> from <code>default.hbs</code>. A template cannot inherit from itself, directly or through another layout, because it can cause rendering to recurse indefinitely.`
    }
};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules
rules = _.merge({}, previousRules, rules);

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules,
    pageBuilderProperties: previousSpec.pageBuilderProperties,
    defaultPackageJSON: previousSpec.defaultPackageJSON
};
