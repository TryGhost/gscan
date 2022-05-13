const themePath = require('./utils').themePath;
const {check} = require('../lib/checker');

process.env.NODE_ENV = 'testing';

describe('Checker', function () {
    it('returns a valid theme when running all checks', function (done) {
        check(themePath('is-empty'), {checkVersion: 'v2'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(96);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS030-ASSET-REQ', 'GS030-ASSET-SYM');

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP',
                'GS010-PJ-KEYWORDS',
                'GS020-INDEX-REQ',
                'GS020-POST-REQ',
                'GS020-DEF-REC',
                'GS040-GH-REQ',
                'GS040-GF-REQ',
                'GS050-CSS-KGWW',
                'GS050-CSS-KGWF',
                'GS050-CSS-KGGC',
                'GS050-CSS-KGGR',
                'GS050-CSS-KGGI'
            );

            done();
        }).catch(done);
    });

    it('checks for v1 version if passed', function (done) {
        check(themePath('is-empty'), {checkVersion: 'v1'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(33);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS030-ASSET-REQ', 'GS030-ASSET-SYM');

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP',
                'GS020-INDEX-REQ',
                'GS020-POST-REQ',
                'GS020-DEF-REC',
                'GS040-GH-REQ',
                'GS040-GF-REQ'
            );

            theme.checkedVersion.should.equal('1.x');

            done();
        }).catch(done);
    });

    it('checks for a v2 version if passed', function (done) {
        check(themePath('is-empty'), {checkVersion: 'v2'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(96);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS030-ASSET-REQ', 'GS030-ASSET-SYM');

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP',
                'GS020-INDEX-REQ',
                'GS020-POST-REQ',
                'GS020-DEF-REC',
                'GS040-GH-REQ',
                'GS040-GF-REQ'
            );

            theme.checkedVersion.should.equal('2.x');

            done();
        }).catch(done);
    });

    it('checks for a v3 version if passed', function (done) {
        check(themePath('is-empty'), {checkVersion: 'v3'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(99);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS030-ASSET-REQ', 'GS030-ASSET-SYM', 'GS080-FEACH-POSTS', 'GS080-CARD-LAST4');

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP',
                'GS020-INDEX-REQ',
                'GS020-POST-REQ',
                'GS020-DEF-REC',
                'GS040-GH-REQ',
                'GS040-GF-REQ'
            );

            theme.checkedVersion.should.equal('3.x');

            done();
        }).catch(done);
    });

    it('checks for a v4 version if passed', function (done) {
        check(themePath('is-empty'), {checkVersion: 'v4'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(109);
            theme.results.pass.should.eql([
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
                'GS001-DEPR-AC-2',
                'GS001-DEPR-AC-3',
                'GS001-DEPR-AIMG-2',
                'GS001-DEPR-AIMG-3',
                'GS001-DEPR-PAC-2',
                'GS001-DEPR-PAC-3',
                'GS001-DEPR-PAIMG-2',
                'GS001-DEPR-PAIMG-3',
                'GS001-DEPR-CON-AC-2',
                'GS001-DEPR-CON-AC-3',
                'GS001-DEPR-CON-AIMG-2',
                'GS001-DEPR-CON-AIMG-3',
                'GS001-DEPR-CON-PAC-2',
                'GS001-DEPR-CON-PAC-3',
                'GS001-DEPR-CON-PAIMG-2',
                'GS001-DEPR-CON-PAIMG-3',
                'GS001-DEPR-ESC',
                'GS001-DEPR-LABS-MEMBERS',
                'GS001-DEPR-CURR-SYM',
                'GS001-DEPR-SITE-LANG',
                'GS005-TPL-ERR',
                'GS030-ASSET-REQ',
                'GS030-ASSET-SYM',
                'GS060-JS-GUA',
                'GS070-VALID-TRANSLATIONS',
                'GS080-FEACH-POSTS',
                'GS080-CARD-LAST4',
                'GS080-FEACH-PV',
                'GS090-NO-IMG-URL-IN-CONDITIONALS',
                'GS090-NO-UNKNOWN-CUSTOM-THEME-SETTINGS',
                'GS090-NO-UNKNOWN-CUSTOM-THEME-SELECT-VALUE-IN-MATCH',
                'GS090-NO-PRODUCTS-HELPER',
                'GS090-NO-PRODUCT-DATA-HELPER',
                'GS090-NO-PRODUCTS-DATA-HELPER'
            ]);

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP',
                'GS020-INDEX-REQ',
                'GS020-POST-REQ',
                'GS020-DEF-REC',
                'GS040-GH-REQ',
                'GS040-GF-REQ'
            );

            theme.checkedVersion.should.equal('4.x');
            done();
        }).catch(done);
    });

    it('checks for a v5 version if passed', function (done) {
        check(themePath('is-empty'), {checkVersion: 'v5'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(112);
            theme.results.pass.should.eql([
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
                'GS001-DEPR-AC-2',
                'GS001-DEPR-AC-3',
                'GS001-DEPR-AIMG-2',
                'GS001-DEPR-AIMG-3',
                'GS001-DEPR-PAC-2',
                'GS001-DEPR-PAC-3',
                'GS001-DEPR-PAIMG-2',
                'GS001-DEPR-PAIMG-3',
                'GS001-DEPR-CON-AC-2',
                'GS001-DEPR-CON-AC-3',
                'GS001-DEPR-CON-AIMG-2',
                'GS001-DEPR-CON-AIMG-3',
                'GS001-DEPR-CON-PAC-2',
                'GS001-DEPR-CON-PAC-3',
                'GS001-DEPR-CON-PAIMG-2',
                'GS001-DEPR-CON-PAIMG-3',
                'GS001-DEPR-ESC',
                'GS001-DEPR-LABS-MEMBERS',
                'GS001-DEPR-CURR-SYM',
                'GS001-DEPR-SITE-LANG',
                'GS005-TPL-ERR',
                'GS030-ASSET-REQ',
                'GS030-ASSET-SYM',
                'GS060-JS-GUA',
                'GS070-VALID-TRANSLATIONS',
                'GS080-FEACH-POSTS',
                'GS080-CARD-LAST4',
                'GS080-FEACH-PV',
                'GS090-NO-IMG-URL-IN-CONDITIONALS',
                'GS090-NO-UNKNOWN-CUSTOM-THEME-SETTINGS',
                'GS090-NO-UNKNOWN-CUSTOM-THEME-SELECT-VALUE-IN-MATCH',
                'GS090-NO-PRODUCTS-HELPER',
                'GS090-NO-PRODUCT-DATA-HELPER',
                'GS090-NO-PRODUCTS-DATA-HELPER',
                'GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT',
                'GS090-NO-MEMBER-PRODUCTS-DATA-HELPER',
                'GS090-NO-PRICE-DATA-HELPER'
            ]);

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ',
                'GS010-PJ-PARSE',
                'GS010-PJ-NAME-REQ',
                'GS010-PJ-NAME-LC',
                'GS010-PJ-NAME-HY',
                'GS010-PJ-VERSION-SEM',
                'GS010-PJ-VERSION-REQ',
                'GS010-PJ-AUT-EM-VAL',
                'GS010-PJ-AUT-EM-REQ',
                'GS010-PJ-CONF-PPP',
                'GS020-INDEX-REQ',
                'GS020-POST-REQ',
                'GS020-DEF-REC',
                'GS040-GH-REQ',
                'GS040-GF-REQ'
            );

            theme.checkedVersion.should.equal('5.x');
            done();
        }).catch(done);
    });

    it('checks for a latest (v4) version if canary is passed', function (done) {
        check(themePath('is-empty'), {checkVersion: 'canary'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(109);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS030-ASSET-REQ', 'GS030-ASSET-SYM');

            theme.results.fail.should.be.an.Object().with.keys(
            );

            theme.checkedVersion.should.equal('4.x');
            done();
        }).catch(done);
    });

    it('checks for a canary (v4) version if passed', function (done) {
        check(themePath('is-empty'), {checkVersion: 'canary'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', ext: '.md', symlink: false}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(109);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS030-ASSET-REQ', 'GS030-ASSET-SYM');

            theme.results.fail.should.be.an.Object().with.keys(
            );

            theme.checkedVersion.should.equal('4.x');
            done();
        }).catch(done);
    });

    it('should not follow symlinks', function (done) {
        check(themePath('030-assets/symlink2')).then((theme) => {
            theme.should.be.a.ValidThemeObject();
            theme.files.should.containEql({file: 'assets/mysymlink', ext: undefined, symlink: true});
            theme.results.fail.should.have.ownProperty('GS030-ASSET-SYM');

            done();
        }).catch(done);
    });
});
