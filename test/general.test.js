/*globals describe, it */
var should    = require('should'),
    sinon     = require('sinon'),
    rewire    = require('rewire'),
    _         = require('lodash'),
    pfs       = require('../lib/promised-fs'),
    themePath = require('./utils').themePath,
    readZip   = require('../lib/read-zip'),
    readTheme = rewire('../lib/read-theme'),
    checker   = require('../lib/checker'),

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
    return readZip({path: themePath(name), name: name})
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

describe('Read theme', function () {
    it('returns correct result for example-a', function (done) {
        readTheme(themePath('example-a')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);
            done();
        });
    });

    it('Can read partials (example-i)', function (done) {
        readTheme(themePath('example-i')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.be.an.Array().with.lengthOf(6);
            var fileNames = _.map(theme.files, 'file');

            fileNames.should.containEql('index.hbs');
            fileNames.should.containEql('package.json');
            fileNames.should.containEql('partialsbroke.hbs');
            fileNames.should.containEql('partials/mypartial.hbs');
            fileNames.should.containEql('partials/subfolder/test.hbs');
            fileNames.should.containEql('post.hbs');

            done();
        });
    });
});

describe('Read Hbs Files', function () {
    it('can read partials with POSIX paths', function (done) {
        // This roughly matches Example I
        var exampleI = [
            { file: 'index.hbs', ext: '.hbs' },
            { file: 'package.json', ext: '.json' },
            { file: 'partialsbroke.hbs', ext: '.hbs' },
            { file: 'partials/mypartial.hbs', ext: '.hbs' },
            { file: 'partials/subfolder/test.hbs', ext: '.hbs' },
            { file: 'post.hbs', ext: '.hbs' }
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
           { file: 'index.hbs', ext: '.hbs' },
           { file: 'package.json', ext: '.json' },
           { file: 'partialsbroke.hbs', ext: '.hbs' },
           { file: 'partials\\mypartial.hbs', ext: '.hbs' },
           { file: 'partials\\subfolder\\test.hbs', ext: '.hbs' },
           { file: 'post.hbs', ext: '.hbs' }
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
    it('returns a valid theme when running all checks for example-a', function (done) {
        checker(themePath('example-a')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(4);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS010-PJ-VAL', 'GS030-ASSET-REQ', 'GS030-ASSET-SYM');

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ', 'GS020-INDEX-REQ', 'GS020-POST-REQ',
                'GS020-DEF-REC', 'GS040-GH-REQ', 'GS040-GF-REQ'
            );

            done();
        });
    });

    it('should not follow symlinks', function (done) {
        checker(themePath('example-k')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();
            theme.files.should.containEql({file: 'assets/mysymlink', ext: undefined});
            theme.results.fail.should.containEql('GS030-ASSET-SYM');

            done();
        });
    });
});