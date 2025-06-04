const _ = require('lodash');
const previousSpec = require('./v5');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
// Currently no new rules for v6
let knownHelpers = [];
let templates = [];
let rules = {};

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
