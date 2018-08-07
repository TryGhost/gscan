var should = require('should'),
    sinon = require('sinon'),
    path = require('path'),
    rewire = require('rewire'),
    _ = require('lodash'),
    pfs = require('../lib/promised-fs'),
    checkZip = require('../lib').checkZip,
    themePath = require('./utils').themePath,
    readZip = require('../lib/read-zip'),
    readTheme = rewire('../lib/read-theme'),
    checker = require('../lib/checker'),
    format = require('../lib/format'),

    sandbox = sinon.sandbox.create();

process.env.NODE_ENV = 'testing';

/**
 * Response object from .check is:
 * {
 *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */

function testReadZip(name) {
    return readZip({path: themePath(name), name: name});
}

describe('Zip file handler can read zip files', function () {
    after(function (done) {
        pfs.remove('./test/tmp', function (err) {
            done(err);
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Flat example: zip without folder should unzip and callback with a path', function (done) {
        testReadZip('flat-example.zip').then(function (zip) {
            zip.path.should.be.a.String;
            zip.origPath.should.be.a.String;
            zip.name.should.be.a.String;
            zip.origName.should.be.a.String;
            zip.path.should.not.match(/flat-example$/);
            zip.path.should.eql(zip.origPath);
            zip.origName.should.eql('flat-example');
            done();
        }).catch(done);
    });

    it('Simple example: zip with same-name folder should unzip and callback with a path, resolving base dir', function (done) {
        testReadZip('example.zip').then(function (zip) {
            zip.path.should.be.a.String;
            zip.origPath.should.be.a.String;
            zip.name.should.be.a.String;
            zip.origName.should.be.a.String;
            zip.path.should.match(/\/example$/);
            zip.path.should.not.eql(zip.origPath);
            zip.origName.should.eql('example');
            done();
        }).catch(done);
    });

    it('Bad example: zip with dif-name folder should unzip and callback with a path, resolving base dir', function (done) {
        testReadZip('bad-example.zip').then(function (zip) {
            zip.path.should.be.a.String;
            zip.origPath.should.be.a.String;
            zip.name.should.be.a.String;
            zip.origName.should.be.a.String;
            zip.path.should.match(/\/bad-example-folder/);
            zip.path.should.not.eql(zip.origPath);
            zip.origName.should.eql('bad-example');
            done();
        }).catch(done);
    });

    it('Nested example: zip with nested folders should unzip and callback with a path, resolving base dir', function (done) {
        testReadZip('nested-example.zip').then(function (zip) {
            zip.path.should.be.a.String;
            zip.origPath.should.be.a.String;
            zip.name.should.be.a.String;
            zip.origName.should.be.a.String;
            zip.path.should.match(/\/nested-example\/bad-example-folder$/);
            zip.path.should.not.eql(zip.origPath);
            zip.origName.should.eql('nested-example');
            done();
        }).catch(done);
    });

    it('Multi example: complex zip should unzip and callback with a path, resolving base dir', function (done) {
        testReadZip('multi-example.zip').then(function (zip) {
            zip.path.should.be.a.String;
            zip.origPath.should.be.a.String;
            zip.name.should.be.a.String;
            zip.origName.should.be.a.String;
            zip.path.should.match(/\/multi-example\/theme\/theme-name/);
            zip.path.should.not.eql(zip.origPath);
            zip.origName.should.eql('multi-example');
            done();
        }).catch(done);
    });

    // If the zip file does not contain index.hbs, we return the standard path, and our checks will report the errors
    it('No index.hbs example: zip should unzip and callback with a path', function (done) {
        testReadZip('not-a-theme.zip').then(function (zip) {
            zip.path.should.be.a.String;
            zip.origPath.should.be.a.String;
            zip.name.should.be.a.String;
            zip.origName.should.be.a.String;
            zip.path.should.not.match(/not-a-theme$/);
            zip.path.should.eql(zip.origPath);
            zip.origName.should.eql('not-a-theme');
            done();
        }).catch(done);
    });
});

describe('check zip', function () {
    describe('ensure ignored assets are getting ignored', function () {
        it('default', function () {
            return checkZip(themePath('030-assets/ignored.zip'), {keepExtractedDir: true})
                .then(function (theme) {
                    theme.files.length.should.eql(1);
                    theme.files[0].file.should.match(/default\.hbs/);

                    return pfs.readDir(path.join(theme.path, 'ignored', 'assets'));
                })
                .then(function (assetFiles) {
                    assetFiles.should.eql(['default.hbs']);
                });
        });

        it('Don\'t remove files if theme not in tmp directory', function () {
            return checker(themePath('030-assets/ignored'))
                .then(function (theme) {
                    theme.files.length.should.eql(1);
                    theme.files[0].file.should.match(/default\.hbs/);

                    return pfs.readDir(path.join(theme.path, 'assets'));
                })
                .then(function (assetFiles) {
                    assetFiles.should.eql(['Thumbs.db', 'default.hbs']);
                });
        });
    });
});

describe('Read theme', function () {
    it('returns correct result', function (done) {
        readTheme(themePath('is-empty')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);
            done();
        });
    });

    it('Can read partials', function (done) {
        readTheme(themePath('theme-with-partials')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.be.an.Array().with.lengthOf(7);

            var fileNames = _.map(theme.files, function (file) {
                return _.pickBy(file, function (value, key) {
                    return key === 'file' || key === 'ext';
                });
            });

            fileNames.should.containEql({file: 'index.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'package.json', ext: '.json'});
            fileNames.should.containEql({file: 'partialsbroke.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'partials/mypartial.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'partials/subfolder/test.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'post.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'logo.new.hbs', ext: '.hbs'});

            done();
        });
    });

    it('Can extract custom templates', function (done) {
        readTheme(themePath('theme-with-custom-templates')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.be.an.Array().with.lengthOf(11);
            theme.partials.length.should.eql(0);
            theme.templates.all.length.should.eql(9);
            theme.templates.custom.length.should.eql(4);

            // ensure we don't change the structure of theme.files
            theme.files[0].file.should.eql('assets/ignoreme.hbs');
            theme.files[0].ext.should.eql('.hbs');
            theme.files[0].content.should.eql('ignoreme');
            should.exist(theme.files[0].compiled);

            theme.files[1].file.should.eql('custom/test.hbs');
            theme.files[1].ext.should.eql('.hbs');
            theme.files[1].content.should.eql('test');
            should.exist(theme.files[1].compiled);

            theme.files[2].file.should.eql('custom-My-Post.hbs');
            theme.files[2].ext.should.eql('.hbs');
            theme.files[2].content.should.eql('content');
            should.exist(theme.files[2].compiled);

            theme.templates.all.should.eql([
                'custom/test',
                'custom-My-Post',
                'custom-about',
                'page-1',
                'page',
                'podcast/rss',
                'post-partials/footer',
                'post-welcome-ghost',
                'post'
            ]);

            _.map(theme.templates.custom, 'filename').should.eql([
                'custom-My-Post',
                'custom-about',
                'page-1',
                'post-welcome-ghost'
            ]);

            theme.templates.custom[0].filename.should.eql('custom-My-Post');
            theme.templates.custom[0].name.should.eql('My Post');
            theme.templates.custom[0].for.should.eql(['page', 'post']);
            should.not.exist(theme.templates.custom[0].slug);

            theme.templates.custom[1].filename.should.eql('custom-about');
            theme.templates.custom[1].name.should.eql('About');
            theme.templates.custom[1].for.should.eql(['page', 'post']);
            should.not.exist(theme.templates.custom[1].slug);

            theme.templates.custom[2].filename.should.eql('page-1');
            theme.templates.custom[2].name.should.eql('1');
            theme.templates.custom[2].for.should.eql(['page']);
            theme.templates.custom[2].slug.should.eql('1');

            theme.templates.custom[3].filename.should.eql('post-welcome-ghost');
            theme.templates.custom[3].name.should.eql('Welcome Ghost');
            theme.templates.custom[3].for.should.eql(['post']);
            theme.templates.custom[3].slug.should.eql('welcome-ghost');

            done();
        });
    });
});

