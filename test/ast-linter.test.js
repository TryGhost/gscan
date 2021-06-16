const should = require('should');
const fs = require('fs');
const path = require('path');
const ASTLinter = require('../lib/ast-linter');
const linter = new ASTLinter();

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
                .filter(error => error.rule === 'no-img-url-in-conditionals');
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
});
