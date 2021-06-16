const Scope = require('./internal/scope');

module.exports = class BaseRule {
    constructor(options) {
        this.ruleName = options.name;
        this._log = options.log;
        this.source = options.source;
        this.partials = options.partials;
        this.helpers = options.helpers;
    }

    getVisitor({fileName} = {}) {
        const visitor = {};
        const ruleVisitor = this.visitor();

        // keep track of the locals that are available in the current context.
        // enables checks in rules to see if a MustacheStatement is referring
        // to a known local
        const scope = (this.scope = new Scope());

        // these are the node types that we care about
        const nodeTypes = [
            'Program',
            'MustacheStatement',
            'BlockStatement',
            'PartialStatement',
            'PartialBlockStatement',
            'SubExpression'
        ];

        // this object keeps an array of functions for each node type, eventually
        // it will be reduced to a single "visitor" where each nodetype is a
        // function in order to match the Handlebars.Visitor prototype usage
        const astVisitors = nodeTypes.reduce((obj, nodeType) => {
            obj[nodeType] = [];
            return obj;
        }, {});

        // Manage scope

        // every time we hit a statement, use the parents array determine if
        // any frames need to be removed from the context. This is necessary
        // because Handlebars.Visitor does not have an `exit` event
        nodeTypes.forEach((nodeType) => {
            astVisitors[nodeType].push(function (node, hbVisitorInstance) {
                // loop backwards through frames so that we're not popping
                // frames that we're about to walk over
                for (let i = scope.frames.length - 1; i >= 0; i--) {
                    let frame = scope.frames[i];
                    if ((frame.node !== node) && !hbVisitorInstance.parents.includes(frame.node)) {
                        scope.popFrame();
                    }
                }
            });
        });

        // for the very first, top-level Program node, push a template-level
        // frame onto the stack so that we can determine the template context
        astVisitors.Program.push(function (node) {
            if (node.loc && node.loc.start.line === 1 && node.loc.column === 0) {
                scope.pushTemplateFrame(node, {fileName});
            }
        });

        // add the rule-specific visitors onto our visitors object. Do this
        // before the BlockStatement context-building visitor so that
        // BlockStatement rules are evaluated in the current context rather than
        // their own context
        for (const key in ruleVisitor) {
            astVisitors[key].push(ruleVisitor[key]);
        }

        // push a frame onto the scope stack each time we enter into a block
        // statement's body. Must happen after popping unknown frames so that we
        // don't unintentionally pop the frame we've just pushed
        astVisitors.BlockStatement.push(function (node) {
            // these BlockStatements do not create a new context
            const skipList = ['has', 'is', 'if', 'else', 'unless'];
            const nodeName = node.path.parts[0];

            if (!skipList.includes(nodeName)) {
                scope.pushFrame(node);
            }
        });

        // finally, build up the visitor object which will be attached to the
        // Handlebars.Visitor prototype. Calls all handler functions that are in
        // our astVisitors object for each node type
        nodeTypes.forEach((nodeType) => {
            visitor[nodeType] = (node, hbVisitorInstance) => {
                // this.parents = hbVisitorInstance.parents;
                astVisitors[nodeType].forEach(fn => fn(node, hbVisitorInstance));
            };
        });

        return visitor;
    }

    // rules will extend this function
    visitor() {}

    log(result) {
        const defaults = {
            rule: this.ruleName
        };

        const reportedResult = Object.assign({}, defaults, result);

        this._log(reportedResult);
    }

    isValidPartialReference(node) {
        return this.partials.includes(node.name.original);
    }

    isValidHelperReference(nodeName) {
        return this.helpers && this.helpers.includes(nodeName);
    }

    // mostly copy/pasta from tildeio/htmlbars with a few tweaks:
    // https://github.com/tildeio/htmlbars/blob/v0.14.17/packages/htmlbars-syntax/lib/parser.js#L59-L90
    sourceForNode(node) {
        if (!node.loc) {
            return;
        }

        let source = this.source.split('\n');
        let firstLine = node.loc.start.line - 1;
        let lastLine = node.loc.end.line - 1;
        let currentLine = firstLine - 1;
        let firstColumn = node.loc.start.column;
        let lastColumn = node.loc.end.column;
        let string = [];
        let line;

        while (currentLine < lastLine) {
            currentLine += 1;
            line = source[currentLine];

            if (currentLine === firstLine) {
                if (firstLine === lastLine) {
                    string.push(line.slice(firstColumn, lastColumn));
                } else {
                    string.push(line.slice(firstColumn));
                }
            } else if (currentLine === lastLine) {
                string.push(line.slice(0, lastColumn));
            } else {
                string.push(line);
            }
        }

        return string.join('');
    }
};
