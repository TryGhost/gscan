const {getNodeName} = require('../../helpers');
const _ = require('lodash');

const globals = {
    site: {
        url: true,
        title: true,
        description: true,
        icon: true,
        logo: true,
        cover_image: true,
        twitter: true,
        facebook: true,
        navigation: true,
        timezone: true,
        lang: true
    },
    config: {
        posts_per_page: true
    },
    labs: {
        publicAPI: true,
        subscribers: true
    }
};

// TODO: use our knowledge of Ghost's helpers and JSON schemas to fully populate
// the locals array so we can detect incorrect usage
function getLocals(node) {
    switch (node.type) {
    case 'BlockStatement':
        return node.blockParams;

    default:
        throw new Error(`Unknown frame type: ${node.type}`);
    }
}

class Frame {
    constructor(node) {
        let locals = getLocals(node);

        this.node = node;
        this.nodeName = getNodeName(node);
        this.locals = locals;
    }

    isLocal(name) {
        return this.locals.indexOf(name) !== -1;
    }
}

class Scope {
    constructor() {
        this.frames = [];
    }

    get currentFrame() {
        return this.frames[this.frames.length - 1];
    }

    pushFrame(node) {
        this.frames.push(new Frame(node));
    }

    popFrame() {
        this.frames.pop();
    }

    isLocal(node) {
        // @foo MustacheStatements are referencing globals rather than locals
        if (node.type === 'MustacheStatement' && node.path.data) {
            return _.get(globals, node.path.parts.join('.'));
        }

        let name = getNodeName(node);

        for (let i = this.frames.length - 1; i >= 0; i--) {
            if (this.frames[i].isLocal(name)) {
                return true;
            }
        }
    }
}

module.exports = Scope;