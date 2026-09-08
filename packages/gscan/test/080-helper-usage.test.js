const utils = require('./utils');
const thisCheck = require('../lib/checks/080-helper-usage');

describe('080 Usage tests', function () {
    it('should not run check for v1', function () {
        const options = {checkVersion: 'v1'};
        return utils.testCheck(thisCheck, '080-helper-usage/v1/invalid', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toEqual([]);
            expect(output.results.fail).toEqual({});

        });
    });

    it('should not run check for v2', function () {
        const options = {checkVersion: 'v2'};
        return utils.testCheck(thisCheck, '080-helper-usage/v2/invalid', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toEqual([]);
            expect(output.results.fail).toEqual({});

        });
    });

    it('should not run check for v3', function () {
        const options = {checkVersion: 'v3'};
        return utils.testCheck(thisCheck, '080-helper-usage/v3/invalid', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toEqual([]);
            expect(output.results.fail).toEqual({});

        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('[success] should show no error if helpers usage is correct', function () {
            return utils.testCheck(thisCheck, '080-helper-usage/v4/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(3);

            });
        });

        it('[failure] should show error if helper usage is incorrect in subfolders', function () {
            return utils.testCheck(thisCheck, '080-helper-usage/v4/invalid-folder', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 
                    'GS080-FEACH-PV'
                );
                expect(output.results.pass).toHaveLength(2);

                utils.assertValidFailObject(output.results.fail['GS080-FEACH-PV']);
                expect(output.results.fail['GS080-FEACH-PV'].failures.length).toEqual(1);

            });
        });

        it('[failure] theme is invalid', function () {
            return utils.testCheck(thisCheck, '080-helper-usage/v4/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 
                    'GS080-FEACH-PV',
                    'GS080-CARD-LAST4',
                    'GS080-FEACH-POSTS'
                );

                utils.assertValidFailObject(output.results.fail['GS080-FEACH-PV']);
                expect(output.results.fail['GS080-FEACH-PV'].failures.length).toEqual(1);

                utils.assertValidFailObject(output.results.fail['GS080-FEACH-POSTS']);
                expect(output.results.fail['GS080-FEACH-POSTS'].failures.length).toEqual(1);

                utils.assertValidFailObject(output.results.fail['GS080-CARD-LAST4']);
                expect(output.results.fail['GS080-CARD-LAST4'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(0);

            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('[success] should not show an error if helpers usage is correct', function () {
            return utils.testCheck(thisCheck, '080-helper-usage/v5/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(4);

            });
        });

        it('[failure] should show an error if translate helper is used without a key', function () {
            return utils.testCheck(thisCheck, '080-helper-usage/v5/invalid-no-empty-translations', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(3);

                utils.assertObjectKeys(output.results.fail, 
                    'GS080-NO-EMPTY-TRANSLATIONS'
                );

                utils.assertValidFailObject(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS']);
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures.length).toEqual(5);

                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[0].ref).toEqual('default.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[1].ref).toEqual('error.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[2].ref).toEqual('index.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[3].ref).toEqual('partials/mypartial.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[4].ref).toEqual('post.hbs');
            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('[success] should not show an error if helpers usage is correct', function () {
            return utils.testCheck(thisCheck, '080-helper-usage/v5/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(4);

            });
        });

        it('[failure] should show an error if translate helper is used without a key', function () {
            return utils.testCheck(thisCheck, '080-helper-usage/v5/invalid-no-empty-translations', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(3);

                utils.assertObjectKeys(output.results.fail, 
                    'GS080-NO-EMPTY-TRANSLATIONS'
                );

                utils.assertValidFailObject(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS']);
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures.length).toEqual(5);

                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[0].ref).toEqual('default.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[1].ref).toEqual('error.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[2].ref).toEqual('index.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[3].ref).toEqual('partials/mypartial.hbs');
                expect(output.results.fail['GS080-NO-EMPTY-TRANSLATIONS'].failures[4].ref).toEqual('post.hbs');
            });
        });
    });
});
