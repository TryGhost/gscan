const _ = require('lodash');
const previousSpec = require('./v5');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = _.cloneDeep(previousSpec.rules);

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = [];
let templates = [];
let rules = {
    // New rules

};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);
rules = _.merge({}, previousRules, rules);

// @TODO figure out why removing this breaks v6
delete previousRules['GS010-PJ-GHOST-API-V01'];

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules,
    /**
     * Copy of Ghost defaults for https://github.com/TryGhost/Ghost/blob/e25f1df0ae551c447da0d319bae06eadf9665444/core/frontend/services/theme-engine/config/defaults.json
     */
    defaultPackageJSON: {
        posts_per_page: 5,
        card_assets: true
    }
};
