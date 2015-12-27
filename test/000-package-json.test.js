/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
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
    it('should output error for missing package.json (theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.errors.should.be.an.Array().with.lengthOf(1);
            output.errors[0].should.match(/file not present/);
            output.warnings.should.be.empty();
            output.recommendations.should.be.empty();
            done();
        });
    });

    it('should output error for invalid package.json (theme example b)', function (done) {
        utils.testCheck(thisCheck, 'example-b').then(function (output) {
            output.errors.should.be.an.Array().with.lengthOf(1);
            output.errors[0].should.match(/file is invalid/);
            output.warnings.should.be.empty();
            output.recommendations.should.be.empty();
            done();
        });
    });

    it('should output warnings for missing author (theme example c)', function (done) {
        utils.testCheck(thisCheck, 'example-c').then(function (output) {
            output.errors.should.be.empty();
            output.warnings.should.be.an.Array().with.lengthOf(7);
            output.recommendations.should.be.an.Array().with.lengthOf(3);
            done();
        });
    });
});