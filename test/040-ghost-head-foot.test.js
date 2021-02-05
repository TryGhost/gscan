const should = require('should'); // eslint-disable-line no-unused-vars
const utils = require('./utils');
const thisCheck = require('../lib/checks/040-ghost-head-foot');

describe('040 Ghost head & foot', function () {
    const options = {checkVersion: 'v3'};

    it('should show warnings for missing ghost head & foot helpers when no .hbs files are present', function (done) {
        utils.testCheck(thisCheck, 'is-empty', options).then((output) => {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();

            output.results.fail.should.be.an.Object().with.keys('GS040-GH-REQ', 'GS040-GF-REQ');

            output.results.fail['GS040-GH-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS040-GF-REQ'].should.be.a.ValidFailObject();

            output.results.fail['GS040-GH-REQ'].failures[0].ref.should.eql('default.hbs');
            output.results.fail['GS040-GF-REQ'].failures[0].ref.should.eql('default.hbs');

            done();
        }).catch(done);
    });

    it('should show warnings for missing ghost head & foot helpers when they are not in any .hbs file', function (done) {
        utils.testCheck(thisCheck, '040-head-foot/missing', options).then((output) => {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();

            output.results.fail.should.be.an.Object().with.keys('GS040-GH-REQ', 'GS040-GF-REQ');

            output.results.fail['GS040-GH-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS040-GF-REQ'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });

    it('should output nothing when ghost head & foot helpers are present', function (done) {
        utils.testCheck(thisCheck, '040-head-foot/valid', options).then((output) => {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(2);
            output.results.pass.should.containEql('GS040-GH-REQ', 'GS040-GF-REQ');

            output.results.fail.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });
});
