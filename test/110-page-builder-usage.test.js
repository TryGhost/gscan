var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/110-page-builder-usage');

describe('110 Page-builder usage', function () {
    describe('v5', function () {
        const options = {checkVersion: 'v5'};

        it('should fail with missing @page.show_title_and_feature_image', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/missing-page-usage', options);

            Object.keys(output.results.fail).should.eql([
                'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
            ]);

            output.results.fail['GS110-NO-MISSING-PAGE-BUILDER-USAGE'].failures.should.eql([
                {
                    ref: 'page.hbs',
                    message: '@page.show_title_and_feature_image is not used',
                    rule: 'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
                }
            ]);
        });

        it('should pass with @page.show_title_and_feature_image in top-level template', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-template', options);
            output.should.be.a.ValidThemeObject();

            Object.keys(output.results.fail).should.eql([]);
        });

        it('should pass with @page.show_title_and_feature_image in partial', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-partial', options);
            output.should.be.a.ValidThemeObject();

            Object.keys(output.results.fail).should.eql([]);
        });

        it('should fail with unknown @page properties', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/unknown-page-properties', options);

            Object.keys(output.results.fail).should.eql([
                'GS110-NO-UNKNOWN-PAGE-BUILDER-USAGE'
            ]);
        });
    });

    describe('v6', function () {
        const options = {checkVersion: 'v6'};

        it('should fail with missing @page.show_title_and_feature_image', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/missing-page-usage', options);

            Object.keys(output.results.fail).should.eql([
                'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
            ]);

            output.results.fail['GS110-NO-MISSING-PAGE-BUILDER-USAGE'].failures.should.eql([
                {
                    ref: 'page.hbs',
                    message: '@page.show_title_and_feature_image is not used',
                    rule: 'GS110-NO-MISSING-PAGE-BUILDER-USAGE'
                }
            ]);
        });

        it('should pass with @page.show_title_and_feature_image in top-level template', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-template', options);
            output.should.be.a.ValidThemeObject();

            Object.keys(output.results.fail).should.eql([]);
        });

        it('should pass with @page.show_title_and_feature_image in partial', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/valid/usage-in-partial', options);
            output.should.be.a.ValidThemeObject();

            Object.keys(output.results.fail).should.eql([]);
        });

        it('should fail with unknown @page properties', async function () {
            const output = await utils.testCheck(thisCheck, '110-page-builder/invalid/unknown-page-properties', options);

            Object.keys(output.results.fail).should.eql([
                'GS110-NO-UNKNOWN-PAGE-BUILDER-USAGE'
            ]);
        });
    });
});