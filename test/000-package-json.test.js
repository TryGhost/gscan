/*globals describe, it */
var should = require('should'),
    themePath = require('./utils').themePath,
    thisCheck = require('../lib/checks/000-package-json');

/**
 * Response object from .check is:
 * {
 *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */

describe('package.json', function () {
    it('should output error for missing package.json (theme example 000)', function () {
        var output = thisCheck.check(themePath('000'));
        output.errors.should.be.an.Array().with.lengthOf(1);
        output.errors[0].should.match(/file not present/);
        output.warnings.should.be.empty();
        output.recommendations.should.be.empty();
    });

    it('should output error for invalid package.json (theme example 001)', function () {
        var output = thisCheck.check(themePath('001'));
        output.errors.should.be.an.Array().with.lengthOf(1);
        output.errors[0].should.match(/file is invalid/);
        output.warnings.should.be.empty();
        output.recommendations.should.be.empty();
    });

    it('should output warnings for missing author (theme example 002)', function () {
        var output = thisCheck.check(themePath('002'));
        output.errors.should.be.empty();
        output.warnings.should.be.an.Array().with.lengthOf(7);
        output.recommendations.should.be.an.Array().with.lengthOf(3);
    });
});