function getNodeName(node) {
    switch (node.type) {
    case 'SubExpression':
    case 'MustacheStatement':
    case 'BlockStatement':
        return `${node.path.data ? '@' : ''}${node.path.parts.join('.')}`;

    case 'Program':
        return;

    case 'PathExpression':
    default:
        if (node.parts) {
            return node.parts[0];
        }
        if (node.name.parts) {
            return node.name.parts[0];
        }

        if (node.name.original) {
            return node.name.original;
        }
    }
}

function _blockPrefixChar(node) {
    return node.inverse && !node.program ? '^' : '#';
}

function logNode(node) {
    const prefix = (node.inverse || node.program) ? _blockPrefixChar(node) : '';

    return `{{${prefix}${getNodeName(node)}}}`;
}

module.exports = {
    getNodeName,
    logNode
};
