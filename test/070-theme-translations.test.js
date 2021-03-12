const should = require('should'); // eslint-disable-line no-unused-vars
const utils = require('./utils');
const thisCheck = require('../lib/checks/070-theme-translations');

const checker = require('../lib/checker');
const format = require('../lib/format');

describe('070 Theme Translations', function () {
    it('should not run check for v1', function (done) {
        const options = {checkVersion: 'v1'};
        utils.testCheck(thisCheck, '070-theme-translations/invalid', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();
            output.results.fail.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });

    it('should not run check for v2', function (done) {
        const options = {checkVersion: 'v2'};
        utils.testCheck(thisCheck, '070-theme-translations/invalid', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().which.is.empty();
            output.results.fail.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });

    it('should fail when a theme has invalid locales', function (done) {
        const options = {checkVersion: 'canary'};
        checker(utils.themePath('070-theme-translations/invalid'), options).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.results.pass.should.be.an.Array().not.with.keys('GS070-VALID-TRANSLATIONS');
            theme.results.fail.should.be.an.Object().with.keys('GS070-VALID-TRANSLATIONS');

            theme.results.fail['GS070-VALID-TRANSLATIONS'].should.be.a.ValidFailObject();
            theme.results.fail['GS070-VALID-TRANSLATIONS'].failures.should.be.an.Array().with.lengthOf(2);

            theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[0].should.have.keys('ref', 'message');
            theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[0].ref.should.eql('locales/en.json');

            theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[1].should.have.keys('ref', 'message');
            theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[1].ref.should.eql('locales/es.json');

            theme = format(theme, options);

            const error = theme.results.error.find(error => error.code === 'GS070-VALID-TRANSLATIONS');

            error.should.be.an.Object();
            error.fatal.should.be.true;

            done();
        }).catch(done);
    });

    it('should pass when a theme has valid locales', function (done) {
        const options = {};
        utils.testCheck(thisCheck, '070-theme-translations/valid', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS070-VALID-TRANSLATIONS');

            done();
        }).catch(done);
    });
});
