const utils = require('./utils');
const thisCheck = require('../lib/checks/110-page-builder-usage');

describe('110 Page-builder usage', function () {
    describe('v5', function () {
        const options = {checkVersion: 'v5'};

        it('should fail with missing @page.show_title_and_feature_image', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/missing-page-usage', options);

            expect(Object.keys(output.results.fail)).toEqual([
                'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
            ]);

            expect(output.results.fail['GS110-NO-MISSING-PAGE-BUILDER-USAGE'].failures).toEqual([
                {
                    ref: 'page.hbs',
                    message: '@page.show_title_and_feature_image is not used',
                    rule: 'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
                }
            ]);
        });

        it('should pass with @page.show_title_and_feature_image in top-level template', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-template', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should pass with @page.show_title_and_feature_image in partial', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-partial', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should fail with unknown @page properties', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/unknown-page-properties', options);

            expect(Object.keys(output.results.fail)).toEqual([
                'GS110-NO-UNKNOWN-PAGE-BUILDER-USAGE'
            ]);
        });
    });

    describe('v6', function () {
        const options = {checkVersion: 'v6'};

        it('should fail with missing @page.show_title_and_feature_image', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/missing-page-usage', options);

            expect(Object.keys(output.results.fail)).toEqual([
                'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
            ]);

            expect(output.results.fail['GS110-NO-MISSING-PAGE-BUILDER-USAGE'].failures).toEqual([
                {
                    ref: 'page.hbs',
                    message: '@page.show_title_and_feature_image is not used',
                    rule: 'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
                }
            ]);
        });

        it('should pass with @page.show_title_and_feature_image in top-level template', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-template', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should pass with @page.show_title_and_feature_image in partial', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-partial', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should fail with unknown @page properties', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/unknown-page-properties', options);

            expect(Object.keys(output.results.fail)).toEqual([
                'GS110-NO-UNKNOWN-PAGE-BUILDER-USAGE'
            ]);
        });
    });
});