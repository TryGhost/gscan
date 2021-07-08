var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/090-template-syntax');

describe('090 Template syntax', function () {
    describe('canary', function () {
        const options = {checkVersion: 'canary'};

        it('should output empty array for a theme with no templates', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS090-NO-IMG-URL-IN-CONDITIONALS');

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with valid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS090-NO-IMG-URL-IN-CONDITIONALS');

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with invalid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS090-NO-IMG-URL-IN-CONDITIONALS');
                done();
            }).catch(done);
        });

        it('should output an error for a theme breaking the rules', function (done) {
            utils.testCheck(thisCheck, '090-template-syntax/img-url-in-conditional', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys('GS090-NO-IMG-URL-IN-CONDITIONALS');
                output.results.fail['GS090-NO-IMG-URL-IN-CONDITIONALS'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });
    });
});
