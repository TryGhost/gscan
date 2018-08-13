const should = require('should'); // eslint-disable-line no-unused-vars
const thisCheck = require('../lib/checks/001-deprecations');
const utils = require('./utils');

describe.only('002 Comment Id', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('should detect an obvious case of {{id}}', function (done) {
            utils.testCheck(thisCheck, '002-comment-id/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object();

                console.log(output.results.fail);

                done();
            }).catch(done);
        });
    });

    describe('latest version:', function () {
        it('should have nothing to do', function (done) {
            utils.testCheck(thisCheck, '002-comment-id/invalid').then(function (output) {
                output.should.be.a.ValidThemeObject();

                console.log(output.results.fail);

                done();
            }).catch(done);
        });
    });
});
