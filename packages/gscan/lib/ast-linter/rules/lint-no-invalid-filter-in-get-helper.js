const Rule = require('./base');
const {getNodeName} = require('../helpers');
const {validateGetFilter} = require('../../utils/validate-get-filter');

module.exports = class NoInvalidFilterInGetHelper extends Rule {
    _checkFilter(node) {
        if (getNodeName(node) !== 'get') {
            return;
        }

        const resource = node.params[0] && node.params[0].value;

        if (typeof resource !== 'string') {
            return;
        }

        const filterPair = node.hash && node.hash.pairs && node.hash.pairs.find(pair => pair.key === 'filter');

        // A filter built from a subexpression or a path (e.g. `filter=(concat ...)`
        // or `filter=custom.my_filter`) is only known at render time.
        if (!filterPair || filterPair.value.type !== 'StringLiteral') {
            return;
        }

        const issues = validateGetFilter(resource, filterPair.value.value);

        issues.forEach((issue) => {
            this.log({
                message: `{{#get "${resource}"}} ${issue.message}.`,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        });
    }

    visitor() {
        return {
            BlockStatement: this._checkFilter.bind(this)
        };
    }
};
