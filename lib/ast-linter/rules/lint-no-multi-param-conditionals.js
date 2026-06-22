// https://github.com/TryGhost/gscan/issues/85

const Rule = require('./base');
const message = 'The {{#if}} and {{#unless}} helpers require exactly one argument.';

// valid:
// {{#if foo}}
// {{#unless foo}}

// invalid:
// {{#if}}
// {{#if foo bar}}
// {{#unless}}
// {{#unless foo bar}}

module.exports = class NoMultiParamConditionals extends Rule {
    _checkForMultipleParams(node) {
        const isConditional = node.path.original === 'if' || node.path.original === 'unless';
        const hasInvalidParamCount = node.params.length !== 1;

        if (isConditional && hasInvalidParamCount) {
            this.log({
                message,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForMultipleParams.bind(this)
        };
    }
};
