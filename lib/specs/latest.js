const _ = require('lodash');
const previousSpec = require('./v1');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

let knownHelpers;
let templates;
let rules;

knownHelpers = [];

knownHelpers = _.union(previousKnownHelpers, knownHelpers);

templates = [];

templates = _.union(previousTemplates, templates);

rules = {};

rules = _.merge(previousRules, rules);

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules
};
