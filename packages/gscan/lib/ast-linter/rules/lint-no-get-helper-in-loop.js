const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');

// Blocks that render their body once per item. A `{{#get}}` inside one of these
// is a Content API request per iteration.
const iteratingHelpers = ['foreach', 'each'];

// Helpers that already hold an open API request while their body renders.
const asyncHelpers = ['get', 'prev_post', 'next_post'];

module.exports = class NoGetHelperInLoop extends Rule {
    _checkForGetInLoop(node) {
        if (getNodeName(node) !== 'get') {
            return;
        }

        for (let i = this.scope.frames.length - 1; i >= 0; i--) {
            const frame = this.scope.frames[i];

            if (!frame) {
                continue;
            }

            if (iteratingHelpers.includes(frame.nodeName)) {
                this.log({
                    message: `{{#get}} is inside ${logNode(frame.node)}, so it runs one Content API query per iteration`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                });
                return;
            }

            if (asyncHelpers.includes(frame.nodeName)) {
                this.log({
                    message: `{{#get}} is inside ${logNode(frame.node)}, so its query cannot start until the outer query has finished`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                });
                return;
            }
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForGetInLoop.bind(this)
        };
    }
};
