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
