var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/090-template-syntax');

describe('090 Template syntax', function () {
    describe('v4', function () {
        const options = {checkVersion: 'v4'};

        it('should output empty array for a theme with no templates', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(6);

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with valid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v4/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(6);

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with invalid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v4/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(6);
                done();
            }).catch(done);
        });

        it('should output an error for a theme breaking the rules', function (done) {
            utils.testCheck(thisCheck, '090-template-syntax/img-url-in-conditional', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys('GS090-NO-IMG-URL-IN-CONDITIONALS');
                output.results.fail['GS090-NO-IMG-URL-IN-CONDITIONALS'].should.be.a.ValidFailObject();

                Object.keys(output.results.fail).should.be.an.Array().with.lengthOf(1);
                done();
            }).catch(done);
        });

        it('should parse partials', function (done) {
            utils.testCheck(thisCheck, '090-template-syntax/theme-with-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys('GS090-NO-IMG-URL-IN-CONDITIONALS');
                output.results.fail['GS090-NO-IMG-URL-IN-CONDITIONALS'].should.be.a.ValidFailObject();

                Object.keys(output.results.fail).should.be.an.Array().with.lengthOf(1);
                done();
            }).catch(done);
        });
    });

    describe('v5', function () {
        const options = {checkVersion: 'v5'};

        it('should fail when {{author}} helper is used in post context', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-author-helper-in-post-context/post-context', options);
            output.should.be.a.ValidThemeObject();

            Object.keys(output.results.fail).should.eql([
                'GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT'
            ]);
            output.results.fail['GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT'].should.be.a.ValidFailObject();
        });

        it('should NOT fail when {{author}} helper is used OUTSIDE post context', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-author-helper-in-post-context/no-post-context', options);
            output.should.be.a.ValidThemeObject();

            Object.keys(output.results.fail).should.eql([]);
        });

        it('should fail when {{products}} helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-helper/with-products-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRODUCTS-HELPER'
            ]);

            output.results.fail['GS090-NO-PRODUCTS-HELPER'].should.be.a.ValidFailObject();
        });

        it('should NOT fail when {{products}} helper is NOT used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-helper/no-products-helper', options);
            output.should.be.a.ValidThemeObject();

            Object.keys(output.results.fail).should.eql([]);
        });

        it('should fail when {{@product}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-product-data-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRODUCT-DATA-HELPER'
            ]);

            output.results.fail['GS090-NO-PRODUCT-DATA-HELPER'].should.be.a.ValidFailObject();
        });

        it('should fail when {{@products}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-products-data-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRODUCTS-DATA-HELPER'
            ]);

            output.results.fail['GS090-NO-PRODUCTS-DATA-HELPER'].should.be.a.ValidFailObject();
        });

        it('should fail when {{@member.products}} data helper is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-member-products-data-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-MEMBER-PRODUCTS-DATA-HELPER'
            ]);

            output.results.fail['GS090-NO-MEMBER-PRODUCTS-DATA-HELPER'].should.be.a.ValidFailObject();
        });

        it('should fail when {{price currency=@price.currency}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/price-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'].should.be.a.ValidFailObject();
        });

        it('should fail when {{@price.currency}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-global/global', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'
            ]);

            output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-GLOBAL'].should.be.a.ValidFailObject();
        });

        it('should fail when {{@price.currency}} is used inside {{#foreach @member.subscriptions}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/member-subscriptions', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'].should.be.a.ValidFailObject();
        });

        it('should fail when {{price @price.currency}} is used inside {{#foreach @member.subscriptions}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/member-subscriptions-price-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'].should.be.a.ValidFailObject();
        });

        it('should fail when {{price @price.currency}} is used inside {{#foreach tiers}}', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-currency-context/tiers-price-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'
            ]);

            output.results.fail['GS090-NO-PRICE-DATA-CURRENCY-CONTEXT'].should.be.a.ValidFailObject();
        });

        it('should fail when {{@price.monthly}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-monthly-yearly/global', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRICE-DATA-MONTHLY-YEARLY'
            ]);

            output.results.fail['GS090-NO-PRICE-DATA-MONTHLY-YEARLY'].should.be.a.ValidFailObject();
        });

        it('should fail when {{price @price.monthly}} is used', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-price-data-monthly-yearly/price-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-PRICE-DATA-MONTHLY-YEARLY'
            ]);

            output.results.fail['GS090-NO-PRICE-DATA-MONTHLY-YEARLY'].should.be.a.ValidFailObject();
        });

        it('should fail when {{monthly_price.*}} is used in tiers', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-monthly-price-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-TIER-PRICE-AS-OBJECT'
            ]);

            output.results.fail['GS090-NO-TIER-PRICE-AS-OBJECT'].should.be.a.ValidFailObject();
        });

        it('should fail when {{yearly_price.*}} is used in tiers', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-yearly-price-helper', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-TIER-PRICE-AS-OBJECT'
            ]);

            output.results.fail['GS090-NO-TIER-PRICE-AS-OBJECT'].should.be.a.ValidFailObject();
        });

        it('should fail when {{name}} is used in tier benefits', async function () {
            const output = await utils.testCheck(thisCheck, '090-template-syntax/no-tier-benefit-as-object', options);
            Object.keys(output.results.fail).should.eql([
                'GS090-NO-TIER-BENEFIT-AS-OBJECT'
            ]);

            output.results.fail['GS090-NO-TIER-BENEFIT-AS-OBJECT'].should.be.a.ValidFailObject();
        });
    });
});
