const Rule = require('./base');
const {getNodeName} = require('../helpers');

module.exports = class MarkUsedPartials extends Rule {
    _markUsedPartials(node) {
        const nodeName = getNodeName(node);

        this.scanner.context.partials.push({
            node: nodeName,
            type: node.type,
            loc: node.loc,
            parameters: node.params ? node.params.map(p => p.original) : null
        });
    }

    visitor() {
        return {
            PartialStatement: this._markUsedPartials.bind(this),
            PartialBlockStatement: this._markUsedPartials.bind(this)
        };
    }
};
