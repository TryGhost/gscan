const _ = require('lodash');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const previousSpec = require('./v5');
const docsBaseUrl = `https://ghost.org/docs/themes/`;

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = [];
let templates = [];
let rules = {
    'GS090-NO-LIMIT-ALL-IN-GET-HELPER': {
        level: 'warning',
        rule: 'Using <code>limit="all"</code> in <code>{{#get}}</code> helper is not supported',
        details: oneLineTrim`In Ghost 6.0 and later, <code>limit="all"</code> will return at most 100 results. Consider using a specific limit number or implementing pagination instead.<br>
        Find more information about the <code>{{#get}}</code> helper <a href="${docsBaseUrl}helpers/get/" target=_blank>here</a>.`,
        helper: '{{#get}}'
    },
    'GS001-DEPR-AMP-TEMPLATE': {
        level: 'warning',
        rule: 'AMP templates are no longer supported in Ghost 6.0',
        details: 'AMP support was removed in Ghost 6.0. Remove AMP templates and use responsive design instead.',
        // Matches <html amp> or <html ⚡>, with or without other attributes mixed in
        regex: /<html\s+(?:amp|⚡)(?:\s|>)|<html\s+[^>]*\s(?:amp|⚡)(?:\s|>)/i 
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
    defaultPackageJSON: previousSpec.defaultPackageJSON
};
