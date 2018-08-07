var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),

    thisCheck = require('../lib/checks/020-theme-structure');

describe('Theme structure', function () {
    it('should fail all rules if no files present', function (done) {
        utils.testCheck(thisCheck, 'is-empty').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should not pass any rules
            output.results.pass.should.be.an.Array().which.is.empty();

            output.results.fail.should.be.an.Object().with.keys('GS020-INDEX-REQ', 'GS020-POST-REQ', 'GS020-DEF-REC');
            output.results.fail['GS020-INDEX-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS020-POST-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS020-DEF-REC'].should.be.a.ValidFailObject();

            done();
        });
    });

    it('should pass and fail when some rules pass and others fail', function (done) {
        utils.testCheck(thisCheck, '020-structure/mixed').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should pass the index rule
            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS020-INDEX-REQ');

            output.results.fail.should.be.an.Object().with.keys('GS020-POST-REQ', 'GS020-DEF-REC');

            output.results.fail['GS020-POST-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS020-DEF-REC'].should.be.a.ValidFailObject();

            done();
        });
    });

    it('should still fail with just a recommendation', function (done) {
        utils.testCheck(thisCheck, '020-structure/recommendation').then(function (output) {
            output.should.be.a.ValidThemeObject();

            // Should not pass any rules
            output.results.pass.should.be.an.Array().with.lengthOf(2);
            output.results.pass.should.containEql('GS020-INDEX-REQ', 'GS020-POST-REQ');

            output.results.fail.should.be.an.Object().with.keys('GS020-DEF-REC');

            output.results.fail['GS020-DEF-REC'].should.be.a.ValidFailObject();

            done();
        });
    });
});
