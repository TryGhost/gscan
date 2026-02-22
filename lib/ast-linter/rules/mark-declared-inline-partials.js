const Rule = require('./base');

module.exports = class MarkDeclaredInlinePartials extends Rule {
    _markDeclaredInlinePartials(node, visitor) {
        if (node?.path?.original === 'inline' && (node?.params?.length || 0) > 0) {
            const nodeName = node?.params?.[0]?.original;
            this.scanner.context.inlinePartials.push({
                node: nodeName,
                parents: visitor.parents.map(p => ({
                    type: p.type,
                    loc: p.loc
                })),
                type: node.type,
                loc: node.loc,
                parameters: node.params.map(p => p.original)
            });
        }
    }

    visitor() {
        return {
            DecoratorBlock: this._markDeclaredInlinePartials.bind(this)
        };
    }
};
