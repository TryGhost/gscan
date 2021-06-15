const Rule = require('./base');
const {getNodeName, classifyNode} = require('../helpers');

module.exports = class NoUnknownHelpers extends Rule {
    _checkForUnknownHelpers(node) {
        const helperType = classifyNode(node);

        // Restrict to `helper` nodes to avoid handling `ambiguous` nodes
        if (node.name && helperType === 'helper') {
            if (!this.isValidHelperReference(node)) {
                this.log({
                    message: `The helper ${getNodeName(node)} could not be found`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                });
            }
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForUnknownHelpers.bind(this),
            MustacheStatement: this._checkForUnknownHelpers.bind(this),
            SubExpression: this._checkForUnknownHelpers.bind(this)
        };
    }
};
