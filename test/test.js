/*globals describe, it */
var should = require('should'),
    GTC = require('../lib/ghost-theme-checker');

/**
 * Response object from .check is:
 * {
  *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */


describe('package.json', function () {
    it('should output warnings for missing package.json (000)', function () {
        var output = GTC.check('./fixtures/themes/000');
        output.errors.should.be.empty;
        output.warnings.length.should.be.exactly(1);
        output.recommendations.should.be.empty;
    });

    it('should output warnings for missing author (001)', function () {
        var output = GTC.check('./fixtures/themes/001');
        output.errors.should.be.empty;
        output.warnings.length.should.be.exactly(1);
        output.recommendations.should.be.empty;
    });
});