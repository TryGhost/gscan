var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/040-ghost-head-foot');

describe('Ghost head & foot', function () {
    it('should show warnings for missing ghost head & foot helpers when no .hbs files are present', function (done) {
        utils.testCheck(thisCheck, 'is-empty').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();

            output.results.fail.should.be.an.Object().with.keys('GS040-GH-REQ', 'GS040-GF-REQ');

            output.results.fail['GS040-GH-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS040-GF-REQ'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });

    it('should show warnings for missing ghost head & foot helpers when they are not in any .hbs file', function (done) {
        utils.testCheck(thisCheck, '040-head-foot/missing').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();

            output.results.fail.should.be.an.Object().with.keys('GS040-GH-REQ', 'GS040-GF-REQ');

            output.results.fail['GS040-GH-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS040-GF-REQ'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });

    it('should output nothing when ghost head & foot helpers are present', function (done) {
        utils.testCheck(thisCheck, '040-head-foot/valid').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(2);
            output.results.pass.should.containEql('GS040-GH-REQ', 'GS040-GF-REQ');

            output.results.fail.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });
});
