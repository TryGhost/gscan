const should = require('should'); // eslint-disable-line no-unused-vars
const Handlebars = require('handlebars');
const sinon = require('sinon');

const Linter = require('../lib/ast-linter/linter');
const {
    Scope,
    Frame,
    getTemplateContext,
    isOnAllowlist
} = require('../lib/ast-linter/rules/internal/scope')._private;

describe('AST linter internals', function () {
    afterEach(function () {
        sinon.restore();
    });

    it('builds scanners that invoke matching visitors and carry context', function () {
        class HelperRule {
            constructor() {}

            getVisitor() {
                return {
                    MustacheStatement(node, scanner) {
                        scanner.context.helpers.push({
                            node: node.path.original,
                            helperType: 'helper'
                        });
                    },
                    PartialStatement(node, scanner) {
                        scanner.context.partials.push({
                            node: node.name.original,
                            normalizedName: node.name.original
                        });
                    }
                };
            }
        }

        const linter = new Linter({
            partials: ['partials\\card'],
            helpers: [],
            inlinePartials: [],
            customThemeSettings: {}
        });

        const scanner = linter.buildScanner({
            rules: {
                helperRule: HelperRule
            },
            log() {},
            source: '{{helper}}\n{{> card}}'
        });

        scanner.accept(Handlebars.parse('{{helper}}\n{{> card}}'));

        scanner.context.helpers.should.deepEqual([{
            node: 'helper',
            helperType: 'helper'
        }]);
        scanner.context.partials.should.deepEqual([{
            node: 'card',
            normalizedName: 'card'
        }]);
        linter.options.partials.should.eql(['partials/card']);
    });

    it('copies scanner context collections during verify and handles parse errors', function () {
        const linter = new Linter();
        const buildScannerStub = sinon.stub(linter, 'buildScanner');

        buildScannerStub.onFirstCall().returns({
            context: {
                partials: [{node: 'card'}],
                helpers: [{node: 'get', helperType: 'helper'}],
                customThemeSettings: ['accent_color'],
                inlinePartials: ['local'],
                usedPageProperties: ['show_title_and_feature_image']
            },
            accept: sinon.spy()
        });

        const messages = linter.verify({
            parsed: {
                ast: Handlebars.parse('{{title}}')
            },
            moduleId: 'index.hbs',
            source: '{{title}}',
            rules: {}
        });

        messages.should.eql([]);
        linter.partials.should.deepEqual([{node: 'card'}]);
        linter.helpers.should.deepEqual([{name: 'get', helperType: 'helper'}]);
        linter.customThemeSettings.should.eql(['accent_color']);
        linter.inlinePartials.should.eql(['local']);
        linter.usedPageProperties.should.eql(['show_title_and_feature_image']);

        buildScannerStub.onSecondCall().returns({
            context: {},
            accept: sinon.spy()
        });

        const parseMessages = linter.verify({
            parsed: {
                error: {
                    message: 'parse failed',
                    column: 4,
                    lineNumber: 2
                }
            },
            moduleId: 'broken.hbs',
            source: '{{',
            rules: {}
        });

        parseMessages.should.deepEqual([{
            moduleId: 'broken.hbs',
            message: 'parse failed',
            fatal: true,
            column: 4,
            line: 2
        }]);
    });

    it('covers additional helper and scope branches', function () {
        should.equal(getTemplateContext('index.hbs'), undefined);
        isOnAllowlist(['page']).should.eql(true);
        isOnAllowlist(['rowEnd']).should.eql(true);

        const pageFrame = new Frame({type: 'Program'}, {fileName: 'page-about.hbs'});
        should.exist(pageFrame);
        should.equal(pageFrame.isLocal('missing'), undefined);

        const scope = new Scope();
        scope.pushTemplateFrame('post.hbs', {type: 'Program'});
        should.exist(scope.currentFrame);

        const parentNode = {
            type: 'BlockStatement',
            path: {
                data: false,
                parts: ['if']
            }
        };

        scope.pushFrame(parentNode);
        scope.hasParentContext('missing').should.eql(false);
        should.equal(scope.getParentContextNode('missing'), null);

        should.equal(scope.isKnownVariable({
            type: 'PathExpression',
            parts: ['missing']
        }), false);

        should.equal(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {
                data: false,
                parts: ['unknownLocal'],
                depth: 1
            }
        }), undefined);
    });
});
