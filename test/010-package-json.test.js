/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/010-package-json');

describe('package.json', function () {
    it('should output error for missing package.json (theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should not pass any rules
            output.results.pass.should.be.an.Array().which.is.empty();

            // Should have resulted in 2 failures
            output.results.fail.should.be.an.Object().with.keys('GS010-PJ-REQ', 'GS010-PJ-VAL');
            output.results.fail['GS010-PJ-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS010-PJ-VAL'].should.be.a.ValidFailObject();

            done();
        });
    });

    it('should output error for invalid package.json (theme example b)', function (done) {
        utils.testCheck(thisCheck, 'example-b').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should pass the exists rule
            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS010-PJ-REQ');

            output.results.fail.should.be.an.Object().with.keys('GS010-PJ-VAL');
            output.results.fail['GS010-PJ-VAL'].should.be.a.ValidFailObject();
            output.results.fail['GS010-PJ-VAL'].message.should.match(/Invalid JSON/);

            done();
        });
    });

    it('should output warnings for missing author (theme example c)', function (done) {
        utils.testCheck(thisCheck, 'example-c').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().which.is.empty();
            output.results.pass.should.be.an.Array().with.lengthOf(2);

            done();
        });
    });
});