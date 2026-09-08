const thisCheck = require('../lib/checks/001-deprecations');
const utils = require('./utils');

describe('001 Deprecations', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('[failure] theme is invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v1/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-PPP',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-EACH'
                );

                // pageUrl
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PURL']);
                expect(output.results.fail['GS001-DEPR-PURL'].failures.length).toEqual(3);

                // meta_description in <head>
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-MD']);
                expect(output.results.fail['GS001-DEPR-MD'].failures.length).toEqual(1);

                // {{image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IMG']);
                expect(output.results.fail['GS001-DEPR-IMG'].failures.length).toEqual(2);

                // {{cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-COV']);
                expect(output.results.fail['GS001-DEPR-COV'].failures.length).toEqual(3);

                // {{author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG']);
                expect(output.results.fail['GS001-DEPR-AIMG'].failures.length).toEqual(2);

                // {{post.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PIMG']);
                expect(output.results.fail['GS001-DEPR-PIMG'].failures.length).toEqual(1);

                // {{@blog.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BC']);
                expect(output.results.fail['GS001-DEPR-BC'].failures.length).toEqual(1);

                // {{author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AC']);
                expect(output.results.fail['GS001-DEPR-AC'].failures.length).toEqual(2);

                // {{post.author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAC']);
                expect(output.results.fail['GS001-DEPR-PAC'].failures.length).toEqual(1);

                // {{post.author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAIMG']);
                expect(output.results.fail['GS001-DEPR-PAIMG'].failures.length).toEqual(1);

                // {{tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TIMG']);
                expect(output.results.fail['GS001-DEPR-TIMG'].failures.length).toEqual(1);

                // {{posts.tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PTIMG']);
                expect(output.results.fail['GS001-DEPR-PTIMG'].failures.length).toEqual(1);

                // {{tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TSIMG']);
                expect(output.results.fail['GS001-DEPR-TSIMG'].failures.length).toEqual(1);

                // {{#if image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-IMG']);
                expect(output.results.fail['GS001-DEPR-CON-IMG'].failures.length).toEqual(1);

                // {{#if cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-COV']);
                expect(output.results.fail['GS001-DEPR-CON-COV'].failures.length).toEqual(1);

                // {{#if tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TIMG'].failures.length).toEqual(1);

                // {{#if tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TSIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length).toEqual(1);

                // {{#if post.tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PTIMG']);
                expect(output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length).toEqual(1);

                // {{@blog.posts_per_page}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PPP']);
                expect(output.results.fail['GS001-DEPR-PPP'].failures.length).toEqual(1);

                // {{content word="0"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-C0H']);
                expect(output.results.fail['GS001-DEPR-C0H'].failures.length).toEqual(2);

                // css class .page-template-{slug}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-PATS']);
                expect(output.results.fail['GS001-DEPR-CSS-PATS'].failures.length).toEqual(2);

                // css class .achive-template
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-AT']);
                expect(output.results.fail['GS001-DEPR-CSS-AT'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                expect(output.results.pass).toEqual([]);

            });
        });

        it('[success] should show no error if no deprecated helpers used', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v1/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(28);

            });
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v1/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-C0H'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PURL']);
                expect(output.results.fail['GS001-DEPR-PURL'].failures.length).toEqual(2);
                expect(output.results.pass).toHaveLength(20);

            });
        });
    });

    describe('v2:', function () {
        const options = {checkVersion: 'v2'};

        it('[failure] theme is completely invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v2/invalid_all', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-PPP',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SGH',
                    'GS001-DEPR-SGF',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-PAID',
                    'GS001-DEPR-USER-GET',
                    'GS001-DEPR-EACH'
                );

                // pageUrl
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PURL']);
                expect(output.results.fail['GS001-DEPR-PURL'].failures.length).toEqual(3);

                // meta_description in <head>
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-MD']);
                expect(output.results.fail['GS001-DEPR-MD'].failures.length).toEqual(1);

                // {{image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IMG']);
                expect(output.results.fail['GS001-DEPR-IMG'].failures.length).toEqual(2);

                // {{cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-COV']);
                expect(output.results.fail['GS001-DEPR-COV'].failures.length).toEqual(3);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG']);
                expect(output.results.fail['GS001-DEPR-AIMG'].failures.length).toEqual(2);

                // {{post.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PIMG']);
                expect(output.results.fail['GS001-DEPR-PIMG'].failures.length).toEqual(1);

                // {{@blog.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BC']);
                expect(output.results.fail['GS001-DEPR-BC'].failures.length).toEqual(1);

                // {{author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AC']);
                expect(output.results.fail['GS001-DEPR-AC'].failures.length).toEqual(2);

                // {{post.author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAC']);
                expect(output.results.fail['GS001-DEPR-PAC'].failures.length).toEqual(1);

                // {{post.author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAIMG']);
                expect(output.results.fail['GS001-DEPR-PAIMG'].failures.length).toEqual(1);

                // {{tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TIMG']);
                expect(output.results.fail['GS001-DEPR-TIMG'].failures.length).toEqual(1);

                // {{posts.tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PTIMG']);
                expect(output.results.fail['GS001-DEPR-PTIMG'].failures.length).toEqual(1);

                // {{tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TSIMG']);
                expect(output.results.fail['GS001-DEPR-TSIMG'].failures.length).toEqual(1);

                // {{#if image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-IMG']);
                expect(output.results.fail['GS001-DEPR-CON-IMG'].failures.length).toEqual(1);

                // {{#if cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-COV']);
                expect(output.results.fail['GS001-DEPR-CON-COV'].failures.length).toEqual(1);

                // {{#if tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TIMG'].failures.length).toEqual(1);

                // {{#if tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TSIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length).toEqual(1);

                // {{#if post.tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PTIMG']);
                expect(output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length).toEqual(1);

                // {{@blog.posts_per_page}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PPP']);
                expect(output.results.fail['GS001-DEPR-PPP'].failures.length).toEqual(1);

                // {{content word="0"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-C0H']);
                expect(output.results.fail['GS001-DEPR-C0H'].failures.length).toEqual(2);

                // css class .page-template-{slug}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-PATS']);
                expect(output.results.fail['GS001-DEPR-CSS-PATS'].failures.length).toEqual(2);

                // css class .achive-template
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-AT']);
                expect(output.results.fail['GS001-DEPR-CSS-AT'].failures.length).toEqual(1);

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(5);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{post.author_id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAID']);
                expect(output.results.fail['GS001-DEPR-PAID'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{@blog}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(2);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.ghost_head}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGH']);
                expect(output.results.fail['GS001-DEPR-SGH'].failures.length).toEqual(1);

                // {{@site.ghost_foot}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGF']);
                expect(output.results.fail['GS001-DEPR-SGF'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{#get "users"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-USER-GET']);
                expect(output.results.fail['GS001-DEPR-USER-GET'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // there are some single author rules which are not invalid for this theme.
                expect(output.results.pass.length).toEqual(17);

            });
        });

        it('[failure] theme is invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v2/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-AIMG-2',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-EACH'
                );

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(1);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG-2']);
                expect(output.results.fail['GS001-DEPR-AIMG-2'].failures.length).toEqual(1);

                // {{@blog.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(1);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SPL']);
                expect(output.results.fail['GS001-DEPR-SPL'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LANG']);
                expect(output.results.fail['GS001-DEPR-LANG'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(46);

            });
        });

        it('[success] should show no error if no deprecated helpers used', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v2/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(91);

            });
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v2/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-BLOG'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(58);

            });
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('[failure] theme is completely invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v3/invalid_all', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-PPP',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SGH',
                    'GS001-DEPR-SGF',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-PAID',
                    'GS001-DEPR-USER-GET',
                    'GS001-DEPR-EACH'
                );

                // pageUrl
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PURL']);
                expect(output.results.fail['GS001-DEPR-PURL'].failures.length).toEqual(3);

                // meta_description in <head>
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-MD']);
                expect(output.results.fail['GS001-DEPR-MD'].failures.length).toEqual(1);

                // {{image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IMG']);
                expect(output.results.fail['GS001-DEPR-IMG'].failures.length).toEqual(2);

                // {{cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-COV']);
                expect(output.results.fail['GS001-DEPR-COV'].failures.length).toEqual(3);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG']);
                expect(output.results.fail['GS001-DEPR-AIMG'].failures.length).toEqual(2);

                // {{post.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PIMG']);
                expect(output.results.fail['GS001-DEPR-PIMG'].failures.length).toEqual(1);

                // {{@blog.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BC']);
                expect(output.results.fail['GS001-DEPR-BC'].failures.length).toEqual(1);

                // {{author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AC']);
                expect(output.results.fail['GS001-DEPR-AC'].failures.length).toEqual(2);

                // {{post.author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAC']);
                expect(output.results.fail['GS001-DEPR-PAC'].failures.length).toEqual(1);

                // {{post.author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAIMG']);
                expect(output.results.fail['GS001-DEPR-PAIMG'].failures.length).toEqual(1);

                // {{tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TIMG']);
                expect(output.results.fail['GS001-DEPR-TIMG'].failures.length).toEqual(1);

                // {{posts.tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PTIMG']);
                expect(output.results.fail['GS001-DEPR-PTIMG'].failures.length).toEqual(1);

                // {{tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TSIMG']);
                expect(output.results.fail['GS001-DEPR-TSIMG'].failures.length).toEqual(1);

                // {{#if image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-IMG']);
                expect(output.results.fail['GS001-DEPR-CON-IMG'].failures.length).toEqual(1);

                // {{#if cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-COV']);
                expect(output.results.fail['GS001-DEPR-CON-COV'].failures.length).toEqual(1);

                // {{#if tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TIMG'].failures.length).toEqual(1);

                // {{#if tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TSIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length).toEqual(1);

                // {{#if post.tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PTIMG']);
                expect(output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length).toEqual(1);

                // {{@blog.posts_per_page}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PPP']);
                expect(output.results.fail['GS001-DEPR-PPP'].failures.length).toEqual(1);

                // {{content word="0"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-C0H']);
                expect(output.results.fail['GS001-DEPR-C0H'].failures.length).toEqual(2);

                // css class .page-template-{slug}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-PATS']);
                expect(output.results.fail['GS001-DEPR-CSS-PATS'].failures.length).toEqual(2);

                // css class .achive-template
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-AT']);
                expect(output.results.fail['GS001-DEPR-CSS-AT'].failures.length).toEqual(1);

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(5);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{post.author_id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAID']);
                expect(output.results.fail['GS001-DEPR-PAID'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{error.code}} / {{code}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(2);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.ghost_head}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGH']);
                expect(output.results.fail['GS001-DEPR-SGH'].failures.length).toEqual(1);

                // {{@site.ghost_foot}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGF']);
                expect(output.results.fail['GS001-DEPR-SGF'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{#get "users"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-USER-GET']);
                expect(output.results.fail['GS001-DEPR-USER-GET'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // there are some single author rules which are not invalid for this theme.
                expect(output.results.pass.length).toEqual(17);

            });
        });

        it('[failure] theme is invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v3/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-AIMG-2',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-EACH'
                );

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(1);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG-2']);
                expect(output.results.fail['GS001-DEPR-AIMG-2'].failures.length).toEqual(1);

                // {{error.statusCode}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(1);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SPL']);
                expect(output.results.fail['GS001-DEPR-SPL'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LANG']);
                expect(output.results.fail['GS001-DEPR-LANG'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(46);

            });
        });

        it('[success] should show no error if no deprecated helpers used', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v3/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(92);

            });
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v3/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-BLOG'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(58);

            });
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('[failure] theme is completely invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v4/invalid_all', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-PPP',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SGH',
                    'GS001-DEPR-SGF',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-PAID',
                    'GS001-DEPR-USER-GET',
                    'GS001-DEPR-EACH',
                    'GS001-DEPR-LABS-MEMBERS',
                    'GS001-DEPR-SITE-LANG'
                );

                // pageUrl
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PURL']);
                expect(output.results.fail['GS001-DEPR-PURL'].failures.length).toEqual(3);

                // meta_description in <head>
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-MD']);
                expect(output.results.fail['GS001-DEPR-MD'].failures.length).toEqual(1);

                // {{image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IMG']);
                expect(output.results.fail['GS001-DEPR-IMG'].failures.length).toEqual(2);

                // {{cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-COV']);
                expect(output.results.fail['GS001-DEPR-COV'].failures.length).toEqual(3);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG']);
                expect(output.results.fail['GS001-DEPR-AIMG'].failures.length).toEqual(2);

                // {{post.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PIMG']);
                expect(output.results.fail['GS001-DEPR-PIMG'].failures.length).toEqual(1);

                // {{@blog.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BC']);
                expect(output.results.fail['GS001-DEPR-BC'].failures.length).toEqual(1);

                // {{author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AC']);
                expect(output.results.fail['GS001-DEPR-AC'].failures.length).toEqual(2);

                // {{post.author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAC']);
                expect(output.results.fail['GS001-DEPR-PAC'].failures.length).toEqual(1);

                // {{post.author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAIMG']);
                expect(output.results.fail['GS001-DEPR-PAIMG'].failures.length).toEqual(1);

                // {{tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TIMG']);
                expect(output.results.fail['GS001-DEPR-TIMG'].failures.length).toEqual(1);

                // {{posts.tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PTIMG']);
                expect(output.results.fail['GS001-DEPR-PTIMG'].failures.length).toEqual(1);

                // {{tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TSIMG']);
                expect(output.results.fail['GS001-DEPR-TSIMG'].failures.length).toEqual(1);

                // {{#if image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-IMG']);
                expect(output.results.fail['GS001-DEPR-CON-IMG'].failures.length).toEqual(1);

                // {{#if cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-COV']);
                expect(output.results.fail['GS001-DEPR-CON-COV'].failures.length).toEqual(1);

                // {{#if tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TIMG'].failures.length).toEqual(1);

                // {{#if tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TSIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length).toEqual(1);

                // {{#if post.tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PTIMG']);
                expect(output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length).toEqual(1);

                // {{@blog.posts_per_page}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PPP']);
                expect(output.results.fail['GS001-DEPR-PPP'].failures.length).toEqual(1);

                // {{content word="0"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-C0H']);
                expect(output.results.fail['GS001-DEPR-C0H'].failures.length).toEqual(2);

                // css class .page-template-{slug}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-PATS']);
                expect(output.results.fail['GS001-DEPR-CSS-PATS'].failures.length).toEqual(2);

                // css class .achive-template
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-AT']);
                expect(output.results.fail['GS001-DEPR-CSS-AT'].failures.length).toEqual(1);

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(5);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{post.author_id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAID']);
                expect(output.results.fail['GS001-DEPR-PAID'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{error.code}} / {{code}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(2);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.ghost_head}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGH']);
                expect(output.results.fail['GS001-DEPR-SGH'].failures.length).toEqual(1);

                // {{@site.ghost_foot}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGF']);
                expect(output.results.fail['GS001-DEPR-SGF'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{#get "users"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-USER-GET']);
                expect(output.results.fail['GS001-DEPR-USER-GET'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // {{@labs.members}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LABS-MEMBERS']);
                expect(output.results.fail['GS001-DEPR-LABS-MEMBERS'].failures.length).toEqual(1);

                // {{@site.lang}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SITE-LANG']);
                expect(output.results.fail['GS001-DEPR-SITE-LANG'].failures.length).toEqual(1);

                // there are some single author rules which are not invalid for this theme.
                expect(output.results.pass.length).toEqual(18);

            });
        });

        it('[failure] theme is invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v4/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-AIMG-2',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-EACH',
                    'GS001-DEPR-CURR-SYM',
                    'GS001-DEPR-SITE-LANG'
                );

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(1);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG-2']);
                expect(output.results.fail['GS001-DEPR-AIMG-2'].failures.length).toEqual(1);

                // {{error.statusCode}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(1);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SPL']);
                expect(output.results.fail['GS001-DEPR-SPL'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LANG']);
                expect(output.results.fail['GS001-DEPR-LANG'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // {{.currency_symbol}} usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CURR-SYM']);
                expect(output.results.fail['GS001-DEPR-CURR-SYM'].failures.length).toEqual(2);

                // {{@site.lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SITE-LANG']);
                expect(output.results.fail['GS001-DEPR-SITE-LANG'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(47);

            });
        });

        it('[success] should show no error if no deprecated helpers used', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v4/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(95);

            });
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v4/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-BLOG'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(61);

            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('[failure] theme is completely invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/invalid_all', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-PPP',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-EACH',
                    'GS001-DEPR-USER-GET',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-PAID',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-SGH',
                    'GS001-DEPR-SGF',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-LABS-MEMBERS',
                    'GS001-DEPR-CURR-SYM',
                    'GS001-DEPR-SITE-LANG'
                ]);

                // pageUrl
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PURL']);
                expect(output.results.fail['GS001-DEPR-PURL'].failures.length).toEqual(3);

                // meta_description in <head>
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-MD']);
                expect(output.results.fail['GS001-DEPR-MD'].failures.length).toEqual(1);

                // {{image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IMG']);
                expect(output.results.fail['GS001-DEPR-IMG'].failures.length).toEqual(2);

                // {{cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-COV']);
                expect(output.results.fail['GS001-DEPR-COV'].failures.length).toEqual(3);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG']);
                expect(output.results.fail['GS001-DEPR-AIMG'].failures.length).toEqual(2);

                // {{post.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PIMG']);
                expect(output.results.fail['GS001-DEPR-PIMG'].failures.length).toEqual(1);

                // {{@blog.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BC']);
                expect(output.results.fail['GS001-DEPR-BC'].failures.length).toEqual(1);

                // {{author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AC']);
                expect(output.results.fail['GS001-DEPR-AC'].failures.length).toEqual(2);

                // {{post.author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAC']);
                expect(output.results.fail['GS001-DEPR-PAC'].failures.length).toEqual(1);

                // {{post.author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAIMG']);
                expect(output.results.fail['GS001-DEPR-PAIMG'].failures.length).toEqual(1);

                // {{tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TIMG']);
                expect(output.results.fail['GS001-DEPR-TIMG'].failures.length).toEqual(1);

                // {{posts.tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PTIMG']);
                expect(output.results.fail['GS001-DEPR-PTIMG'].failures.length).toEqual(1);

                // {{tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TSIMG']);
                expect(output.results.fail['GS001-DEPR-TSIMG'].failures.length).toEqual(1);

                // {{#if image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-IMG']);
                expect(output.results.fail['GS001-DEPR-CON-IMG'].failures.length).toEqual(1);

                // {{#if cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-COV']);
                expect(output.results.fail['GS001-DEPR-CON-COV'].failures.length).toEqual(1);

                // {{#if tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TIMG'].failures.length).toEqual(1);

                // {{#if tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TSIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length).toEqual(1);

                // {{#if post.tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PTIMG']);
                expect(output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length).toEqual(1);

                // {{@blog.posts_per_page}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PPP']);
                expect(output.results.fail['GS001-DEPR-PPP'].failures.length).toEqual(1);

                // {{content word="0"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-C0H']);
                expect(output.results.fail['GS001-DEPR-C0H'].failures.length).toEqual(2);

                // css class .page-template-{slug}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-PATS']);
                expect(output.results.fail['GS001-DEPR-CSS-PATS'].failures.length).toEqual(2);

                // css class .achive-template
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-AT']);
                expect(output.results.fail['GS001-DEPR-CSS-AT'].failures.length).toEqual(1);

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(5);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{post.author_id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAID']);
                expect(output.results.fail['GS001-DEPR-PAID'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{error.code}} / {{code}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(2);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.ghost_head}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGH']);
                expect(output.results.fail['GS001-DEPR-SGH'].failures.length).toEqual(1);

                // {{@site.ghost_foot}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGF']);
                expect(output.results.fail['GS001-DEPR-SGF'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{#get "users"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-USER-GET']);
                expect(output.results.fail['GS001-DEPR-USER-GET'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // {{@labs.members}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LABS-MEMBERS']);
                expect(output.results.fail['GS001-DEPR-LABS-MEMBERS'].failures.length).toEqual(1);

                // {{@site.lang}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SITE-LANG']);
                expect(output.results.fail['GS001-DEPR-SITE-LANG'].failures.length).toEqual(2);

                // there are some single author rules which are not invalid for this theme.
                expect(output.results.pass.length).toEqual(16);

            });
        });

        it('[failure] theme is invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-AIMG-2',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-EACH',
                    'GS001-DEPR-CURR-SYM',
                    'GS001-DEPR-SITE-LANG'
                );

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(1);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG-2']);
                expect(output.results.fail['GS001-DEPR-AIMG-2'].failures.length).toEqual(1);

                // {{error.statusCode}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(1);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SPL']);
                expect(output.results.fail['GS001-DEPR-SPL'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LANG']);
                expect(output.results.fail['GS001-DEPR-LANG'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // {{.currency_symbol}} usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CURR-SYM']);
                expect(output.results.fail['GS001-DEPR-CURR-SYM'].failures.length).toEqual(2);

                // {{@site.lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SITE-LANG']);
                expect(output.results.fail['GS001-DEPR-SITE-LANG'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(47);

            });
        });

        it('[success] should show no error if no deprecated helpers used', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(95);

            });
        });

        it('[failure] should show deprecations in partials', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/invalid_partial', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([
                    'GS001-DEPR-PURL'
                ]);
                expect(output.results.pass).toHaveLength(94);

            });
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-BLOG'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(61);

            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('[failure] theme is completely invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/invalid_all', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-PPP',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-EACH',
                    'GS001-DEPR-USER-GET',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-PAID',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-SGH',
                    'GS001-DEPR-SGF',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-LABS-MEMBERS',
                    'GS001-DEPR-CURR-SYM',
                    'GS001-DEPR-SITE-LANG'
                ]);

                // pageUrl
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PURL']);
                expect(output.results.fail['GS001-DEPR-PURL'].failures.length).toEqual(3);

                // meta_description in <head>
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-MD']);
                expect(output.results.fail['GS001-DEPR-MD'].failures.length).toEqual(1);

                // {{image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IMG']);
                expect(output.results.fail['GS001-DEPR-IMG'].failures.length).toEqual(2);

                // {{cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-COV']);
                expect(output.results.fail['GS001-DEPR-COV'].failures.length).toEqual(3);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG']);
                expect(output.results.fail['GS001-DEPR-AIMG'].failures.length).toEqual(2);

                // {{post.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PIMG']);
                expect(output.results.fail['GS001-DEPR-PIMG'].failures.length).toEqual(1);

                // {{@blog.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BC']);
                expect(output.results.fail['GS001-DEPR-BC'].failures.length).toEqual(1);

                // {{author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AC']);
                expect(output.results.fail['GS001-DEPR-AC'].failures.length).toEqual(2);

                // {{post.author.cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAC']);
                expect(output.results.fail['GS001-DEPR-PAC'].failures.length).toEqual(1);

                // {{post.author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAIMG']);
                expect(output.results.fail['GS001-DEPR-PAIMG'].failures.length).toEqual(1);

                // {{tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TIMG']);
                expect(output.results.fail['GS001-DEPR-TIMG'].failures.length).toEqual(1);

                // {{posts.tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PTIMG']);
                expect(output.results.fail['GS001-DEPR-PTIMG'].failures.length).toEqual(1);

                // {{tags.[4].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TSIMG']);
                expect(output.results.fail['GS001-DEPR-TSIMG'].failures.length).toEqual(1);

                // {{#if image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-IMG']);
                expect(output.results.fail['GS001-DEPR-CON-IMG'].failures.length).toEqual(1);

                // {{#if cover}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-COV']);
                expect(output.results.fail['GS001-DEPR-CON-COV'].failures.length).toEqual(1);

                // {{#if tag.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TIMG'].failures.length).toEqual(1);

                // {{#if tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-TSIMG']);
                expect(output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length).toEqual(1);

                // {{#if post.tags.[#].image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PTIMG']);
                expect(output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length).toEqual(1);

                // {{@blog.posts_per_page}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PPP']);
                expect(output.results.fail['GS001-DEPR-PPP'].failures.length).toEqual(1);

                // {{content word="0"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-C0H']);
                expect(output.results.fail['GS001-DEPR-C0H'].failures.length).toEqual(2);

                // css class .page-template-{slug}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-PATS']);
                expect(output.results.fail['GS001-DEPR-CSS-PATS'].failures.length).toEqual(2);

                // css class .achive-template
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-AT']);
                expect(output.results.fail['GS001-DEPR-CSS-AT'].failures.length).toEqual(1);

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(5);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{post.author_id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAID']);
                expect(output.results.fail['GS001-DEPR-PAID'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{error.code}} / {{code}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(2);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.ghost_head}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGH']);
                expect(output.results.fail['GS001-DEPR-SGH'].failures.length).toEqual(1);

                // {{@site.ghost_foot}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SGF']);
                expect(output.results.fail['GS001-DEPR-SGF'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{#get "users"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-USER-GET']);
                expect(output.results.fail['GS001-DEPR-USER-GET'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // {{@labs.members}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LABS-MEMBERS']);
                expect(output.results.fail['GS001-DEPR-LABS-MEMBERS'].failures.length).toEqual(1);

                // {{@site.lang}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SITE-LANG']);
                expect(output.results.fail['GS001-DEPR-SITE-LANG'].failures.length).toEqual(2);

                // there are some single author rules which are not invalid for this theme.
                expect(output.results.pass.length).toEqual(19);

            });
        });

        it('[failure] theme is invalid', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-AIMG-2',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-EACH',
                    'GS001-DEPR-CURR-SYM',
                    'GS001-DEPR-SITE-LANG'
                );

                // css class .kg-card-markdown
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CSS-KGMD']);
                expect(output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length).toEqual(1);

                // {{#get "posts" include="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                // {{#get "posts" fields="author"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FIELD']);
                expect(output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length).toEqual(1);

                // {{#get "posts" filter="author:[...]"}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FILT']);
                expect(output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length).toEqual(1);

                // {{#author}} but not in author.hbs
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTHBL']);
                expect(output.results.fail['GS001-DEPR-AUTHBL'].failures.length).toEqual(1);

                // {{#if author}} or {{#if author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-AUTH']);
                expect(output.results.fail['GS001-DEPR-CON-AUTH'].failures.length).toEqual(3);

                // {{#if post.author}} or {{#if post.author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CON-PAUTH']);
                expect(output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length).toEqual(1);

                // {{author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                // {{author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-ID']);
                expect(output.results.fail['GS001-DEPR-AUTH-ID'].failures.length).toEqual(1);

                // {{author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length).toEqual(2);

                // {{author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length).toEqual(1);

                // {{author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MT']);
                expect(output.results.fail['GS001-DEPR-AUTH-MT'].failures.length).toEqual(1);

                // {{author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-MD']);
                expect(output.results.fail['GS001-DEPR-AUTH-MD'].failures.length).toEqual(1);

                // {{author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length).toEqual(1);

                // {{author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length).toEqual(1);

                // {{author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length).toEqual(1);

                // {{author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length).toEqual(1);

                // {{author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-TW']);
                expect(output.results.fail['GS001-DEPR-AUTH-TW'].failures.length).toEqual(1);

                // {{author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-FB']);
                expect(output.results.fail['GS001-DEPR-AUTH-FB'].failures.length).toEqual(1);

                // {{author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length).toEqual(1);

                // {{author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length).toEqual(1);

                // {{author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-URL']);
                expect(output.results.fail['GS001-DEPR-AUTH-URL'].failures.length).toEqual(1);

                // {{post.author}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH']);
                expect(output.results.fail['GS001-DEPR-PAUTH'].failures.length).toEqual(1);

                // {{post.author.id}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-ID']);
                expect(output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length).toEqual(1);

                // {{post.author.slug}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-SLUG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length).toEqual(1);

                // {{post.author.email}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MAIL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length).toEqual(1);

                // {{post.author.meta_title}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MT']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length).toEqual(1);

                // {{post.author.meta_description}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-MD']);
                expect(output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length).toEqual(1);

                // {{post.author.name}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-NAME']);
                expect(output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length).toEqual(1);

                // {{post.author.bio}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-BIO']);
                expect(output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length).toEqual(1);

                // {{post.author.location}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-LOC']);
                expect(output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length).toEqual(1);

                // {{post.author.website}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-WEB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length).toEqual(1);

                // {{post.author.twitter}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-TW']);
                expect(output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length).toEqual(1);

                // {{post.author.facebook}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-FB']);
                expect(output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length).toEqual(1);

                // {{post.author.profile_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-PIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length).toEqual(1);

                // {{post.author.cover_image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-CIMG']);
                expect(output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length).toEqual(1);

                // {{post.author.url}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-PAUTH-URL']);
                expect(output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length).toEqual(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-NAUTH']);
                expect(output.results.fail['GS001-DEPR-NAUTH'].failures.length).toEqual(1);

                // {{img_url author.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-IUA']);
                expect(output.results.fail['GS001-DEPR-IUA'].failures.length).toEqual(1);

                // {{primary_author.image}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AIMG-2']);
                expect(output.results.fail['GS001-DEPR-AIMG-2'].failures.length).toEqual(1);

                // {{error.statusCode}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-ESC']);
                expect(output.results.fail['GS001-DEPR-ESC'].failures.length).toEqual(2);

                // {{@blog.*}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BLOG']);
                expect(output.results.fail['GS001-DEPR-BLOG'].failures.length).toEqual(1);

                // {{@blog.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-BPL']);
                expect(output.results.fail['GS001-DEPR-BPL'].failures.length).toEqual(1);

                // {{@site.permalinks}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SPL']);
                expect(output.results.fail['GS001-DEPR-SPL'].failures.length).toEqual(1);

                // {{lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-LANG']);
                expect(output.results.fail['GS001-DEPR-LANG'].failures.length).toEqual(1);

                // {{#each}} helper usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-EACH']);
                expect(output.results.fail['GS001-DEPR-EACH'].failures.length).toEqual(1);

                // {{.currency_symbol}} usage warning
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-CURR-SYM']);
                expect(output.results.fail['GS001-DEPR-CURR-SYM'].failures.length).toEqual(2);

                // {{@site.lang}}
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-SITE-LANG']);
                expect(output.results.fail['GS001-DEPR-SITE-LANG'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(50);

            });
        });

        it('[success] should show no error if no deprecated helpers used', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v6/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
                expect(output.results.pass).toHaveLength(98);

            });
        });

        it('[failure] should show deprecations in partials', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/invalid_partial', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([
                    'GS001-DEPR-PURL'
                ]);
                expect(output.results.pass).toHaveLength(97);

            });
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v5/mixed', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-CSS-KGMD',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-BLOG'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH-INCL']);
                expect(output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length).toEqual(1);

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AUTH']);
                expect(output.results.fail['GS001-DEPR-AUTH'].failures.length).toEqual(1);

                expect(output.results.pass).toHaveLength(64);

            });
        });

        it('[failure] should detect AMP templates', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v6/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-AMP-TEMPLATE'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-AMP-TEMPLATE']);
                expect(output.results.fail['GS001-DEPR-AMP-TEMPLATE'].failures.length).toEqual(4);

                // Check all AMP template files are detected
                const ampFiles = output.results.fail['GS001-DEPR-AMP-TEMPLATE'].failures.map(f => f.ref).sort();
                expect(ampFiles).toEqual([
                    'amp-lightning-with-attrs.hbs',
                    'amp-lightning.hbs',
                    'amp-with-class.hbs',
                    'amp.hbs'
                ]);

            });
        });

        it('[success] should not detect false positive AMP templates', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v6/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                // Should not contain AMP template failures for themes that mention "amp" but aren't actually AMP
                expect(output.results.fail).not.toHaveProperty('GS001-DEPR-AMP-TEMPLATE');
                utils.assertContains(output.results.pass, 'GS001-DEPR-AMP-TEMPLATE');

            });
        });

        it('[failure] should detect deprecated facebook and twitter helper usage', function () {
            return utils.testCheck(thisCheck, '001-deprecations/v6/invalid/fb-twitter-helpers', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail,
                    'GS001-DEPR-FACEBOOK-URL',
                    'GS001-DEPR-TWITTER-URL'
                );

                utils.assertValidFailObject(output.results.fail['GS001-DEPR-FACEBOOK-URL']);
                utils.assertValidFailObject(output.results.fail['GS001-DEPR-TWITTER-URL']);

                const facebookFiles = output.results.fail['GS001-DEPR-FACEBOOK-URL'].failures.map(f => f.ref).sort();
                expect(facebookFiles).toEqual([
                    'fb-pattern-1.hbs',
                    'fb-pattern-2.hbs',
                    'fb-pattern-3.hbs'
                ]);
                const twitterFiles = output.results.fail['GS001-DEPR-TWITTER-URL'].failures.map(f => f.ref).sort();
                expect(twitterFiles).toEqual([
                    'twitter-pattern-1.hbs',
                    'twitter-pattern-2.hbs',
                    'twitter-pattern-3.hbs'
                ]);

            });
        });
    });
});
