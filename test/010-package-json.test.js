/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/010-package-json');

describe('010: package.json', function () {
    it('should pass if package.json error detection is disabled', function (done) {
        utils.testCheck(thisCheck, 'is-empty', {detectPackageJSONerrors: false}).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.results.pass.should.eql([]);
            theme.results.fail.should.be.an.Object().which.is.empty();
            done();
        });
    });

    it('should output error for missing package.json', function (done) {
        utils.testCheck(thisCheck, 'is-empty').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(0);

            // package.json not found, can't parse and all fields are missing + invalid
            output.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP'
            );

            output.results.fail['GS010-PJ-REQ'].should.be.a.ValidFailObject();
            done();
        });
    });

    it('should output error for missing package.json', function (done) {
        utils.testCheck(thisCheck, 'is-empty').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(0);

            // package.json not found, can't parse and all fields are missing + invalid
            output.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP'
            );

            output.results.fail['GS010-PJ-REQ'].should.be.a.ValidFailObject();
            done();
        });
    });

    it('should output error for invalid package.json (parsing)', function (done) {
        utils.testCheck(thisCheck, '010-packagejson/parse-error').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(0);

            // can't parse package.json and all fields are missing + invalid
            output.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP'
            );

            output.results.fail['GS010-PJ-PARSE'].should.be.a.ValidFailObject();
            output.results.fail['GS010-PJ-PARSE'].failures.length.should.eql(1);
            output.results.fail['GS010-PJ-PARSE'].failures[0].ref.should.eql('package.json');
            output.results.fail['GS010-PJ-PARSE'].failures[0].message.should.containEql('Unexpected token');

            done();
        });
    });

    it('valid fields', function (done) {
        utils.testCheck(thisCheck, '010-packagejson/fields-are-valid').then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.results.pass.should.eql([
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP',
                'GS010-PJ-CONF-PPP-INT'
            ]);

            theme.results.fail.should.be.an.Object().which.is.empty();
            done();
        });
    });

    it('invalid fields', function (done) {
        utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid').then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.results.pass.should.eql([
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP'
            ]);

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-CONF-PPP-INT'
            );
            done();
        });
    });

    it('missing fields', function (done) {
        utils.testCheck(thisCheck, '010-packagejson/fields-are-missing').then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.results.pass.should.eql([
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE'
            ]);

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-CONF-PPP',
                'GS010-PJ-AUT-EM-VAL'
            );

            done();
        });
    });
});