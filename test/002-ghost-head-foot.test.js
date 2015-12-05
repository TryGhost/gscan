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
    it('should output info about missing ghost head and foot helpers (theme example 002)', function (done) {
        thisCheck.check(themePath('002')).then(function (output) {
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

    it('should output info about missing ghost head and foot helpers (theme example 003)', function (done) {
        thisCheck.check(themePath('003')).then(function (output) {
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

    it('should output info about missing ghost head and foot helpers (theme example 004)', function (done) {
        thisCheck.check(themePath('004')).then(function (output) {
            output.errors.should.be.empty();
            output.warnings.should.be.empty();
            output.recommendations.should.be.empty();
            done();
        }).catch(done);
    });
});
