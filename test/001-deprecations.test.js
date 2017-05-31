/*globals describe, it */
var should = require('should'),
    path = require('path'),
    themePath = require('./utils').themePath,
    checker = require('../lib/checker'),
    thisCheck = require('../lib/checks/001-deprecations'),
    utils = require('./utils'),
    format = require('../lib/format');

describe('001 Deprecations', function () {
    it('[failure] theme is invalid', function (done) {
        utils.testCheck(thisCheck, '001-deprecations/invalid').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().with.keys(
                'GS001-DEPR-PURL',
                'GS001-DEPR-MD',
                'GS001-DEPR-IMG',
                'GS001-DEPR-AIMG',
                'GS001-DEPR-PIMG',
                'GS001-DEPR-PPP',
                'GS001-DEPR-C0H',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG',
                'GS001-DEPR-CSS-AT',
                'GS001-DEPR-CSS-PA',
                'GS001-DEPR-CSS-PATS'
            );

            // pageUrl
            output.results.fail['GS001-DEPR-PURL'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-PURL'].failures.length.should.eql(2);

            // meta_description in <head>
            output.results.fail['GS001-DEPR-MD'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-MD'].failures.length.should.eql(1);

            // {{image}}
            output.results.fail['GS001-DEPR-IMG'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-IMG'].failures.length.should.eql(1);

            // {{author.image}}
            output.results.fail['GS001-DEPR-AIMG'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-AIMG'].failures.length.should.eql(1);

            // {{post.image}}
            output.results.fail['GS001-DEPR-PIMG'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-PIMG'].failures.length.should.eql(1);

            // {{@blog.cover}}
            output.results.fail['GS001-DEPR-BC'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-BC'].failures.length.should.eql(1);

            // {{author.cover}}
            output.results.fail['GS001-DEPR-AC'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-AC'].failures.length.should.eql(1);

            // {{tag.image}}
            output.results.fail['GS001-DEPR-TIMG'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-TIMG'].failures.length.should.eql(1);

            // {{@blog.posts_per_page}}
            output.results.fail['GS001-DEPR-PPP'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-PPP'].failures.length.should.eql(1);

            // {{content word="0"}}
            output.results.fail['GS001-DEPR-C0H'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-C0H'].failures.length.should.eql(2);

            // css class .page
            output.results.fail['GS001-DEPR-CSS-PA'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-CSS-PA'].failures.length.should.eql(2);

            // css class .page-template-{slug}
            output.results.fail['GS001-DEPR-CSS-PATS'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-CSS-PATS'].failures.length.should.eql(2);

            // css class .achive-template
            output.results.fail['GS001-DEPR-CSS-AT'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-CSS-AT'].failures.length.should.eql(1);

            output.results.pass.should.be.an.Object().which.is.empty();

            done();
        }).catch(done);
    });

    it('[success] should show no error if no deprecated helpers used', function (done) {
        utils.testCheck(thisCheck, '001-deprecations/valid').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().which.is.empty();
            output.results.pass.should.be.an.Array().with.lengthOf(13);

            done();
        }).catch(done);
    });

    it('[mixed] should pass and fail when some rules pass and others fail', function (done) {
        utils.testCheck(thisCheck, '001-deprecations/mixed').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().with.keys(
                'GS001-DEPR-PURL',
                'GS001-DEPR-MD',
                'GS001-DEPR-IMG',
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-TIMG',
                'GS001-DEPR-C0H'
            );

            output.results.fail['GS001-DEPR-PURL'].should.be.a.ValidFailObject();
            output.results.fail['GS001-DEPR-PURL'].failures.length.should.eql(2);
            output.results.pass.should.be.an.Array().with.lengthOf(6);

            done();
        }).catch(done);
    });
});
