const Handlebars = require('handlebars');
const defaultRules = require('./rules');

class Linter {
    /**
     *
     * @param {Object} [options]
     * @param {String[]} options.partials - list of known theme partial names in ['mypartial', 'logo'] format
     * @param {String[]} options.helpers - list of registered theme helper names in ['is', 'has'] format
     */
    constructor(options = {partials: [], helpers: []}) {
        this.options = options;

        this.partials = [];
        this.helpers = [];
        this.constructor = Linter;
    }

    buildScanner(config) {
        const nodeHandlers = [];

        for (const ruleName in config.rules) {
            let Rule = config.rules[ruleName];
            let rule = new Rule({
                name: ruleName,
                log: config.log,
                source: config.source,
                partials: this.options.partials,
                helpers: this.options.helpers
            });

            nodeHandlers.push({
                rule,
                visitor: rule.getVisitor()
            });
        }

        function Scanner() {
            this.context = {
                partials: [],
                helpers: []
            };
        }
        Scanner.prototype = new Handlebars.Visitor();

        const nodeTypes = [
            'Program',
            'MustacheStatement',
            'BlockStatement',
            'PartialStatement',
            'PartialBlockStatement',
            'SubExpression'
            // the following types are not used in Ghost or we don't validate
            // 'ContentStatement',
            // 'CommentStatement,
            // 'Decorator',
            // 'DecoratorBlock'
        ];

        nodeTypes.forEach((nodeType) => {
            Scanner.prototype[nodeType] = function (node) {
                nodeHandlers.forEach((handler) => {
                    if (handler.visitor[nodeType]) {
                        handler.visitor[nodeType].call(handler.rule, node, this);
                    }
                });

                Handlebars.Visitor.prototype[nodeType].call(this, node);
            };
        });

        const scanner = new Scanner();

        nodeHandlers.forEach((handler) => {
            handler.rule.scanner = scanner;
        });

        return scanner;
    }

    /**
   * The main function for the Linter class.  It takes the source code to lint
   * and returns the results.
   *
   * @param {Object} options
   * @param {string} options.source - The source code to verify.
   * @param {string} options.moduleId - Name of the source code to identify by.
   * @param {Object[]} options.rules - Array of Rule class instances to use for verification.
   * @returns {Object[]} messages - The lint results.
   */
    verify(options) {
        const messages = [];

        function addToMessages(_message) {
            let message = Object.assign({}, {moduleId: options.moduleId}, _message);
            messages.push(message);
        }

        const scannerConfig = {
            rules: options.rules || defaultRules,
            log: addToMessages,
            source: options.source
        };

        const scanner = this.buildScanner(scannerConfig);
        let ast;

        try {
            ast = Handlebars.parse(options.source, {srcName: options.moduleId});
        } catch (err) {
            addToMessages({
                message: err.message,
                fatal: true,
                column: err.column,
                line: err.lineNumber
            });
        }

        scanner.accept(ast);

        if (scanner.context.partials) {
            this.partials = scanner.context.partials.map(p => p.node);
        }

        if (scanner.context.helpers) {
            this.helpers = scanner.context.helpers;
        }

        return messages;
    }
}

module.exports = Linter;
