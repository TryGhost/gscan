const should = require('should'); // eslint-disable-line no-unused-vars

const helpers = require('../lib/ast-linter/helpers');

describe('AST linter helpers', function () {
    it('derives node names across supported node shapes', function () {
        helpers.getNodeName({
            type: 'MustacheStatement',
            path: {
                data: true,
                parts: ['site', 'title']
            }
        }).should.eql('@site.title');

        should.equal(helpers.getNodeName({type: 'Program'}), undefined);

        helpers.getNodeName({
            type: 'PathExpression',
            data: true,
            parts: ['site', 'icon']
        }).should.eql('@site.icon');

        helpers.getNodeName({
            type: 'PathExpression',
            parts: ['post', 'title']
        }).should.eql('post');

        helpers.getNodeName({
            type: 'Unknown',
            name: {
                parts: ['author', 'name']
            }
        }).should.eql('author');

        helpers.getNodeName({
            type: 'Unknown',
            name: {
                original: 'navigation'
            }
        }).should.eql('navigation');
    });

    it('formats partial and block node labels', function () {
        helpers.getPartialName({
            name: {
                original: 'partials/card'
            }
        }).should.eql('partials/card');

        helpers.logNode({
            type: 'BlockStatement',
            inverse: true,
            program: undefined,
            path: {
                data: false,
                parts: ['if']
            }
        }).should.eql('{{^if}}');

        helpers.logNode({
            type: 'BlockStatement',
            inverse: false,
            program: {},
            path: {
                data: false,
                parts: ['foreach']
            }
        }).should.eql('{{#foreach}}');
    });

    it('classifies helper expressions, ambiguous paths, and simple values', function () {
        helpers.classifyNode({
            path: {
                type: 'PathExpression',
                parts: ['title'],
                original: 'title',
                data: false,
                depth: 0
            },
            params: [],
            hash: {
                pairs: []
            }
        }).should.eql('ambiguous');

        helpers.classifyNode({
            path: {
                type: 'PathExpression',
                parts: ['title'],
                original: 'title',
                data: false,
                depth: 0
            },
            params: [],
            hash: {
                pairs: []
            }
        }, {
            knownHelpers: ['title'],
            knownHelpersOnly: false,
            blockParams: []
        }).should.eql('helper');

        helpers.classifyNode({
            path: {
                type: 'PathExpression',
                parts: ['title'],
                original: 'title',
                data: false,
                depth: 0
            },
            params: [],
            hash: {
                pairs: []
            }
        }, {
            knownHelpers: [],
            knownHelpersOnly: true,
            blockParams: []
        }).should.eql('simple');

        helpers.classifyNode({
            path: {
                type: 'PathExpression',
                parts: ['title'],
                original: 'title',
                data: false,
                depth: 0
            },
            params: [{
                original: '"post"'
            }],
            hash: {
                pairs: []
            }
        }).should.eql('ambiguous');
    });

    it('transforms literal paths only when needed', function () {
        const literalNode = {
            path: {
                original: false,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    }
                }
            }
        };

        helpers.transformLiteralToPath(literalNode);

        literalNode.path.should.deepEqual({
            type: 'PathExpression',
            data: false,
            depth: 0,
            parts: ['false'],
            original: 'false',
            loc: {
                start: {
                    line: 1,
                    column: 0
                }
            }
        });

        const pathNode = {
            path: {
                parts: ['post'],
                original: 'post'
            }
        };

        helpers.transformLiteralToPath(pathNode);
        pathNode.path.should.deepEqual({
            parts: ['post'],
            original: 'post'
        });
    });
});
