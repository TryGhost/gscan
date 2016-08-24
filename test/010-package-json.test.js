/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/010-package-json');

describe('package.json', function () {
    it('should output error for missing package.json (theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should auto pass valid rule
            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS010-PJ-VAL');

            // Should have resulted in a failures
            output.results.fail.should.be.an.Object().with.keys('GS010-PJ-REQ');
            output.results.fail['GS010-PJ-REQ'].should.be.a.ValidFailObject();

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

    it('should output warnings ONLY for missing author (theme example c)', function (done) {
        utils.testCheck(thisCheck, 'example-c').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().which.is.empty();

            output.results.pass.should.be.an.Array().with.lengthOf(2);
            output.results.pass.should.containEql('GS010-PJ-REQ');
            output.results.pass.should.containEql('GS010-PJ-VAL');

            done();
        });
    });

    it('should output warning-level error for invalid version (theme example g)', function (done) {
        utils.testCheck(thisCheck, 'example-g').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().with.keys('GS010-PJ-VAL');
            output.results.fail['GS010-PJ-VAL'].should.be.a.ValidFailObject();
            output.results.fail['GS010-PJ-VAL'].failures.should.be.an.Array().with.lengthOf(1);
            output.results.fail['GS010-PJ-VAL'].failures[0].should.have.keys('ref', 'message');

            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS010-PJ-REQ');


            done();
        });
    });

    it('should output warning-level errors when there are multiple errors (theme example h)', function (done) {
        utils.testCheck(thisCheck, 'example-h').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().with.keys('GS010-PJ-VAL');
            output.results.fail['GS010-PJ-VAL'].should.be.a.ValidFailObject();
            output.results.fail['GS010-PJ-VAL'].failures.should.be.an.Array().with.lengthOf(2);
            output.results.fail['GS010-PJ-VAL'].failures[0].should.have.keys('ref', 'message');
            output.results.fail['GS010-PJ-VAL'].failures[1].should.have.keys('ref', 'message');

            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS010-PJ-REQ');


            done();
        });
    });
});