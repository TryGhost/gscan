const fs = require('fs');
const path = require('path');
const ASTLinter = require('../lib/ast-linter');
const linter = new ASTLinter();
const helpers = require('../lib/ast-linter/helpers');

function getTemplate(name) {
    return fs.readFileSync(path.join(__dirname, 'fixtures', 'ast-linter', name), {encoding: 'utf8'});
}

let template;
describe('ast-linter', function () {
    describe('basic tests', function () {
        it('should\'t display errors for a simple template', function () {
            template = getTemplate('simple.hbs');
            const parsed = ASTLinter.parse(template);
            const results = linter.verify({parsed, moduleId: 'simple.hbs', source: template});
            expect(results).toHaveLength(0);
        });
    });

    describe('should satisfy the img_url rule', function () {
        beforeAll(function () {
            template = getTemplate('img-url-in-conditional.hbs');
        });

        it('should reject using img_url in a conditional', function () {
            const parsed = ASTLinter.parse(template);
            const results = linter
                .verify({parsed, moduleId: 'simple.hbs', source: template})
                .filter(error => error.rule === 'GS090-NO-IMG-URL-IN-CONDITIONALS');
            expect(results).toHaveLength(1);
            expect(results[0].line).toEqual(2);
            expect(results[0].column).toEqual(0);
        });
    });

    describe('should satisfy the multi-param-conditional rule', function () {
        beforeAll(function () {
            template = getTemplate('multi-param-conditional.hbs');
        });

        it('should reject using multiple params in a conditional', function () {
            const parsed = ASTLinter.parse(template);
            const results = linter
                .verify({parsed, moduleId: 'simple.hbs', source: template})
                .filter(error => error.rule === 'no-multi-param-conditionals');
            expect(results).toHaveLength(1);
            expect(results[0].line).toEqual(2);
            expect(results[0].column).toEqual(0);
        });

        it('should reject using no params in a conditional', function () {
            const source = '{{#unless}}{{/unless}}';
            const parsed = ASTLinter.parse(source);
            const results = linter
                .verify({parsed, moduleId: 'simple.hbs', source})
                .filter(error => error.rule === 'no-multi-param-conditionals');
            expect(results).toHaveLength(1);
            expect(results[0].line).toEqual(1);
            expect(results[0].column).toEqual(0);
        });
    });

    describe('Helper extraction', function () {
        it('extracts a simple helper', function () {
            const localLinter = new ASTLinter();
            const source = '{{pagination}}';
            const parsed = ASTLinter.parse(source);
            localLinter.verify({
                parsed: parsed,
                rules: [
                    require('../lib/ast-linter/rules/mark-used-helpers')
                ],
                source: source,
                moduleId: 'index.hbs'
            });

            expect(localLinter.helpers.length).toEqual(1);
            expect(localLinter.helpers[0].name).toEqual('pagination');
        });

        it('extracts a simple double-quoted helper', function () {
            const localLinter = new ASTLinter();
            const source = '{{"pagination"}}';
            const parsed = ASTLinter.parse(source);
            localLinter.verify({
                parsed: parsed,
                rules: [
                    require('../lib/ast-linter/rules/mark-used-helpers')
                ],
                source: source,
                moduleId: 'index.hbs'
            });

            expect(localLinter.helpers.length).toEqual(1);
            expect(localLinter.helpers[0].name).toEqual('pagination');
        });
    });

    describe('should satisfy the nested async helpers rule', function () {
        it('should reject nested async helpers', function () {
            template = getTemplate('nested-async-helpers.hbs');
            const parsed = ASTLinter.parse(template);
            const results = linter
                .verify({parsed, moduleId: 'index.hbs', source: template})
                .filter(error => error.rule === 'no-nested-async-helpers');
            expect(results).toHaveLength(1);
            expect(results[0].message).toMatch(/get.*cannot be used inside.*get/);
            expect(results[0].line).toEqual(2);
            expect(results[0].column).toEqual(4);
        });
    });

    describe('should satisfy the prev/next post outside post context rule', function () {
        it('should reject prev_post outside post context', function () {
            template = getTemplate('prev-next-outside-post.hbs');
            const parsed = ASTLinter.parse(template);
            const results = linter
                .verify({parsed, moduleId: 'index.hbs', source: template})
                .filter(error => error.rule === 'no-prev-next-post-outside-post-context');
            expect(results).toHaveLength(1);
            expect(results[0].message).toMatch(/prev_post.*can only be used in a post context/);
            expect(results[0].line).toEqual(1);
            expect(results[0].column).toEqual(0);
        });
    });

    describe('Inline partial extraction', function () {
        it('extracts a simple inline partial', function () {
            const localLinter = new ASTLinter();
            const source = '{{#*inline "myInlinePartial"}}My Content{{/inline}}';
            const parsed = ASTLinter.parse(source);
            localLinter.verify({
                parsed: parsed,
                rules: [
                    require('../lib/ast-linter/rules/mark-declared-inline-partials')
                ],
                source: source,
                moduleId: 'index.hbs'
            });

            expect(localLinter.inlinePartials.length).toEqual(1);
            expect(localLinter.inlinePartials[0].node).toEqual('myInlinePartial');
            expect(localLinter.inlinePartials[0].parents.length).toEqual(1);
            expect(localLinter.inlinePartials[0].parents[0].type).toEqual('Program');
        });
    });

    describe('Custom theme settings extraction', function () {
        it('extracts a simple custom theme settings', function () {
            const localLinter = new ASTLinter({
                partials: [],
                helpers: [],
                customThemeSettings: {my_text_prop: {}}
            });
            const source = '{{@custom.my_text_prop}}';
            const parsed = ASTLinter.parse(source);
            const messages = localLinter.verify({
                parsed: parsed,
                rules: [
                    require('../lib/ast-linter/rules/lint-no-unknown-custom-theme-settings')
                ],
                source: source,
                moduleId: 'index.hbs'
            });

            expect(messages.length).toEqual(0);
            // Example: expect(messages[0].message).toEqual('Missing Custom Theme Setting: "my_text_prop2"');
        });

        it('extracts more complex custom theme settings', function () {
            const localLinter = new ASTLinter();
            const source = '{{#match @custom.cover_style "!=" "No cover"}}{{/match}}{{#match "No cover" "!=" @custom.cover_color}}{{/match}}{{echo @custom.my_text_prop}}{{echo (url @custom.my_text_prop2)}}{{#if @custom.is_feature_enabled}}{{/if}}';
            const parsed = ASTLinter.parse(source);
            const messages = localLinter.verify({
                parsed: parsed,
                rules: [
                    require('../lib/ast-linter/rules/lint-no-unknown-custom-theme-settings')
                ],
                source: source,
                moduleId: 'index.hbs'
            });

            expect(messages.length).toEqual(5);
            expect(messages.map(msg => msg.source)).toEqual([
                '@custom.cover_style',
                '@custom.cover_color',
                '@custom.my_text_prop',
                '@custom.my_text_prop2',
                '@custom.is_feature_enabled'
            ]);
        });
    });

    describe('Custom theme select settings usage in match', function () {
        it('errors out when an unknown value is found', function () {
            const localLinter = new ASTLinter({
                partials: [],
                helpers: [],
                customThemeSettings: {
                    typography: {
                        type: 'select',
                        options: ['serif','sans-serif']
                    }
                }
            });
            const source = '{{#match @custom.typography "=" "comic sans"}}{{/match}}';
            const parsed = ASTLinter.parse(source);
            const messages = localLinter.verify({
                parsed: parsed,
                rules: [
                    require('../lib/ast-linter/rules/lint-no-unknown-custom-theme-select-value-in-match')
                ],
                source: source,
                moduleId: 'index.hbs'
            });

            expect(messages.length).toEqual(1);
            expect(messages[0].message).toEqual('Invalid custom theme select value: "comic sans"');
        });

        it('doesn\'t error out when a kown value is found', function () {
            const localLinter = new ASTLinter({
                partials: [],
                helpers: [],
                customThemeSettings: {
                    typography: {
                        type: 'select',
                        options: ['serif','sans-serif']
                    }
                }
            });
            const source = '{{#match @custom.typography "=" "sans-serif"}}{{/match}}{{#match @custom.typography "sans-serif"}}{{/match}}';
            const parsed = ASTLinter.parse(source);
            const messages = localLinter.verify({
                parsed: parsed,
                rules: [
                    require('../lib/ast-linter/rules/lint-no-unknown-custom-theme-settings')
                ],
                source: source,
                moduleId: 'index.hbs'
            });

            expect(messages.length).toEqual(0);
        });
    });

    describe('getPartialName', function () {
        it('should return the name of a partial with quotes', function () {
            const parsed = ASTLinter.parse('{{> "test/testing"}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            expect(name).toEqual('test/testing');
        });

        it('should return the name of a partial without quotes', function () {
            const parsed = ASTLinter.parse('{{> test/testing}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            expect(name).toEqual('test/testing');
        });

        it('should return the name of a partial without the context', function () {
            const parsed = ASTLinter.parse('{{> test/testing context1 context2}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            expect(name).toEqual('test/testing');
        });

        it('should return the name of a partial without the parameters', function () {
            const parsed = ASTLinter.parse('{{> test/testing parameter=paramValue}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            expect(name).toEqual('test/testing');
        });

        it('should return the name of a partial block', function () {
            const parsed = ASTLinter.parse('{{#> test/testing}}OK{{/test/testing}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            expect(name).toEqual('test/testing');
        });
    });

    describe('helpers utility functions', function () {
        it('getNodeName handles program and path-expression variants', function () {
            expect(helpers.getNodeName({type: 'Program'})).toBeUndefined();
            expect(helpers.getNodeName({type: 'PathExpression', data: true, parts: ['custom', 'color']})).toEqual('@custom.color');
            expect(helpers.getNodeName({type: 'PathExpression', data: false, parts: ['author', 'name']})).toEqual('author');
            expect(helpers.getNodeName({type: 'Unknown', name: {parts: ['fallback']}})).toEqual('fallback');
            expect(helpers.getNodeName({type: 'Unknown', name: {original: 'raw-name'}})).toEqual('raw-name');
        });

        it('logNode uses inverse and block prefixes correctly', function () {
            expect(helpers.logNode({
                type: 'BlockStatement',
                path: {data: false, parts: ['if']},
                inverse: {},
                program: null
            })).toEqual('{{^if}}');

            expect(helpers.logNode({
                type: 'BlockStatement',
                path: {data: false, parts: ['if']},
                program: {}
            })).toEqual('{{#if}}');
        });

        it('classifyNode handles helper, ambiguous, knownHelpersOnly and block params', function () {
            const ambiguousNode = ASTLinter.parse('{{foo}}').ast.body[0];

            expect(helpers.classifyNode(ambiguousNode, {
                knownHelpers: [],
                knownHelpersOnly: false,
                blockParams: []
            })).toEqual('ambiguous');

            expect(helpers.classifyNode(ambiguousNode, {
                knownHelpers: ['foo'],
                knownHelpersOnly: false,
                blockParams: []
            })).toEqual('helper');

            expect(helpers.classifyNode(ambiguousNode, {
                knownHelpers: [],
                knownHelpersOnly: true,
                blockParams: []
            })).toEqual('simple');

            expect(helpers.classifyNode(ambiguousNode, {
                knownHelpers: [],
                knownHelpersOnly: false,
                blockParams: [['foo']]
            })).toEqual('simple');
        });

        it('transformLiteralToPath converts literal paths and skips existing path expressions', function () {
            const literalNode = ASTLinter.parse('{{"pagination"}}').ast.body[0];
            helpers.transformLiteralToPath(literalNode);
            expect(literalNode.path.parts).toEqual(['pagination']);
            expect(literalNode.path.original).toEqual('pagination');

            const pathNode = ASTLinter.parse('{{pagination}}').ast.body[0];
            const existingPath = pathNode.path;
            helpers.transformLiteralToPath(pathNode);
            expect(pathNode.path).toBe(existingPath);
        });
    });
});
