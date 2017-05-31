/*globals describe, it */
var should = require('should'),
    path = require('path'),
    themePath = require('./utils').themePath,
    checker = require('../lib/checker'),
    thisCheck = require('../lib/checks/001-deprecations'),
    utils = require('./utils'),
    format = require('../lib/format');

describe('Deprecations', function () {
    it('should error if {{pageUrl}} helper is used instead of {{page_url}}', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-PURL'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{meta_description}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-MD'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{image}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-IMG'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{author.image}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-AIMG'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{post.image}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-PIMG'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{@blog.cover}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-BC'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{author.cover}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-AC'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{tag.image}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-TIMG'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{@blog.posts_per_page}} helper is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-PPP'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('should error if {{content word="0"}} hack is used', function (done) {
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
                'GS001-DEPR-PIMG',
                'GS001-DEPR-BC',
                'GS001-DEPR-AC',
                'GS001-DEPR-TIMG'
            );

            output.results.fail['GS001-DEPR-C0H'].should.be.a.ValidFailObject();

            done();
        }).catch(done);
    });
    it('[SUCCESS] should show no error if no deprecated helpers used', function (done) {
        utils.testCheck(thisCheck, '001-deprecations/valid').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().which.is.empty();
            output.results.pass.should.be.an.Array().with.lengthOf(10);

            done();
        }).catch(done);
    });
});