describe('Read Hbs Files', function () {
    after(function () {
        sandbox.restore();
    });

    it('can read partials with POSIX paths', function (done) {
        // This roughly matches Example I
        var exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials/mypartial.hbs', ext: '.hbs'},
            {file: 'partials/subfolder/test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        sandbox.stub(pfs, 'readFile').returns(Promise.resolve(''));

        readTheme.__get__('readHbsFiles')({
            files: exampleI,
            path: 'fake/example-i'
        }).then(function (result) {
            result.partials.should.be.an.Array().with.lengthOf(2);
            result.partials.should.eql(['mypartial', 'subfolder/test']);
            done();
        });
    });

    it('can read partials with windows paths', function (done) {
        // This matches Example I, but on Windows
        var exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials\\mypartial.hbs', ext: '.hbs'},
            {file: 'partials\\subfolder\\test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        readTheme.__get__('readHbsFiles')({
            files: exampleI,
            path: 'fake\\example-i'
        })
            .then(function (result) {
                result.partials.should.be.an.Array().with.lengthOf(2);
                result.partials.should.eql(['mypartial', 'subfolder\\test']);
                done();
            });
    });
});

describe('Checker', function () {
    it('returns a valid theme when running all checks', function (done) {
        checker(themePath('is-empty')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(31);
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

            done();
        });
    });

    it('should not follow symlinks', function (done) {
        checker(themePath('030-assets/symlink2')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();
            theme.files.should.containEql({file: 'assets/mysymlink', ext: undefined});
            theme.results.fail.should.containEql('GS030-ASSET-SYM');

            done();
        });
    });
});

describe('format', function () {
    it('assert sorting', function (done) {
        checker(themePath('005-compile/invalid')).then(function (theme) {
            theme = format(theme);

            theme.results.error[0].fatal.should.eql(true);
            theme.results.error[1].fatal.should.eql(false);
            theme.results.error[8].fatal.should.eql(false);

            done();
        });
    });

    it('assert sorting', function (done) {
        checker(themePath('is-empty')).then(function (theme) {
            theme = format(theme);

            theme.results.error[0].fatal.should.eql(true);
            theme.results.error[1].fatal.should.eql(true);
            theme.results.error[2].fatal.should.eql(false);
            theme.results.error[8].fatal.should.eql(false);
            theme.results.error[9].fatal.should.eql(false);
            theme.results.error[10].fatal.should.eql(false);

            done();
        });
    });
});
