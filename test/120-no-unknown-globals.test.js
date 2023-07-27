var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/120-no-unknown-globals');

describe('120 No unknown globals', function () {
    describe('v5', function () {
        const options = {checkVersion: 'v5'};

        it.only('should detect unknown globals', function (done) {
            utils.testCheck(thisCheck, '120-no-unknown-globals/v5/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                // should be a warning about unused globals
                output.results.fail.should.be.an.Object().with.keys('GS120-NO-UNKNOWN-GLOBALS');
                output.results.fail['GS120-NO-UNKNOWN-GLOBALS'].should.be.a.ValidFailObject();
                output.results.fail['GS120-NO-UNKNOWN-GLOBALS'].failures.should.be.an.Array().with.lengthOf(4);

                done();
            }).catch(done);
        });

        it('should pass known globals', function (done) {
            utils.testCheck(thisCheck, '120-no-unknown-globals/v5/valid-with-globals', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS120-NO-UNKNOWN-GLOBALS');

                done();
            }).catch(done);
        });

        it('should pass specific data variables like {{@first}}', function (done) {
            utils.testCheck(thisCheck, '120-no-unknown-globals/v5/valid-with-locals', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS120-NO-UNKNOWN-GLOBALS');

                done();
            }).catch(done);
        });
    });
});
