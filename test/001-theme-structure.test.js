/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),

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
    it('should output info about missing theme files (theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.errors.should.be.an.Array().with.lengthOf(2);
            output.errors[0].should.match(/file not present/);
            output.errors[0].should.match(/index.hbs/);
            output.errors[1].should.match(/file not present/);
            output.errors[1].should.match(/post.hbs/);
            output.warnings.should.be.empty();
            output.recommendations.should.be.an.Array().with.lengthOf(1);
            output.recommendations[0].should.match(/file not present/);
            output.recommendations[0].should.match(/default.hbs/);
            done();
        });
    });

    it('should output error when a required theme file is missing (theme example b)', function (done) {
        utils.testCheck(thisCheck, 'example-b').then(function (output) {
            output.errors.should.be.an.Array().with.lengthOf(1);
            output.errors[0].should.match(/file not present/);
            output.errors[0].should.match(/post.hbs/);
            output.warnings.should.be.empty();
            output.recommendations.should.be.an.Array().with.lengthOf(1);
            output.recommendations[0].should.match(/file not present/);
            output.recommendations[0].should.match(/default.hbs/);
            done();
        });
    });

    it('should output recommendation when a suggested theme file is missing (theme example c)', function (done) {
        utils.testCheck(thisCheck, 'example-c').then(function (output) {
            output.errors.should.be.empty();
            output.warnings.should.be.empty();
            output.recommendations.should.be.an.Array().with.lengthOf(1);
            output.recommendations[0].should.match(/file not present/);
            output.recommendations[0].should.match(/default.hbs/);
            done();
        });
    });
});