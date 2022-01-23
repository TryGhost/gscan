const should = require('should');
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
            should(results).have.length(0);
        });
    });

    describe('should satisfy the img_url rule', function () {
        before(function () {
            template = getTemplate('img-url-in-conditional.hbs');
        });

        it('should reject using img_url in a conditional', function () {
            const parsed = ASTLinter.parse(template);
            const results = linter
                .verify({parsed, moduleId: 'simple.hbs', source: template})
                .filter(error => error.rule === 'GS090-NO-IMG-URL-IN-CONDITIONALS');
            should(results).have.length(1);
            should(results[0].line).eql(2);
            should(results[0].column).eql(0);
        });
    });

    describe('should satisfy the multi-param-conditional rule', function () {
        before(function () {
            template = getTemplate('multi-param-conditional.hbs');
        });

        it('should reject using multiple params in a conditional', function () {
            const parsed = ASTLinter.parse(template);
            const results = linter
                .verify({parsed, moduleId: 'simple.hbs', source: template})
                .filter(error => error.rule === 'no-multi-param-conditionals');
            should(results).have.length(1);
            should(results[0].line).eql(2);
            should(results[0].column).eql(0);
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

            localLinter.helpers.length.should.eql(1);
            localLinter.helpers[0].name.should.eql('pagination');
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

            localLinter.helpers.length.should.eql(1);
            localLinter.helpers[0].name.should.eql('pagination');
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

            localLinter.inlinePartials.length.should.eql(1);
            localLinter.inlinePartials[0].node.should.eql('myInlinePartial');
            localLinter.inlinePartials[0].parents.length.should.eql(1);
            localLinter.inlinePartials[0].parents[0].type.should.eql('Program');
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

            messages.length.should.eql(0);
            // messages[0].message.should.eql('Missing Custom Theme Setting: "my_text_prop2"');
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

            messages.length.should.eql(5);
            messages.map(msg => msg.source).should.deepEqual([
                '@custom.cover_style',
                '@custom.cover_color',
                '@custom.my_text_prop',
                '@custom.my_text_prop2',
                '@custom.is_feature_enabled'
            ]);
        });
    });

    describe('Custom theme select settings usage in match', function () {
        it('errors out when an unkown value is found', function () {
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

            messages.length.should.eql(1);
            messages[0].message.should.eql('Invalid custom theme select value: "comic sans"');
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

            messages.length.should.eql(0);
        });
    });

    describe('getPartialName', function () {
        it('should return the name of a partial with quotes', function () {
            const parsed = ASTLinter.parse('{{> "test/testing"}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            name.should.eql('test/testing');
        });

        it('should return the name of a partial without quotes', function () {
            const parsed = ASTLinter.parse('{{> test/testing}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            name.should.eql('test/testing');
        });

        it('should return the name of a partial without the context', function () {
            const parsed = ASTLinter.parse('{{> test/testing context1 context2}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            name.should.eql('test/testing');
        });

        it('should return the name of a partial without the parameters', function () {
            const parsed = ASTLinter.parse('{{> test/testing parameter=paramValue}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            name.should.eql('test/testing');
        });

        it('should return the name of a partial block', function () {
            const parsed = ASTLinter.parse('{{#> test/testing}}OK{{/test/testing}}');
            const pathExpression = parsed.ast.body[0];
            const name = helpers.getPartialName(pathExpression);

            name.should.eql('test/testing');
        });
    });
});
