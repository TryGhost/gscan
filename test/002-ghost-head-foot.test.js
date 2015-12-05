/*globals describe, it */
var should = require('should'),
    themePath = require('./utils').themePath,
    thisCheck = require('../lib/checks/002-ghost-head-foot');

/**
 * Response object from .check is:
 * {
 *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */

describe('Ghost head & foot', function () {
    it('should show errors for missing ghost head & foot helpers when no .hbs files are present(theme example a)', function (done) {
        thisCheck.check(themePath('example-a')).then(function (output) {
            output.errors.should.be.an.Array().with.lengthOf(2);
            output.errors[0].should.match(/helper not present/);
            output.errors[0].should.match(/ghost_head/);
            output.errors[1].should.match(/helper not present/);
            output.errors[1].should.match(/ghost_foot/);
            output.warnings.should.be.empty();
            output.recommendations.should.be.empty();
            done();
        }).catch(done);
    });

    it('should show errors for missing ghost head & foot helpers when they are not in any .hbs file (theme example d)', function (done) {
        thisCheck.check(themePath('example-d')).then(function (output) {
            output.errors.should.be.an.Array().with.lengthOf(2);
            output.errors[0].should.match(/helper not present/);
            output.errors[0].should.match(/ghost_head/);
            output.errors[1].should.match(/helper not present/);
            output.errors[1].should.match(/ghost_foot/);
            output.warnings.should.be.empty();
            output.recommendations.should.be.empty();
            done();
        }).catch(done);
    });

    it('should output nothing when ghost head & foot helpers are present (theme example e)', function (done) {
        thisCheck.check(themePath('example-e')).then(function (output) {
            output.errors.should.be.empty();
            output.warnings.should.be.empty();
            output.recommendations.should.be.empty();
            done();
        }).catch(done);
    });
});
