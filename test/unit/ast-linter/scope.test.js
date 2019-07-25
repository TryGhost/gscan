const Linter = require('../../../lib/ast-linter');
const linter = new Linter();

describe('AST Linter - Scope', function () {
    describe('pushFrame', function () {
        it('creates frame');
        it('creates frame with leaf-most context');
        it('creates frame with depth context');
    });
});