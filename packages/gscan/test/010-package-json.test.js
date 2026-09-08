const utils = require('./utils');
const thisCheck = require('../lib/checks/010-package-json');

const fs = require('fs').promises;
const path = require('path');

describe('010 package.json', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('should output error for missing package.json', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(0);

                // package.json not found, can't parse and all fields are missing + invalid
                utils.assertObjectKeys(output.results.fail,
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

                utils.assertValidFailObject(output.results.fail['GS010-PJ-REQ']);
                expect(output.results.fail['GS010-PJ-REQ'].failures[0].ref).toEqual('package.json');
            });
        });

        it('should output error for invalid package.json (parsing)', async function () {
            const output = await utils.testCheck(thisCheck, '010-packagejson/parse-error', options);
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toHaveLength(0);

            // can't parse package.json and all fields are missing + invalid
            utils.assertObjectKeys(output.results.fail,
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

            utils.assertValidFailObject(output.results.fail['GS010-PJ-PARSE']);
            expect(output.results.fail['GS010-PJ-PARSE'].failures.length).toEqual(1);
            expect(output.results.fail['GS010-PJ-PARSE'].failures[0].ref).toEqual('package.json');

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

            expect(output.results.fail['GS010-PJ-PARSE'].failures[0].message).toEqual(expectedErrMessage);
        });

        it('valid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(theme.results.fail).toEqual({});
            });
        });

        it('invalid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CONF-PPP'
                ]);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-CONF-PPP-INT'
                );

                expect(theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref).toEqual('package.json');

            });
        });

        it('missing fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE'
                ]);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP'
                );

            });
        });

        it('bad config (ppp: -3 > 0)', function () {
            return utils.testCheck(thisCheck, '010-packagejson/bad-config', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-CONF-PPP-INT'
                );
            });
        });

        it('bad config 2 (ppp: 0 > 0)', function () {
            return utils.testCheck(thisCheck, '010-packagejson/bad-config-2', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-CONF-PPP-INT'
                );
            });
        });
    });

    describe('v2:', function () {
        const options = {checkVersion: 'v2'};

        it('valid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(theme.results.fail).toEqual({});
            });
        });

        it('invalid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CONF-PPP'
                ]);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS'
                );

                expect(theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref).toEqual('package.json');

            });
        });

        it('missing fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE'
                ]);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS'
                );

            });
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('valid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-valid-v3', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(theme.results.fail).toEqual({});
            });
        });

        it('invalid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-GHOST-API'
                ]);

                expect(Object.keys(theme.results.fail)).toEqual([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-V01'
                ]);

                expect(theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref).toEqual('package.json');

            });
        });

        it('missing fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-GHOST-API-V01'
                ]);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS'
                );

            });
        });

        it('deprecated ghost-api v0.1', function () {
            return utils.testCheck(thisCheck, '010-packagejson/deprecated-engines-ghost-api-v01', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-GHOST-API-V01'
                );

            });
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('valid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(theme.results.fail).toEqual({});
            });
        });

        it('invalid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(Object.keys(theme.results.fail)).toEqual([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-PRESENT',
                    'GS010-PJ-GHOST-API-V01'
                ]);

                expect(theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref).toEqual('package.json');

            });
        });

        it('missing fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS'
                );

            });
        });

        it('deprecated ghost-api v0.1', function () {
            return utils.testCheck(thisCheck, '010-packagejson/deprecated-engines-ghost-api-v01', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-GHOST-API-V01'
                );

            });
        });

        it('deprecated ghost-api v2', function () {
            return utils.testCheck(thisCheck, '010-packagejson/deprecated-engines-ghost-api-v2', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-GHOST-API-V2'
                );

            });
        });

        it('deprecated ghost-api use', function () {
            return utils.testCheck(thisCheck, '010-packagejson/ghost-api-use', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-GHOST-API-PRESENT'
                );

            });
        });

        it('correctly flags invalid custom themes', function () {
            return utils.testCheck(thisCheck, '010-packagejson/invalid-custom-theme', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-GROUP',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT'
                );

            });
        });

        it('correctly validates custom themes', function () {
            return utils.testCheck(thisCheck, '010-packagejson/valid-custom-theme', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(theme.results.fail).toEqual({});

            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('valid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(theme.results.fail).toEqual({});
            });
        });

        it('invalid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(Object.keys(theme.results.fail)).toEqual([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-PRESENT'
                ]);

                expect(theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref).toEqual('package.json');

            });
        });

        it('missing fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT'
                );

            });
        });

        it('deprecated ghost-api use', function () {
            return utils.testCheck(thisCheck, '010-packagejson/ghost-api-use', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-GHOST-API-PRESENT'
                );

            });
        });

        it('correctly flags invalid custom themes', function () {
            return utils.testCheck(thisCheck, '010-packagejson/invalid-custom-theme', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
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

            });
        });

        it('correctly validates custom themes', function () {
            return utils.testCheck(thisCheck, '010-packagejson/valid-custom-theme', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('valid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-valid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(theme.results.fail).toEqual({});
            });
        });

        it('invalid fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-invalid', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                expect(Object.keys(theme.results.fail)).toEqual([
                    'GS010-PJ-CONF-PPP-INT',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-GHOST-API-PRESENT'
                ]);

                expect(theme.results.fail['GS010-PJ-NAME-LC'].failures[0].ref).toEqual('package.json');

            });
        });

        it('missing fields', function () {
            return utils.testCheck(thisCheck, '010-packagejson/fields-are-missing', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-CONF-PPP',
                    'GS010-PJ-KEYWORDS',
                    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT'
                );

            });
        });

        it('deprecated ghost-api use', function () {
            return utils.testCheck(thisCheck, '010-packagejson/ghost-api-use', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                utils.assertObjectKeys(theme.results.fail,
                    'GS010-PJ-GHOST-API-PRESENT'
                );

            });
        });

        it('correctly flags invalid custom themes', function () {
            return utils.testCheck(thisCheck, '010-packagejson/invalid-custom-theme', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

                utils.assertObjectKeys(theme.results.fail,
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

            });
        });

        it('correctly validates custom themes', function () {
            return utils.testCheck(thisCheck, '010-packagejson/valid-custom-theme', options).then(function (theme) {
                utils.assertValidThemeObject(theme);

                expect(theme.results.pass).toEqual([
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

            });
        });
    });
});
