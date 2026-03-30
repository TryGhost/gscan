const utils = require('./utils');
const thisCheck = require('../lib/checks/060-js-api-usage');

describe('060 JS API USAGE', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('[success] should not run check for v1', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);
                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v2:', function () {
        const options = {checkVersion: 'v2'};

        it('[success] should not run check for v2', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);
                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('[failure] should invalidate theme when ghost.url.api is present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(0);

                utils.assertObjectKeys(output.results.fail, 'GS060-JS-GUA');

                utils.assertValidFailObject(output.results.fail['GS060-JS-GUA']);

            });
        });

        it('[success] should pass theme when ghost.url.api is not present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);

                expect(output.results.pass[0]).toEqual('GS060-JS-GUA');

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('[failure] should invalidate theme when ghost.url.api is present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(0);

                utils.assertObjectKeys(output.results.fail, 'GS060-JS-GUA');

                utils.assertValidFailObject(output.results.fail['GS060-JS-GUA']);

            });
        });

        it('[success] should pass theme when ghost.url.api is not present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);

                expect(output.results.pass[0]).toEqual('GS060-JS-GUA');

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('[failure] should invalidate theme when ghost.url.api is present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(0);

                utils.assertObjectKeys(output.results.fail, 'GS060-JS-GUA');

                utils.assertValidFailObject(output.results.fail['GS060-JS-GUA']);

            });
        });

        it('[success] should pass theme when ghost.url.api is not present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);

                expect(output.results.pass[0]).toEqual('GS060-JS-GUA');

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('[failure] should invalidate theme when ghost.url.api is present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(0);

                utils.assertObjectKeys(output.results.fail, 'GS060-JS-GUA');

                utils.assertValidFailObject(output.results.fail['GS060-JS-GUA']);

            });
        });

        it('[success] should pass theme when ghost.url.api is not present in JS files', function () {
            return utils.testCheck(thisCheck, '060-js-api-usage/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);

                expect(output.results.pass[0]).toEqual('GS060-JS-GUA');

                expect(output.results.fail).toEqual({});

            });
        });
    });
});
