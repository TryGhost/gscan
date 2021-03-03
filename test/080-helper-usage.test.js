const should = require('should'); // eslint-disable-line no-unused-vars
const utils = require('./utils');
const thisCheck = require('../lib/checks/080-helper-usage');

describe('080 Usage tests', function () {
    it('should not run check for v1', function (done) {
        const options = {checkVersion: 'v1'};
        utils.testCheck(thisCheck, '080-helper-usage/v1/invalid', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();
            output.results.fail.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });

    it('should not run check for v2', function (done) {
        const options = {checkVersion: 'v2'};
        utils.testCheck(thisCheck, '080-helper-usage/v2/invalid', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();
            output.results.fail.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('[success] should show no error if helpers usage is correct', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/v3/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();
                output.results.pass.should.be.an.Array().with.lengthOf(2);

                done();
            }).catch(done);
        });

        it('[failure] theme is invalid', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/canary/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
                    'GS080-FEACH-POSTS',
                    'GS080-CARD-LAST4'
                );

                output.results.fail['GS080-FEACH-POSTS'].should.be.a.ValidFailObject();
                output.results.fail['GS080-FEACH-POSTS'].failures.length.should.eql(1);

                output.results.fail['GS080-CARD-LAST4'].should.be.a.ValidFailObject();
                output.results.fail['GS080-CARD-LAST4'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Array().with.lengthOf(0);

                done();
            }).catch(done);
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/v3/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
                    'GS080-FEACH-POSTS'
                );

                output.results.fail['GS080-FEACH-POSTS'].should.be.a.ValidFailObject();
                output.results.fail['GS080-FEACH-POSTS'].failures.length.should.eql(2);

                output.results.pass.should.be.an.Array().with.lengthOf(1);

                done();
            }).catch(done);
        });
    });

    describe('canary:', function () {
        const options = {checkVersion: 'canary'};

        it('[success] should show no error if helpers usage is correct', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/canary/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();
                output.results.pass.should.be.an.Array().with.lengthOf(1);

                done();
            }).catch(done);
        });

        it('[failure] theme is invalid', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/canary/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
                    'GS080-FEACH-PV'
                );

                output.results.fail.should.not.have.keys(
                    'GS080-CARD-LAST4'
                );

                output.results.fail['GS080-FEACH-PV'].should.be.a.ValidFailObject();
                output.results.fail['GS080-FEACH-PV'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Array().with.lengthOf(0);

                done();
            }).catch(done);
        });
    });
});
