function getNodeName(node) {
    switch (node.type) {
    case 'SubExpression':
    case 'MustacheStatement':
    case 'BlockStatement':
        return node.path.parts[0];

    case 'PathExpression':
    default:
        return node.parts[0];
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