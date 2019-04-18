const Rule = require('./base');
const {logNode} = require('../helpers');

// TODO: this rule is not complete, it's more of an example working towards
// https://github.com/TryGhost/gscan/issues/94

// const template = `
// {{#prev_post}}
//     {{^next_post}} {{!-- invalid, direct nesting --}}
//         No next post
//     {{/next_post}}

//     {{#foreach authors}}
//         {{name}}
//         {{#next_post}}{{title}}{{/next_post}} {{!-- invalid, inside author context --}}
//     {{/foreach}}

//     {{#get "post" as |post|}}
//         {{#post}}
//             {{#next_post}} {{!-- valid? only if nested async helpers are allowed --}}
//                 {{title}}
//             {{/next_post}}
//         {{/post}}
//     {{/get}}
// {{/prev_post}}`;

const disallowedMap = {
    prev_post: ['next_post'],
    next_post: ['prev_post']
};

module.exports = class NoInvalidNesting extends Rule {
    _checkForInvalidNesting(node) {
        const nodeName = node.path.parts[0];
        const disallowedPaths = disallowedMap[nodeName];

        if (disallowedPaths) {
            const {currentFrame} = this.scope;

            if (currentFrame && disallowedPaths.includes(currentFrame.nodeName)) {
                this.log({
                    message: `${logNode(node)} cannot be used inside ${logNode(currentFrame.node)}`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(currentFrame.node)
                });
            }
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForInvalidNesting.bind(this)
        };
    }
};