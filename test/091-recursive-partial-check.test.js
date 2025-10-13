const should = require('should');
const utils = require('./utils');
const checkRecursivePartials = require('../lib/checks/091-recursive-partial-check');

describe('091 Recursive partial check', function () {
    it('should detect direct recursion when a partial includes itself', function (done) {
        utils.testCheck(checkRecursivePartials, '091-recursive-partials/direct-recursion').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should fail with recursive partial error
            output.results.fail.should.be.an.Object();
            output.results.fail['GS091-RECURSIVE-PARTIAL'].should.be.an.Object();

            const failures = output.results.fail['GS091-RECURSIVE-PARTIAL'].failures;
            failures.should.be.an.Array();
            failures.length.should.be.greaterThan(0);

            // Check that the error message mentions the recursive partial
            const hasDirectRecursion = failures.some(failure => failure.message.includes('header') &&
                (failure.message.includes('includes itself') || failure.message.includes('Direct recursive'))
            );
            hasDirectRecursion.should.be.true();

            done();
        }).catch(done);
    });

    it('should detect circular dependencies between partials', function (done) {
        utils.testCheck(checkRecursivePartials, '091-recursive-partials/circular-dependency').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should fail with recursive partial error
            output.results.fail.should.be.an.Object();
            output.results.fail['GS091-RECURSIVE-PARTIAL'].should.be.an.Object();

            const failures = output.results.fail['GS091-RECURSIVE-PARTIAL'].failures;
            failures.should.be.an.Array();
            failures.length.should.be.greaterThan(0);

            // Check that the error message mentions the circular dependency
            const hasCircularDependency = failures.some(failure => failure.message.includes('Circular partial dependency') &&
                failure.message.includes('partial-a') &&
                failure.message.includes('partial-b') &&
                failure.message.includes('partial-c')
            );
            hasCircularDependency.should.be.true();

            done();
        }).catch(done);
    });

    it('should pass when there are no recursive partials', function (done) {
        utils.testCheck(checkRecursivePartials, '091-recursive-partials/no-recursion').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should pass the check
            output.results.pass.should.be.an.Array();
            output.results.pass.should.containEql('GS091-RECURSIVE-PARTIAL');

            // Should not have any failures for this check
            if (output.results.fail['GS091-RECURSIVE-PARTIAL']) {
                should.not.exist(output.results.fail['GS091-RECURSIVE-PARTIAL']);
            }

            done();
        }).catch(done);
    });

    describe('Edge cases', function () {
        it('should handle themes with no partials', function (done) {
            // Use a minimal theme without partials
            utils.testCheck(checkRecursivePartials, 'is-empty').then(function (output) {
                output.should.be.a.ValidThemeObject();

                // Should pass when there are no partials to check
                output.results.pass.should.be.an.Array();
                output.results.pass.should.containEql('GS091-RECURSIVE-PARTIAL');

                done();
            }).catch(done);
        });
    });
});