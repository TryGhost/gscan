const Rule = require('./base');
const {getPartialName} = require('../helpers');

module.exports = class NoUnknownPartials extends Rule {
    _checkForUnknownPartials(node, visitor) {
        if (node.name) {
            if (!this.isValidPartialReference(node, visitor.parents)) {
                const logObject = {
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                };

                // Dynamic partials (https://handlebarsjs.com/guide/partials.html#dynamic-partials)
                if (node.name.type === 'SubExpression') {
                    if (node.type === 'PartialBlockStatement') {
                        // A dynamic partial is valid when declared as a block
                        return;
                    }
                    if (node.type === 'PartialStatement') {
                        return this.log({
                            message: `Use the block form for dynamic partials so the page survives a missing partial: {{#> (dynamicPartial)}}fallback markup{{/undefined}} instead of {{> (dynamicPartial)}}.`,
                            ...logObject
                        });
                    }
                }

                this.log({
                    message: `The partial ${getPartialName(node)} could not be found`,
                    ...logObject
                });
            }
        }
    }

    visitor() {
        return {
            PartialStatement: this._checkForUnknownPartials.bind(this),
            PartialBlockStatement: this._checkForUnknownPartials.bind(this)
        };
    }
};
