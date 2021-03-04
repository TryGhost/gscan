const themePath = require('./utils').themePath;
const checker = require('../lib/checker');

process.env.NODE_ENV = 'testing';

describe('Checker', function () {
    it('returns a valid theme when running all checks', function (done) {
        checker(themePath('is-empty'), {checkVersion: 'v2'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
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
        checker(themePath('is-empty'), {checkVersion: 'v1'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
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
        checker(themePath('is-empty'), {checkVersion: 'v2'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
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
        checker(themePath('is-empty'), {checkVersion: 'v3'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
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

    it('checks for a latest (v4) version if passed', function (done) {
        checker(themePath('is-empty'), {checkVersion: 'canary'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(105);
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

            theme.checkedVersion.should.equal('4.x');
            done();
        }).catch(done);
    });

    it('checks for a canary (v4) version if passed', function (done) {
        checker(themePath('is-empty'), {checkVersion: 'canary'}).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(105);
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

            theme.checkedVersion.should.equal('4.x');
            done();
        }).catch(done);
    });

    it('should not follow symlinks', function (done) {
        checker(themePath('030-assets/symlink2')).then((theme) => {
            theme.should.be.a.ValidThemeObject();
            theme.files.should.containEql({file: 'assets/mysymlink', ext: undefined});
            theme.results.fail.should.have.ownProperty('GS030-ASSET-SYM');

            done();
        }).catch(done);
    });
});
