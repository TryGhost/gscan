const Handlebars = require('handlebars');
const defaultRules = require('./rules');

class Linter {
    constructor(_options) {
        const options = _options || {};

        this.options = options;
        this.constructor = Linter;
    }

    buildScanner(config) {
        const nodeHandlers = [];

        for (const ruleName in config.rules) {
            let Rule = config.rules[ruleName];
            let rule = new Rule({
                name: ruleName,
                log: config.log,
                source: config.source
            });

            nodeHandlers.push({
                rule,
                visitor: rule.getVisitor()
            });
        }

        function Scanner() {}
        Scanner.prototype = new Handlebars.Visitor();

        const nodeTypes = [
            'Program',
            'MustacheStatement',
            'BlockStatement',
            'PartialStatement',
            'PartialBlockStatement'
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
                        handler.visitor[nodeType].call(handler.rule, node);
                    }
                });

                Handlebars.Visitor.prototype[nodeType].call(this, node);
            };
        });

        return new Scanner();
    }

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
            ast = Handlebars.parse(options.source);
        } catch (err) {
            addToMessages({
                message: err.message,
                fatal: true,
                column: err.column,
                line: err.lineNumber
            });
        }

        scanner.accept(ast);

        return messages;
    }
}

module.exports = Linter;