const should = require('should'); // eslint-disable-line no-unused-vars
const utils = require('./utils');
const thisCheck = require('../lib/checks/051-custom-fonts-css-properties');

describe('051 custom fonts CSS properties', function () {
    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('should show warnings for missing custom heading and body font CSS properties when they are not in any .hbs or .css file', function (done) {
            utils.testCheck(thisCheck, '051-custom-fonts-css-properties/missing', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS051-CUSTOM-FONTS');

                output.results.fail['GS051-CUSTOM-FONTS'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('should output nothing when custom heading and body font CSS properties are present', function (done) {
            utils.testCheck(thisCheck, '051-custom-fonts-css-properties/valid', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS051-CUSTOM-FONTS');

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('should show warnings for missing custom heading and body font CSS properties when they are not in any .hbs or .css file', function (done) {
            utils.testCheck(thisCheck, '051-custom-fonts-css-properties/missing', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS051-CUSTOM-FONTS');

                output.results.fail['GS051-CUSTOM-FONTS'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('should output nothing when custom heading and body font CSS properties are present', function (done) {
            utils.testCheck(thisCheck, '051-custom-fonts-css-properties/valid', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS051-CUSTOM-FONTS');

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });
});
