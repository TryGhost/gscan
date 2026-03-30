const utils = require('./utils');
const thisCheck = require('../lib/checks/050-koenig-css-classes');

describe('050 Koenig CSS classes', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('[success] should not test for v1', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);
                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v2:', function () {
        const options = {checkVersion: 'v2'};

        it('[failure] should invalidate theme when .css file is missing', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGR']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

                expect(output.results.fail['GS050-CSS-KGWF'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGWW'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGC'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGR'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGI'].failures.length).toEqual(1);

                expect(output.results.fail['GS050-CSS-KGWF'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGWW'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGC'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGR'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGI'].failures[0].ref).toEqual('styles');

            });
        });

        it('[failure] should invalidate theme when CSS classes are missing', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGR']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

            });
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

            });
        });

        it('[success] should pass theme when CSS classes are present', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(15);

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('[failure] should invalidate theme when .css file is missing', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGR']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

                expect(output.results.fail['GS050-CSS-KGWF'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGWW'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGC'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGR'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGI'].failures.length).toEqual(1);

                expect(output.results.fail['GS050-CSS-KGWF'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGWW'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGC'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGR'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGI'].failures[0].ref).toEqual('styles');

            });
        });

        it('[failure] should invalidate theme when CSS classes are missing', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGR']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

            });
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

            });
        });

        it('[success] should pass theme when CSS classes are present', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(15);

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('[failure] should invalidate theme when .css file is missing', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGR']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

                expect(output.results.fail['GS050-CSS-KGWF'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGWW'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGC'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGR'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGGI'].failures.length).toEqual(1);

                expect(output.results.fail['GS050-CSS-KGWF'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGWW'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGC'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGR'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGGI'].failures[0].ref).toEqual('styles');

            });
        });

        it('[failure] should invalidate theme when CSS classes are missing', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGR']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

            });
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGI');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGC']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGGI']);

            });
        });

        it('[success] should pass theme when CSS classes are present', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(15);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset is true', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses include', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-include', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(93);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses exclude', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(5);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when card-asset excludes callout and uses Ghost v6 callout class names', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude-callout', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(14);

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('[failure] should invalidate theme when .css file is missing', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);

                expect(output.results.fail['GS050-CSS-KGWF'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGWW'].failures.length).toEqual(1);

                expect(output.results.fail['GS050-CSS-KGWF'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGWW'].failures[0].ref).toEqual('styles');

            });
        });

        it('[failure] should invalidate theme when CSS classes are missing', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);

            });
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWF');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);

            });
        });

        it('[success] should pass theme when CSS classes are present', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset is true', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses include', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-include', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(93);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses exclude', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(5);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when card-asset excludes callout and uses Ghost v6 callout class names', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude-callout', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(14);

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('[failure] should invalidate theme when .css file is missing', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);

                expect(output.results.fail['GS050-CSS-KGWF'].failures.length).toEqual(1);
                expect(output.results.fail['GS050-CSS-KGWW'].failures.length).toEqual(1);

                expect(output.results.fail['GS050-CSS-KGWF'].failures[0].ref).toEqual('styles');
                expect(output.results.fail['GS050-CSS-KGWW'].failures[0].ref).toEqual('styles');

            });
        });

        it('[failure] should invalidate theme when CSS classes are missing', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWW']);
                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);

            });
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);

                utils.assertObjectKeys(output.results.fail, 'GS050-CSS-KGWF');

                utils.assertValidFailObject(output.results.fail['GS050-CSS-KGWF']);

            });
        });

        it('[success] should pass theme when CSS classes are present', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset is true', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(2);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses include', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-include', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(93);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses exclude', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(5);

                expect(output.results.fail).toEqual({});

            });
        });

        it('[success] should pass theme when card-asset excludes callout and uses Ghost v6 callout class names', function () {
            return utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude-callout', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(14);

                expect(output.results.fail).toEqual({});

            });
        });
    });
});
