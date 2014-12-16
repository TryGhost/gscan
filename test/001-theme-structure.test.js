/*globals describe, it */
var should = require('should'),
    themePath = require('./utils').themePath,
    thisCheck = require('../lib/checks/001-theme-structure');

/**
 * Response object from .check is:
 * {
 *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */

describe('Theme structure', function () {
    it('should output info about missing theme files (theme example 000)', function () {
        var output = thisCheck.check(themePath('000'));
        output.errors.should.be.an.Array().with.lengthOf(2);
        output.errors[0].should.match(/file not present/);
        output.errors[0].should.match(/index.hbs/);
        output.errors[1].should.match(/file not present/);
        output.errors[1].should.match(/post.hbs/);
        output.warnings.should.be.empty();
        output.recommendations.should.be.an.Array().with.lengthOf(1);
        output.recommendations[0].should.match(/file not present/);
        output.recommendations[0].should.match(/default.hbs/);
    });

    it('should output error when a required theme file is missing (theme example 001)', function () {
        var output = thisCheck.check(themePath('001'));
        output.errors.should.be.an.Array().with.lengthOf(1);
        output.errors[0].should.match(/file not present/);
        output.errors[0].should.match(/post.hbs/);
        output.warnings.should.be.empty();
        output.recommendations.should.be.an.Array().with.lengthOf(1);
        output.recommendations[0].should.match(/file not present/);
        output.recommendations[0].should.match(/default.hbs/);
    });

    it('should output recommendation when a suggested theme file is missing (theme example 002)', function () {
        var output = thisCheck.check(themePath('002'));
        output.errors.should.be.empty();
        output.warnings.should.be.empty();
        output.recommendations.should.be.an.Array().with.lengthOf(1);
        output.recommendations[0].should.match(/file not present/);
        output.recommendations[0].should.match(/default.hbs/);
    });
});