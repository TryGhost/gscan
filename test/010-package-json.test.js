var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/010-package-json');

const fs = require('fs').promises;
const path = require('path');

describe('010 package.json', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('should output error for missing package.json', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
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
                output.results.fail['GS010-PJ-REQ'].failures[0].ref.should.eql('package.json');
                done();
            }).catch(done);
        });

        it('should output error for invalid package.json (parsing)', async function () {
            const output = await utils.testCheck(thisCheck, '010-packagejson/parse-error', options);
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

            // to check the message, we should compare it against the actual error from JSON.parse
            // we can't just use a hardcoded string because it differs between versions (Node 18 + 20)

            const packageJsonContents = await fs.readFile(path.join(__dirname, './fixtures/themes/010-packagejson/parse-error/package.json'), 'utf8');

            let expectedErrMessage;
            try {
                JSON.parse(packageJsonContents);
            } catch (err) {
                expectedErrMessage = err.message;
            }

            if (!expectedErrMessage) {
                // This should never happen - because the package.json is invalid
                throw new Error('This should never happen');
            }

            output.results.fail['GS010-PJ-PARSE'].failures[0].message.should.eql(expectedErrMessage);
        });

        it('valid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
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
            }).catch(done);
        });

        it('invalid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
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

                theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref.should.eql('package.json');

                done();
            }).catch(done);
        });

        it('missing fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP'
                );

                done();
            }).catch(done);
        });

        it('bad config (ppp: -3 > 0)', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/bad-config', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-CONF-PPP-INT'
                );
                done();
            }).catch(done);
        });

        it('bad config 2 (ppp: 0 > 0)', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/bad-config-2', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-CONF-PPP-INT'
                );
                done();
            }).catch(done);
        });
    });

    describe('v2:', function () {
        const options = {checkVersion: 'v2'};

        it('valid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS'
                ]);

                theme.results.fail.should.be.an.Object().which.is.empty();
                done();
            }).catch(done);
        });

        it('invalid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS'
                );

                theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref.should.eql('package.json');

                done();
            }).catch(done);
        });

        it('missing fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS'
                );

                done();
            }).catch(done);
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('valid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-valid-v3', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API',
                    'GS010-PJ-GHOST-API-V01'
                ]);

                theme.results.fail.should.be.an.Object().which.is.empty();
                done();
            }).catch(done);
        });

        it('invalid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-GHOST-API'
                ]);

                Object.keys(theme.results.fail).should.eql([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-V01'
                ]);

                theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref.should.eql('package.json');

                done();
            }).catch(done);
        });

        it('missing fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-GHOST-API-V01'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS'
                );

                done();
            }).catch(done);
        });

        it('deprecated ghost-api v0.1', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/deprecated-engines-ghost-api-v01', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-GHOST-API-V01'
                );

                done();
            }).catch(done);
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('valid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-V01',
                    'GS010-PJ-GHOST-API-V2',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT'
                ]);

                theme.results.fail.should.be.an.Object().which.is.empty();
                done();
            }).catch(done);
        });

        it('invalid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-GHOST-API-V2',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT'
                ]);

                Object.keys(theme.results.fail).should.eql([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-GHOST-API-V01'
                ]);

                theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref.should.eql('package.json');

                done();
            }).catch(done);
        });

        it('missing fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-GHOST-API-V01',
                    'GS010-PJ-GHOST-API-V2',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS'
                );

                done();
            }).catch(done);
        });

        it('deprecated ghost-api v0.1', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/deprecated-engines-ghost-api-v01', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-V2',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-GHOST-API-V01'
                );

                done();
            }).catch(done);
        });

        it('deprecated ghost-api v2', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/deprecated-engines-ghost-api-v2', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-V01',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-GHOST-API-V2'
                );

                done();
            }).catch(done);
        });

        it('deprecated ghost-api use', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/ghost-api-use', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-GHOST-API-PRESENT'
                );

                done();
            }).catch(done);
        });

        it('correctly flags invalid custom themes', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/invalid-custom-theme', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-V01',
                    'GS010-PJ-GHOST-API-V2'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT'
                );

                done();
            }).catch(done);
        });

        it('correctly validates custom themes', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/valid-custom-theme', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-V01',
                    'GS010-PJ-GHOST-API-V2',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT'
                ]);

                theme.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('valid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                theme.results.fail.should.be.an.Object().which.is.empty();
                done();
            }).catch(done);
        });

        it('invalid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                Object.keys(theme.results.fail).should.eql([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-PRESENT'
                ]);

                theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref.should.eql('package.json');

                done();
            }).catch(done);
        });

        it('missing fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT'
                );

                done();
            }).catch(done);
        });

        it('deprecated ghost-api use', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/ghost-api-use', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-GHOST-API-PRESENT'
                );

                done();
            }).catch(done);
        });

        it('correctly flags invalid custom themes', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/invalid-custom-theme', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                );

                done();
            }).catch(done);
        });

        it('correctly validates custom themes', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/valid-custom-theme', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                done();
            }).catch(done);
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('valid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                theme.results.fail.should.be.an.Object().which.is.empty();
                done();
            }).catch(done);
        });

        it('invalid fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                Object.keys(theme.results.fail).should.eql([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-PRESENT'
                ]);

                theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref.should.eql('package.json');

                done();
            }).catch(done);
        });

        it('missing fields', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.pass.should.eql([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT'
                );

                done();
            }).catch(done);
        });

        it('deprecated ghost-api use', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/ghost-api-use', options).then(function (theme) {
                theme.should.be.a.ValidThemeObject();

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-GHOST-API-PRESENT'
                );

                done();
            }).catch(done);
        });

        it('correctly flags invalid custom themes', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/invalid-custom-theme', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS'
                ]);

                theme.results.fail.should.be.an.Object().with.keys(
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                );

                done();
            }).catch(done);
        });

        it('correctly validates custom themes', function (done) {
            utils.testCheck(thisCheck, '010-packagejson/valid-custom-theme', options).then(function (theme) {
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
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX',
                    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE'
                ]);

                done();
            }).catch(done);
        });
    });
});
