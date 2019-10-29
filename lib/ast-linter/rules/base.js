module.exports = class BaseRule {
    constructor(options) {
        this.ruleName = options.name;
        this._log = options.log;
        this.source = options.source;
    }

    getVisitor() {
        let visitor = {};
        let ruleVisitor = this.visitor();

        for (const key in ruleVisitor) {
            visitor[key] = ruleVisitor[key];
        }

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