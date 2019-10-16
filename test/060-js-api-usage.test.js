var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/060-js-api-usage');

describe('060 JS API USAGE', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('[success] should not run check for v1', function (done) {
            utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();
                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v2:', function () {
        const options = {checkVersion: 'v2'};

        it('[success] should not test for v1', function (done) {
            utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();
                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('canary:', function () {
        const options = {checkVersion: 'canary'};

        it('[failure] should invalidate theme when ghost.url.api is present in JS files', function (done) {
            utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(0);

                output.results.fail.should.be.an.Object().with.keys('GS060-JS-GUA');

                output.results.fail['GS060-JS-GUA'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when ghost.url.api is not present in JS files', function (done) {
            utils.testCheck(thisCheck, '060-js-api-usage/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(1);

                output.results.pass[0].should.eql('GS060-JS-GUA');

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });
});
