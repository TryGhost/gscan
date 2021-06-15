const Rule = require('./base');
const {getNodeName, classifyNode} = require('../helpers');

module.exports = class MarkUsedHelpers extends Rule {
    _markUsedHelpers(node) {
        const nodeName = getNodeName(node);
        const helperType = classifyNode(node);

        // helper nodes will break the rendering if there is no matching helper
        // ambiguous nodes simply won't appear if there is no matching helper and no matching context
        if (helperType === 'helper' || helperType === 'ambiguous') {
            this.scanner.context.helpers.push({
                node: nodeName,
                type: node.type,
                helperType,
                loc: node.loc,
                parameters: node.params ? node.params.map(p => p.original) : null
            });
        }
    }

    visitor() {
        return {
            BlockStatement: this._markUsedHelpers.bind(this),
            MustacheStatement: this._markUsedHelpers.bind(this),
            SubExpression: this._markUsedHelpers.bind(this)
        };
    }
};
