const should = require('should'); // eslint-disable-line no-unused-vars
const thisCheck = require('../lib/checks/001-deprecations');
const utils = require('./utils');

describe('001 Deprecations', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('[failure] theme is invalid', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/v1/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
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
                output.results.fail['GS001-DEPR-PURL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PURL'].failures.length.should.eql(3);

                // meta_description in <head>
                output.results.fail['GS001-DEPR-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-MD'].failures.length.should.eql(1);

                // {{image}}
                output.results.fail['GS001-DEPR-IMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-IMG'].failures.length.should.eql(2);

                // {{cover}}
                output.results.fail['GS001-DEPR-COV'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-COV'].failures.length.should.eql(3);

                // {{author.image}}
                output.results.fail['GS001-DEPR-AIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AIMG'].failures.length.should.eql(2);

                // {{post.image}}
                output.results.fail['GS001-DEPR-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PIMG'].failures.length.should.eql(1);

                // {{@blog.cover}}
                output.results.fail['GS001-DEPR-BC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BC'].failures.length.should.eql(1);

                // {{author.cover}}
                output.results.fail['GS001-DEPR-AC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AC'].failures.length.should.eql(2);

                // {{post.author.cover}}
                output.results.fail['GS001-DEPR-PAC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAC'].failures.length.should.eql(1);

                // {{post.author.image}}
                output.results.fail['GS001-DEPR-PAIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAIMG'].failures.length.should.eql(1);

                // {{tag.image}}
                output.results.fail['GS001-DEPR-TIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-TIMG'].failures.length.should.eql(1);

                // {{posts.tags.[4].image}}
                output.results.fail['GS001-DEPR-PTIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PTIMG'].failures.length.should.eql(1);

                // {{tags.[4].image}}
                output.results.fail['GS001-DEPR-TSIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-TSIMG'].failures.length.should.eql(1);

                // {{#if image}}
                output.results.fail['GS001-DEPR-CON-IMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-IMG'].failures.length.should.eql(1);

                // {{#if cover}}
                output.results.fail['GS001-DEPR-CON-COV'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-COV'].failures.length.should.eql(1);

                // {{#if tag.image}}
                output.results.fail['GS001-DEPR-CON-TIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-TIMG'].failures.length.should.eql(1);

                // {{#if tags.[#].image}}
                output.results.fail['GS001-DEPR-CON-TSIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length.should.eql(1);

                // {{#if post.tags.[#].image}}
                output.results.fail['GS001-DEPR-CON-PTIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length.should.eql(1);

                // {{@blog.posts_per_page}}
                output.results.fail['GS001-DEPR-PPP'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PPP'].failures.length.should.eql(1);

                // {{content word="0"}}
                output.results.fail['GS001-DEPR-C0H'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-C0H'].failures.length.should.eql(2);

                // css class .page-template-{slug}
                output.results.fail['GS001-DEPR-CSS-PATS'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-PATS'].failures.length.should.eql(2);

                // css class .achive-template
                output.results.fail['GS001-DEPR-CSS-AT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-AT'].failures.length.should.eql(1);

                // {{#each}} helper usage warning
                output.results.fail['GS001-DEPR-EACH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-EACH'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should show no error if no deprecated helpers used', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/v1/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();
                output.results.pass.should.be.an.Array().with.lengthOf(28);

                done();
            }).catch(done);
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/v1/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-MD',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-C0H'
                );

                output.results.fail['GS001-DEPR-PURL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PURL'].failures.length.should.eql(2);
                output.results.pass.should.be.an.Array().with.lengthOf(20);

                done();
            }).catch(done);
        });
    });

    describe('v2 version:', function () {
        const options = {checkVersion: 'v2'};

        it('[failure] theme is completely invalid', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/v2/invalid_all', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
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
                output.results.fail['GS001-DEPR-PURL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PURL'].failures.length.should.eql(3);

                // meta_description in <head>
                output.results.fail['GS001-DEPR-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-MD'].failures.length.should.eql(1);

                // {{image}}
                output.results.fail['GS001-DEPR-IMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-IMG'].failures.length.should.eql(2);

                // {{cover}}
                output.results.fail['GS001-DEPR-COV'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-COV'].failures.length.should.eql(3);

                // {{primary_author.image}}
                output.results.fail['GS001-DEPR-AIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AIMG'].failures.length.should.eql(2);

                // {{post.image}}
                output.results.fail['GS001-DEPR-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PIMG'].failures.length.should.eql(1);

                // {{@blog.cover}}
                output.results.fail['GS001-DEPR-BC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BC'].failures.length.should.eql(1);

                // {{author.cover}}
                output.results.fail['GS001-DEPR-AC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AC'].failures.length.should.eql(2);

                // {{post.author.cover}}
                output.results.fail['GS001-DEPR-PAC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAC'].failures.length.should.eql(1);

                // {{post.author.image}}
                output.results.fail['GS001-DEPR-PAIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAIMG'].failures.length.should.eql(1);

                // {{tag.image}}
                output.results.fail['GS001-DEPR-TIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-TIMG'].failures.length.should.eql(1);

                // {{posts.tags.[4].image}}
                output.results.fail['GS001-DEPR-PTIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PTIMG'].failures.length.should.eql(1);

                // {{tags.[4].image}}
                output.results.fail['GS001-DEPR-TSIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-TSIMG'].failures.length.should.eql(1);

                // {{#if image}}
                output.results.fail['GS001-DEPR-CON-IMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-IMG'].failures.length.should.eql(1);

                // {{#if cover}}
                output.results.fail['GS001-DEPR-CON-COV'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-COV'].failures.length.should.eql(1);

                // {{#if tag.image}}
                output.results.fail['GS001-DEPR-CON-TIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-TIMG'].failures.length.should.eql(1);

                // {{#if tags.[#].image}}
                output.results.fail['GS001-DEPR-CON-TSIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length.should.eql(1);

                // {{#if post.tags.[#].image}}
                output.results.fail['GS001-DEPR-CON-PTIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length.should.eql(1);

                // {{@blog.posts_per_page}}
                output.results.fail['GS001-DEPR-PPP'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PPP'].failures.length.should.eql(1);

                // {{content word="0"}}
                output.results.fail['GS001-DEPR-C0H'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-C0H'].failures.length.should.eql(2);

                // css class .page-template-{slug}
                output.results.fail['GS001-DEPR-CSS-PATS'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-PATS'].failures.length.should.eql(2);

                // css class .achive-template
                output.results.fail['GS001-DEPR-CSS-AT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-AT'].failures.length.should.eql(1);

                // css class .kg-card-markdown
                output.results.fail['GS001-DEPR-CSS-KGMD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length.should.eql(5);

                // {{#get "posts" include="author"}}
                output.results.fail['GS001-DEPR-AUTH-INCL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length.should.eql(1);

                // {{#get "posts" fields="author"}}
                output.results.fail['GS001-DEPR-AUTH-FIELD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length.should.eql(1);

                // {{#get "posts" filter="author:[...]"}}
                output.results.fail['GS001-DEPR-AUTH-FILT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length.should.eql(1);

                // {{#author}} but not in author.hbs
                output.results.fail['GS001-DEPR-AUTHBL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTHBL'].failures.length.should.eql(1);

                // {{#if author}} or {{#if author.*}}
                output.results.fail['GS001-DEPR-CON-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-AUTH'].failures.length.should.eql(3);

                // {{#if post.author}} or {{#if post.author.*}}
                output.results.fail['GS001-DEPR-CON-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length.should.eql(1);

                // {{author}}
                output.results.fail['GS001-DEPR-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH'].failures.length.should.eql(1);

                // {{author.id}}
                output.results.fail['GS001-DEPR-AUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-ID'].failures.length.should.eql(1);

                // {{author.slug}}
                output.results.fail['GS001-DEPR-AUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length.should.eql(2);

                // {{author.email}}
                output.results.fail['GS001-DEPR-AUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length.should.eql(1);

                // {{author.meta_title}}
                output.results.fail['GS001-DEPR-AUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MT'].failures.length.should.eql(1);

                // {{author.meta_description}}
                output.results.fail['GS001-DEPR-AUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MD'].failures.length.should.eql(1);

                // {{author.name}}
                output.results.fail['GS001-DEPR-AUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length.should.eql(1);

                // {{author.bio}}
                output.results.fail['GS001-DEPR-AUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length.should.eql(1);

                // {{author.location}}
                output.results.fail['GS001-DEPR-AUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length.should.eql(1);

                // {{author.website}}
                output.results.fail['GS001-DEPR-AUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length.should.eql(1);

                // {{author.twitter}}
                output.results.fail['GS001-DEPR-AUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-TW'].failures.length.should.eql(1);

                // {{author.facebook}}
                output.results.fail['GS001-DEPR-AUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FB'].failures.length.should.eql(1);

                // {{author.profile_image}}
                output.results.fail['GS001-DEPR-AUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length.should.eql(1);

                // {{author.cover_image}}
                output.results.fail['GS001-DEPR-AUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length.should.eql(1);

                // {{author.url}}
                output.results.fail['GS001-DEPR-AUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-URL'].failures.length.should.eql(1);

                // {{post.author}}
                output.results.fail['GS001-DEPR-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH'].failures.length.should.eql(1);

                // {{post.author.id}}
                output.results.fail['GS001-DEPR-PAUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length.should.eql(1);

                // {{post.author.slug}}
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length.should.eql(1);

                // {{post.author.email}}
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length.should.eql(1);

                // {{post.author.meta_title}}
                output.results.fail['GS001-DEPR-PAUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length.should.eql(1);

                // {{post.author.meta_description}}
                output.results.fail['GS001-DEPR-PAUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length.should.eql(1);

                // {{post.author.name}}
                output.results.fail['GS001-DEPR-PAUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length.should.eql(1);

                // {{post.author.bio}}
                output.results.fail['GS001-DEPR-PAUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length.should.eql(1);

                // {{post.author.location}}
                output.results.fail['GS001-DEPR-PAUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length.should.eql(1);

                // {{post.author.website}}
                output.results.fail['GS001-DEPR-PAUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length.should.eql(1);

                // {{post.author.twitter}}
                output.results.fail['GS001-DEPR-PAUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length.should.eql(1);

                // {{post.author.facebook}}
                output.results.fail['GS001-DEPR-PAUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length.should.eql(1);

                // {{post.author.profile_image}}
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length.should.eql(1);

                // {{post.author.cover_image}}
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length.should.eql(1);

                // {{post.author.url}}
                output.results.fail['GS001-DEPR-PAUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length.should.eql(1);

                // {{post.author_id}}
                output.results.fail['GS001-DEPR-PAID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAID'].failures.length.should.eql(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                output.results.fail['GS001-DEPR-NAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-NAUTH'].failures.length.should.eql(1);

                // {{img_url author.*}}
                output.results.fail['GS001-DEPR-IUA'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-IUA'].failures.length.should.eql(1);

                // {{@blog}}
                output.results.fail['GS001-DEPR-BLOG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BLOG'].failures.length.should.eql(2);

                // {{@blog.permalinks}}
                output.results.fail['GS001-DEPR-BPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BPL'].failures.length.should.eql(1);

                // {{@site.ghost_head}}
                output.results.fail['GS001-DEPR-SGH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-SGH'].failures.length.should.eql(1);

                // {{@site.ghost_foot}}
                output.results.fail['GS001-DEPR-SGF'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-SGF'].failures.length.should.eql(1);

                // {{lang}}
                output.results.fail['GS001-DEPR-BPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BPL'].failures.length.should.eql(1);

                // {{#get "users"}}
                output.results.fail['GS001-DEPR-USER-GET'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-USER-GET'].failures.length.should.eql(1);

                // {{#each}} helper usage warning
                output.results.fail['GS001-DEPR-EACH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-EACH'].failures.length.should.eql(1);

                // there are some single author rules which are not invalid for this theme.
                output.results.pass.length.should.eql(17);

                done();
            }).catch(done);
        });

        it('[failure] theme is invalid', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/v2/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
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
                output.results.fail['GS001-DEPR-CSS-KGMD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length.should.eql(1);

                // {{#get "posts" include="author"}}
                output.results.fail['GS001-DEPR-AUTH-INCL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length.should.eql(1);

                // {{#get "posts" fields="author"}}
                output.results.fail['GS001-DEPR-AUTH-FIELD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length.should.eql(1);

                // {{#get "posts" filter="author:[...]"}}
                output.results.fail['GS001-DEPR-AUTH-FILT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length.should.eql(1);

                // {{#author}} but not in author.hbs
                output.results.fail['GS001-DEPR-AUTHBL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTHBL'].failures.length.should.eql(1);

                // {{#if author}} or {{#if author.*}}
                output.results.fail['GS001-DEPR-CON-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-AUTH'].failures.length.should.eql(3);

                // {{#if post.author}} or {{#if post.author.*}}
                output.results.fail['GS001-DEPR-CON-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length.should.eql(1);

                // {{author}}
                output.results.fail['GS001-DEPR-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH'].failures.length.should.eql(1);

                // {{author.id}}
                output.results.fail['GS001-DEPR-AUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-ID'].failures.length.should.eql(1);

                // {{author.slug}}
                output.results.fail['GS001-DEPR-AUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length.should.eql(2);

                // {{author.email}}
                output.results.fail['GS001-DEPR-AUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length.should.eql(1);

                // {{author.meta_title}}
                output.results.fail['GS001-DEPR-AUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MT'].failures.length.should.eql(1);

                // {{author.meta_description}}
                output.results.fail['GS001-DEPR-AUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MD'].failures.length.should.eql(1);

                // {{author.name}}
                output.results.fail['GS001-DEPR-AUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length.should.eql(1);

                // {{author.bio}}
                output.results.fail['GS001-DEPR-AUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length.should.eql(1);

                // {{author.location}}
                output.results.fail['GS001-DEPR-AUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length.should.eql(1);

                // {{author.website}}
                output.results.fail['GS001-DEPR-AUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length.should.eql(1);

                // {{author.twitter}}
                output.results.fail['GS001-DEPR-AUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-TW'].failures.length.should.eql(1);

                // {{author.facebook}}
                output.results.fail['GS001-DEPR-AUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FB'].failures.length.should.eql(1);

                // {{author.profile_image}}
                output.results.fail['GS001-DEPR-AUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length.should.eql(1);

                // {{author.cover_image}}
                output.results.fail['GS001-DEPR-AUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length.should.eql(1);

                // {{author.url}}
                output.results.fail['GS001-DEPR-AUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-URL'].failures.length.should.eql(1);

                // {{post.author}}
                output.results.fail['GS001-DEPR-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH'].failures.length.should.eql(1);

                // {{post.author.id}}
                output.results.fail['GS001-DEPR-PAUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length.should.eql(1);

                // {{post.author.slug}}
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length.should.eql(1);

                // {{post.author.email}}
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length.should.eql(1);

                // {{post.author.meta_title}}
                output.results.fail['GS001-DEPR-PAUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length.should.eql(1);

                // {{post.author.meta_description}}
                output.results.fail['GS001-DEPR-PAUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length.should.eql(1);

                // {{post.author.name}}
                output.results.fail['GS001-DEPR-PAUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length.should.eql(1);

                // {{post.author.bio}}
                output.results.fail['GS001-DEPR-PAUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length.should.eql(1);

                // {{post.author.location}}
                output.results.fail['GS001-DEPR-PAUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length.should.eql(1);

                // {{post.author.website}}
                output.results.fail['GS001-DEPR-PAUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length.should.eql(1);

                // {{post.author.twitter}}
                output.results.fail['GS001-DEPR-PAUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length.should.eql(1);

                // {{post.author.facebook}}
                output.results.fail['GS001-DEPR-PAUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length.should.eql(1);

                // {{post.author.profile_image}}
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length.should.eql(1);

                // {{post.author.cover_image}}
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length.should.eql(1);

                // {{post.author.url}}
                output.results.fail['GS001-DEPR-PAUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length.should.eql(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                output.results.fail['GS001-DEPR-NAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-NAUTH'].failures.length.should.eql(1);

                // {{img_url author.*}}
                output.results.fail['GS001-DEPR-IUA'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-IUA'].failures.length.should.eql(1);

                // {{primary_author.image}}
                output.results.fail['GS001-DEPR-AIMG-2'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AIMG-2'].failures.length.should.eql(1);

                // {{@blog.*}}
                output.results.fail['GS001-DEPR-BLOG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BLOG'].failures.length.should.eql(1);

                // {{@blog.permalinks}}
                output.results.fail['GS001-DEPR-BPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BPL'].failures.length.should.eql(1);

                // {{@site.permalinks}}
                output.results.fail['GS001-DEPR-SPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-SPL'].failures.length.should.eql(1);

                // {{lang}}
                output.results.fail['GS001-DEPR-LANG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-LANG'].failures.length.should.eql(1);

                // {{#each}} helper usage warning
                output.results.fail['GS001-DEPR-EACH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-EACH'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Array().with.lengthOf(46);

                done();
            }).catch(done);
        });

        it('[success] should show no error if no deprecated helpers used', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/v2/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();
                output.results.pass.should.be.an.Array().with.lengthOf(91);

                done();
            }).catch(done);
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/v2/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
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

                output.results.fail['GS001-DEPR-AUTH-INCL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length.should.eql(1);

                output.results.fail['GS001-DEPR-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Array().with.lengthOf(58);

                done();
            }).catch(done);
        });
    });

    describe('canary:', function () {
        const options = {checkVersion: 'canary'};

        it('[failure] theme is completely invalid', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/canary/invalid_all', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
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
                output.results.fail['GS001-DEPR-PURL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PURL'].failures.length.should.eql(3);

                // meta_description in <head>
                output.results.fail['GS001-DEPR-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-MD'].failures.length.should.eql(1);

                // {{image}}
                output.results.fail['GS001-DEPR-IMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-IMG'].failures.length.should.eql(2);

                // {{cover}}
                output.results.fail['GS001-DEPR-COV'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-COV'].failures.length.should.eql(3);

                // {{primary_author.image}}
                output.results.fail['GS001-DEPR-AIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AIMG'].failures.length.should.eql(2);

                // {{post.image}}
                output.results.fail['GS001-DEPR-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PIMG'].failures.length.should.eql(1);

                // {{@blog.cover}}
                output.results.fail['GS001-DEPR-BC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BC'].failures.length.should.eql(1);

                // {{author.cover}}
                output.results.fail['GS001-DEPR-AC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AC'].failures.length.should.eql(2);

                // {{post.author.cover}}
                output.results.fail['GS001-DEPR-PAC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAC'].failures.length.should.eql(1);

                // {{post.author.image}}
                output.results.fail['GS001-DEPR-PAIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAIMG'].failures.length.should.eql(1);

                // {{tag.image}}
                output.results.fail['GS001-DEPR-TIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-TIMG'].failures.length.should.eql(1);

                // {{posts.tags.[4].image}}
                output.results.fail['GS001-DEPR-PTIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PTIMG'].failures.length.should.eql(1);

                // {{tags.[4].image}}
                output.results.fail['GS001-DEPR-TSIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-TSIMG'].failures.length.should.eql(1);

                // {{#if image}}
                output.results.fail['GS001-DEPR-CON-IMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-IMG'].failures.length.should.eql(1);

                // {{#if cover}}
                output.results.fail['GS001-DEPR-CON-COV'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-COV'].failures.length.should.eql(1);

                // {{#if tag.image}}
                output.results.fail['GS001-DEPR-CON-TIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-TIMG'].failures.length.should.eql(1);

                // {{#if tags.[#].image}}
                output.results.fail['GS001-DEPR-CON-TSIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-TSIMG'].failures.length.should.eql(1);

                // {{#if post.tags.[#].image}}
                output.results.fail['GS001-DEPR-CON-PTIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-PTIMG'].failures.length.should.eql(1);

                // {{@blog.posts_per_page}}
                output.results.fail['GS001-DEPR-PPP'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PPP'].failures.length.should.eql(1);

                // {{content word="0"}}
                output.results.fail['GS001-DEPR-C0H'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-C0H'].failures.length.should.eql(2);

                // css class .page-template-{slug}
                output.results.fail['GS001-DEPR-CSS-PATS'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-PATS'].failures.length.should.eql(2);

                // css class .achive-template
                output.results.fail['GS001-DEPR-CSS-AT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-AT'].failures.length.should.eql(1);

                // css class .kg-card-markdown
                output.results.fail['GS001-DEPR-CSS-KGMD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length.should.eql(5);

                // {{#get "posts" include="author"}}
                output.results.fail['GS001-DEPR-AUTH-INCL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length.should.eql(1);

                // {{#get "posts" fields="author"}}
                output.results.fail['GS001-DEPR-AUTH-FIELD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length.should.eql(1);

                // {{#get "posts" filter="author:[...]"}}
                output.results.fail['GS001-DEPR-AUTH-FILT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length.should.eql(1);

                // {{#author}} but not in author.hbs
                output.results.fail['GS001-DEPR-AUTHBL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTHBL'].failures.length.should.eql(1);

                // {{#if author}} or {{#if author.*}}
                output.results.fail['GS001-DEPR-CON-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-AUTH'].failures.length.should.eql(3);

                // {{#if post.author}} or {{#if post.author.*}}
                output.results.fail['GS001-DEPR-CON-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length.should.eql(1);

                // {{author}}
                output.results.fail['GS001-DEPR-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH'].failures.length.should.eql(1);

                // {{author.id}}
                output.results.fail['GS001-DEPR-AUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-ID'].failures.length.should.eql(1);

                // {{author.slug}}
                output.results.fail['GS001-DEPR-AUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length.should.eql(2);

                // {{author.email}}
                output.results.fail['GS001-DEPR-AUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length.should.eql(1);

                // {{author.meta_title}}
                output.results.fail['GS001-DEPR-AUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MT'].failures.length.should.eql(1);

                // {{author.meta_description}}
                output.results.fail['GS001-DEPR-AUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MD'].failures.length.should.eql(1);

                // {{author.name}}
                output.results.fail['GS001-DEPR-AUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length.should.eql(1);

                // {{author.bio}}
                output.results.fail['GS001-DEPR-AUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length.should.eql(1);

                // {{author.location}}
                output.results.fail['GS001-DEPR-AUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length.should.eql(1);

                // {{author.website}}
                output.results.fail['GS001-DEPR-AUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length.should.eql(1);

                // {{author.twitter}}
                output.results.fail['GS001-DEPR-AUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-TW'].failures.length.should.eql(1);

                // {{author.facebook}}
                output.results.fail['GS001-DEPR-AUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FB'].failures.length.should.eql(1);

                // {{author.profile_image}}
                output.results.fail['GS001-DEPR-AUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length.should.eql(1);

                // {{author.cover_image}}
                output.results.fail['GS001-DEPR-AUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length.should.eql(1);

                // {{author.url}}
                output.results.fail['GS001-DEPR-AUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-URL'].failures.length.should.eql(1);

                // {{post.author}}
                output.results.fail['GS001-DEPR-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH'].failures.length.should.eql(1);

                // {{post.author.id}}
                output.results.fail['GS001-DEPR-PAUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length.should.eql(1);

                // {{post.author.slug}}
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length.should.eql(1);

                // {{post.author.email}}
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length.should.eql(1);

                // {{post.author.meta_title}}
                output.results.fail['GS001-DEPR-PAUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length.should.eql(1);

                // {{post.author.meta_description}}
                output.results.fail['GS001-DEPR-PAUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length.should.eql(1);

                // {{post.author.name}}
                output.results.fail['GS001-DEPR-PAUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length.should.eql(1);

                // {{post.author.bio}}
                output.results.fail['GS001-DEPR-PAUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length.should.eql(1);

                // {{post.author.location}}
                output.results.fail['GS001-DEPR-PAUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length.should.eql(1);

                // {{post.author.website}}
                output.results.fail['GS001-DEPR-PAUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length.should.eql(1);

                // {{post.author.twitter}}
                output.results.fail['GS001-DEPR-PAUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length.should.eql(1);

                // {{post.author.facebook}}
                output.results.fail['GS001-DEPR-PAUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length.should.eql(1);

                // {{post.author.profile_image}}
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length.should.eql(1);

                // {{post.author.cover_image}}
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length.should.eql(1);

                // {{post.author.url}}
                output.results.fail['GS001-DEPR-PAUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length.should.eql(1);

                // {{post.author_id}}
                output.results.fail['GS001-DEPR-PAID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAID'].failures.length.should.eql(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                output.results.fail['GS001-DEPR-NAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-NAUTH'].failures.length.should.eql(1);

                // {{img_url author.*}}
                output.results.fail['GS001-DEPR-IUA'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-IUA'].failures.length.should.eql(1);

                // {{error.code}} / {{code}}
                output.results.fail['GS001-DEPR-ESC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-ESC'].failures.length.should.eql(2);

                // {{@blog}}
                output.results.fail['GS001-DEPR-BLOG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BLOG'].failures.length.should.eql(2);

                // {{@blog.permalinks}}
                output.results.fail['GS001-DEPR-BPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BPL'].failures.length.should.eql(1);

                // {{@site.ghost_head}}
                output.results.fail['GS001-DEPR-SGH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-SGH'].failures.length.should.eql(1);

                // {{@site.ghost_foot}}
                output.results.fail['GS001-DEPR-SGF'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-SGF'].failures.length.should.eql(1);

                // {{lang}}
                output.results.fail['GS001-DEPR-BPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BPL'].failures.length.should.eql(1);

                // {{#get "users"}}
                output.results.fail['GS001-DEPR-USER-GET'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-USER-GET'].failures.length.should.eql(1);

                // {{#each}} helper usage warning
                output.results.fail['GS001-DEPR-EACH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-EACH'].failures.length.should.eql(1);

                // there are some single author rules which are not invalid for this theme.
                output.results.pass.length.should.eql(17);

                done();
            }).catch(done);
        });

        it('[failure] theme is invalid', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/canary/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
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
                output.results.fail['GS001-DEPR-CSS-KGMD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CSS-KGMD'].failures.length.should.eql(1);

                // {{#get "posts" include="author"}}
                output.results.fail['GS001-DEPR-AUTH-INCL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length.should.eql(1);

                // {{#get "posts" fields="author"}}
                output.results.fail['GS001-DEPR-AUTH-FIELD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FIELD'].failures.length.should.eql(1);

                // {{#get "posts" filter="author:[...]"}}
                output.results.fail['GS001-DEPR-AUTH-FILT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FILT'].failures.length.should.eql(1);

                // {{#author}} but not in author.hbs
                output.results.fail['GS001-DEPR-AUTHBL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTHBL'].failures.length.should.eql(1);

                // {{#if author}} or {{#if author.*}}
                output.results.fail['GS001-DEPR-CON-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-AUTH'].failures.length.should.eql(3);

                // {{#if post.author}} or {{#if post.author.*}}
                output.results.fail['GS001-DEPR-CON-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-CON-PAUTH'].failures.length.should.eql(1);

                // {{author}}
                output.results.fail['GS001-DEPR-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH'].failures.length.should.eql(1);

                // {{author.id}}
                output.results.fail['GS001-DEPR-AUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-ID'].failures.length.should.eql(1);

                // {{author.slug}}
                output.results.fail['GS001-DEPR-AUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-SLUG'].failures.length.should.eql(2);

                // {{author.email}}
                output.results.fail['GS001-DEPR-AUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MAIL'].failures.length.should.eql(1);

                // {{author.meta_title}}
                output.results.fail['GS001-DEPR-AUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MT'].failures.length.should.eql(1);

                // {{author.meta_description}}
                output.results.fail['GS001-DEPR-AUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-MD'].failures.length.should.eql(1);

                // {{author.name}}
                output.results.fail['GS001-DEPR-AUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-NAME'].failures.length.should.eql(1);

                // {{author.bio}}
                output.results.fail['GS001-DEPR-AUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-BIO'].failures.length.should.eql(1);

                // {{author.location}}
                output.results.fail['GS001-DEPR-AUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-LOC'].failures.length.should.eql(1);

                // {{author.website}}
                output.results.fail['GS001-DEPR-AUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-WEB'].failures.length.should.eql(1);

                // {{author.twitter}}
                output.results.fail['GS001-DEPR-AUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-TW'].failures.length.should.eql(1);

                // {{author.facebook}}
                output.results.fail['GS001-DEPR-AUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-FB'].failures.length.should.eql(1);

                // {{author.profile_image}}
                output.results.fail['GS001-DEPR-AUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-PIMG'].failures.length.should.eql(1);

                // {{author.cover_image}}
                output.results.fail['GS001-DEPR-AUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-CIMG'].failures.length.should.eql(1);

                // {{author.url}}
                output.results.fail['GS001-DEPR-AUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-URL'].failures.length.should.eql(1);

                // {{post.author}}
                output.results.fail['GS001-DEPR-PAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH'].failures.length.should.eql(1);

                // {{post.author.id}}
                output.results.fail['GS001-DEPR-PAUTH-ID'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-ID'].failures.length.should.eql(1);

                // {{post.author.slug}}
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-SLUG'].failures.length.should.eql(1);

                // {{post.author.email}}
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MAIL'].failures.length.should.eql(1);

                // {{post.author.meta_title}}
                output.results.fail['GS001-DEPR-PAUTH-MT'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MT'].failures.length.should.eql(1);

                // {{post.author.meta_description}}
                output.results.fail['GS001-DEPR-PAUTH-MD'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-MD'].failures.length.should.eql(1);

                // {{post.author.name}}
                output.results.fail['GS001-DEPR-PAUTH-NAME'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-NAME'].failures.length.should.eql(1);

                // {{post.author.bio}}
                output.results.fail['GS001-DEPR-PAUTH-BIO'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-BIO'].failures.length.should.eql(1);

                // {{post.author.location}}
                output.results.fail['GS001-DEPR-PAUTH-LOC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-LOC'].failures.length.should.eql(1);

                // {{post.author.website}}
                output.results.fail['GS001-DEPR-PAUTH-WEB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-WEB'].failures.length.should.eql(1);

                // {{post.author.twitter}}
                output.results.fail['GS001-DEPR-PAUTH-TW'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-TW'].failures.length.should.eql(1);

                // {{post.author.facebook}}
                output.results.fail['GS001-DEPR-PAUTH-FB'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-FB'].failures.length.should.eql(1);

                // {{post.author.profile_image}}
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-PIMG'].failures.length.should.eql(1);

                // {{post.author.cover_image}}
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-CIMG'].failures.length.should.eql(1);

                // {{post.author.url}}
                output.results.fail['GS001-DEPR-PAUTH-URL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-PAUTH-URL'].failures.length.should.eql(1);

                // {{#../author}}, {{../author}}, {{#if../author}}
                // {{#../author.*}}, {{../author.*}}, {{#if../author.*}}
                output.results.fail['GS001-DEPR-NAUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-NAUTH'].failures.length.should.eql(1);

                // {{img_url author.*}}
                output.results.fail['GS001-DEPR-IUA'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-IUA'].failures.length.should.eql(1);

                // {{primary_author.image}}
                output.results.fail['GS001-DEPR-AIMG-2'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AIMG-2'].failures.length.should.eql(1);

                // {{error.statusCode}}
                output.results.fail['GS001-DEPR-ESC'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-ESC'].failures.length.should.eql(2);

                // {{@blog.*}}
                output.results.fail['GS001-DEPR-BLOG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BLOG'].failures.length.should.eql(1);

                // {{@blog.permalinks}}
                output.results.fail['GS001-DEPR-BPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-BPL'].failures.length.should.eql(1);

                // {{@site.permalinks}}
                output.results.fail['GS001-DEPR-SPL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-SPL'].failures.length.should.eql(1);

                // {{lang}}
                output.results.fail['GS001-DEPR-LANG'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-LANG'].failures.length.should.eql(1);

                // {{#each}} helper usage warning
                output.results.fail['GS001-DEPR-EACH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-EACH'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Array().with.lengthOf(46);

                done();
            }).catch(done);
        });

        it('[success] should show no error if no deprecated helpers used', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/canary/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();
                output.results.pass.should.be.an.Array().with.lengthOf(92);

                done();
            }).catch(done);
        });

        it('[mixed] should pass and fail when some rules pass and others fail', function (done) {
            utils.testCheck(thisCheck, '001-deprecations/canary/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys(
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

                output.results.fail['GS001-DEPR-AUTH-INCL'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH-INCL'].failures.length.should.eql(1);

                output.results.fail['GS001-DEPR-AUTH'].should.be.a.ValidFailObject();
                output.results.fail['GS001-DEPR-AUTH'].failures.length.should.eql(1);

                output.results.pass.should.be.an.Array().with.lengthOf(58);

                done();
            }).catch(done);
        });
    });
});
