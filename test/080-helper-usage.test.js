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

    it('should not run check for v3', function (done) {
        const options = {checkVersion: 'v3'};
        utils.testCheck(thisCheck, '080-helper-usage/v3/invalid', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();
            output.results.fail.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('[success] should show no error if helpers usage is correct', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/v4/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();
                output.results.pass.should.be.an.Array().with.lengthOf(3);

                done();
            }).catch(done);
        });

        it('[failure] should show error if helper usage is incorrect in subfolders', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/v4/invalid-folder', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
                    'GS080-FEACH-PV'
                );
                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail['GS080-FEACH-PV'].should.be.a.ValidFailObject();
                output.results.fail['GS080-FEACH-PV'].failures.length.should.eql(1);

                done();
            }).catch(done);
        });

        it('[failure] theme is invalid', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/v4/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
                    'GS080-FEACH-PV',
                    'GS080-CARD-LAST4',
                    'GS080-FEACH-POSTS'
                );

                output.results.fail['GS080-FEACH-PV'].should.be.a.ValidFailObject();
                output.results.fail['GS080-FEACH-PV'].failures.length.should.eql(1);

                output.results.fail['GS080-FEACH-POSTS'].should.be.a.ValidFailObject();
                output.results.fail['GS080-FEACH-POSTS'].failures.length.should.eql(1);

                output.results.fail['GS080-CARD-LAST4'].should.be.a.ValidFailObject();
                output.results.fail['GS080-CARD-LAST4'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Array().with.lengthOf(0);

                done();
            }).catch(done);
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('[success] should not show an error if helpers usage is correct', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/v5/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();
                output.results.pass.should.be.an.Array().with.lengthOf(4);

                done();
            }).catch(done);
        });

        it('[failure] should show an error if translate helper is used without a key', function (done) {
            utils.testCheck(thisCheck, '080-helper-usage/v5/invalid-no-empty-translations', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(3);

                output.results.fail.should.be.an.Object().with.keys(
                    'GS080-NO-EMPTY-TRANSLATIONS'
                );

                output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].should.be.a.ValidFailObject();
                output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures.length.should.eql(5);

                output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[0].ref.should.eql('default.hbs');
                output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[1].ref.should.eql('error.hbs');
                output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[2].ref.should.eql('index.hbs');
                output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[3].ref.should.eql('partials/mypartial.hbs');
                output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[4].ref.should.eql('post.hbs');
                done();
            }).catch(done);
        });
    });
});
