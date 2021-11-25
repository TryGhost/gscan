const Rule = require('./base');
const {getPartialName} = require('../helpers');

module.exports = class NoUnknownPartials extends Rule {
    _checkForUnknownPartials(node) {
        if (node.name) {
            if (!this.isValidPartialReference(node)) {
                this.log({
                    message: `The partial ${getPartialName(node)} could not be found`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
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
