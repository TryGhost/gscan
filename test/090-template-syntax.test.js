const utils = require('./utils');
const thisCheck = require('../lib/checks/090-template-syntax');

describe('090 Template syntax', function () {
    describe('v4', function () {
        const options = {checkVersion: 'v4'};

        it('should output empty array for a theme with no templates', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(6);

            });
        });

        it('should output empty array for a theme with valid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(6);

            });
        });

        it('should output empty array for a theme with invalid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(6);
            });
        });

        it('should output an error for a theme breaking the rules', function () {
            return utils.testCheck(thisCheck, '090-template-syntax/img-url-in-conditional', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS090-NO-IMG-URL-IN-CONDITIONALS');
                utils.assertValidFailObject(output.results.fail['GS090-NO-IMG-URL-IN-CONDITIONALS']);

                expect(Object.keys(output.results.fail)).toHaveLength(1);
            });
        });

        it('should parse partials', function () {
            return utils.testCheck(thisCheck, '090-template-syntax/theme-with-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS090-NO-IMG-URL-IN-CONDITIONALS');
                utils.assertValidFailObject(output.results.fail['GS090-NO-IMG-URL-IN-CONDITIONALS']);

                expect(Object.keys(output.results.fail)).toHaveLength(1);
            });
        });
    });

    describe('v5', function () {
        const options = {checkVersion: 'v5'};

        it('should fail when {{author}} helper is used in post context', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-author-helper-in-post-context/post-context', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT'
            ]);
            utils.assertValidFailObject(output.results.fail['GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT']);
        });

        it('should NOT fail when {{author}} helper is used OUTSIDE post context', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-author-helper-in-post-context/no-post-context', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should fail when {{products}} helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-helper/with-products-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRODUCTS-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRODUCTS-HELPER']);
        });

        it('should NOT fail when {{products}} helper is NOT used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-helper/no-products-helper', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should fail when {{@product}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-product-data-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRODUCT-DATA-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRODUCT-DATA-HELPER']);
        });

        it('should fail when {{@products}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-data-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRODUCTS-DATA-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRODUCTS-DATA-HELPER']);
        });

        it('should fail when {{@member.products}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-member-products-data-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-MEMBER-PRODUCTS-DATA-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-MEMBER-PRODUCTS-DATA-HELPER']);
        });

        it('should fail when {{price currency=@price.currency}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL']);
        });

        it('should fail when {{@price.currency}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/global', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL']);
        });

        it('should fail when {{@price.currency}} is used inside {{#foreach @member.subscriptions}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/member-subscriptions', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT']);
        });

        it('should fail when {{price @price.currency}} is used inside {{#foreach @member.subscriptions}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/member-subscriptions-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT']);
        });

        it('should fail when {{price @price.currency}} is used inside {{#foreach tiers}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/tiers-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT']);
        });

        it('should fail when {{@price.monthly}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-monthly-yearly/global', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-MONTHLY-YEARLY'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-MONTHLY-YEARLY']);
        });

        it('should fail when {{price @price.monthly}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-monthly-yearly/price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-MONTHLY-YEARLY'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-MONTHLY-YEARLY']);
        });

        it('should fail when {{monthly_price.*}} is used in tiers', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-monthly-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-TIER-PRICE-AS-OBJECT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-TIER-PRICE-AS-OBJECT']);
        });

        it('should fail when {{yearly_price.*}} is used in tiers', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-yearly-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-TIER-PRICE-AS-OBJECT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-TIER-PRICE-AS-OBJECT']);
        });

        it('should fail when {{name}} is used in tier benefits', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-tier-benefit-as-object', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-TIER-BENEFIT-AS-OBJECT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-TIER-BENEFIT-AS-OBJECT']);
        });

        it('should fail when {{@price.currency}} is used in partial loaded from folder', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/partial', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL']);
        });
    });

    describe('v6', function () {
        const options = {checkVersion: 'v6'};

        it('should fail when {{author}} helper is used in post context', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-author-helper-in-post-context/post-context', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT'
            ]);
            utils.assertValidFailObject(output.results.fail['GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT']);
        });

        it('should NOT fail when {{author}} helper is used OUTSIDE post context', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-author-helper-in-post-context/no-post-context', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should fail when {{products}} helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-helper/with-products-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRODUCTS-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRODUCTS-HELPER']);
        });

        it('should NOT fail when {{products}} helper is NOT used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-helper/no-products-helper', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should fail when {{@product}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-product-data-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRODUCT-DATA-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRODUCT-DATA-HELPER']);
        });

        it('should fail when {{@products}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-data-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRODUCTS-DATA-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRODUCTS-DATA-HELPER']);
        });

        it('should fail when {{@member.products}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-member-products-data-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-MEMBER-PRODUCTS-DATA-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-MEMBER-PRODUCTS-DATA-HELPER']);
        });

        it('should fail when {{price currency=@price.currency}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL']);
        });

        it('should fail when {{@price.currency}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/global', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL']);
        });

        it('should fail when {{@price.currency}} is used inside {{#foreach @member.subscriptions}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/member-subscriptions', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT']);
        });

        it('should fail when {{price @price.currency}} is used inside {{#foreach @member.subscriptions}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/member-subscriptions-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT']);
        });

        it('should fail when {{price @price.currency}} is used inside {{#foreach tiers}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/tiers-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT']);
        });

        it('should fail when {{@price.monthly}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-monthly-yearly/global', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-MONTHLY-YEARLY'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-MONTHLY-YEARLY']);
        });

        it('should fail when {{price @price.monthly}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-monthly-yearly/price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-MONTHLY-YEARLY'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-MONTHLY-YEARLY']);
        });

        it('should fail when {{monthly_price.*}} is used in tiers', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-monthly-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-TIER-PRICE-AS-OBJECT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-TIER-PRICE-AS-OBJECT']);
        });

        it('should fail when {{yearly_price.*}} is used in tiers', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-yearly-price-helper', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-TIER-PRICE-AS-OBJECT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-TIER-PRICE-AS-OBJECT']);
        });

        it('should fail when {{name}} is used in tier benefits', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-tier-benefit-as-object', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-TIER-BENEFIT-AS-OBJECT'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-TIER-BENEFIT-AS-OBJECT']);
        });

        it('should fail when {{@price.currency}} is used in partial loaded from folder', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/partial', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL']);
        });

        it('should fail when limit="all" is used in {{#get}} helper', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-limit-all-in-get-helper/with-limit-all', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-LIMIT-ALL-IN-GET-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-LIMIT-ALL-IN-GET-HELPER']);
        });

        it('should NOT fail when limit="all" is NOT used in {{#get}} helper', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-limit-all-in-get-helper/without-limit-all', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });

        it('should fail when limit values greater than 100 are used in {{#get}} helper', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-limit-over-100-in-get-helper/with-limit-over-100', options);
            expect(Object.keys(output.results.fail)).toEqual([
                'GS090-NO-LIMIT-OVER-100-IN-GET-HELPER'
            ]);

            utils.assertValidFailObject(output.results.fail['GS090-NO-LIMIT-OVER-100-IN-GET-HELPER']);
        });

        it('should NOT fail when limit values 100 or lower are used in {{#get}} helper', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-limit-over-100-in-get-helper/without-limit-over-100', options);
            utils.assertValidThemeObject(output);

            expect(Object.keys(output.results.fail)).toEqual([]);
        });
    });
});
