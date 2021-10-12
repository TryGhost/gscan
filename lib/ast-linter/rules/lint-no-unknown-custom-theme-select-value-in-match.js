const Rule = require('./base');

function getCustomSettingName(node) {
    if (node.data && node.type === 'PathExpression' && node.parts[0] === 'custom') {
        return node.parts[1];
    }
    return null;
}

function getCustomSettingValue(node) {
    if (node.type === 'StringLiteral') {
        return node.value;
    }
    return null;
}

module.exports = class NoUnknownCustomThemeSelectValueInMatch extends Rule {
    _checkForCustomThemeSelectValueInMatch(node) {
        if (node.path.original === 'match' && node.params.length === 3) {
            const setting = getCustomSettingName(node.params[0]) || getCustomSettingName(node.params[2]);
            const value = getCustomSettingValue(node.params[0]) || getCustomSettingValue(node.params[2]);

            if (!setting || !value || !this.isSelectCustomTheme(setting)) {
                return;
            }

            if (!this.isValidCustomThemeSettingSelectValue(setting, value)) {
                this.log({
                    message: `Invalid custom theme select value: "${value}"`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                });
            }
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForCustomThemeSelectValueInMatch.bind(this)
        };
    }
};
