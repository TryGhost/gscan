/*globals describe, it */
var should    = require('should'),
    fs        = require('fs-extra'),
    themePath = require('./utils').themePath,
    readZip   = require('../lib/read-zip'),
    readTheme = require('../lib/read-theme'),
    checker   = require('../lib/checker');

process.env.NODE_ENV = 'testing';

/**
 * Response object from .check is:
 * {
 *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */

describe('Zip file handler can read a zip file', function () {
    after(function (done) {
        fs.remove('./test/tmp', function (err) {
            done(err);
        });
    });

    it('should unzip and callback with a path, resolving base dir', function (done) {
        readZip({path: themePath('example.zip'), name: 'example.zip'}).then(function (zip) {
            zip.path.should.be.a.String;
            zip.origPath.should.be.a.String;
            zip.name.should.be.a.String;
            zip.origName.should.be.a.String;
            zip.path.should.match(/example$/);
            zip.path.should.not.eql(zip.origPath);
            zip.origName.should.match(/example$/);
            done();
        });
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
});

describe('Checker', function () {
    it('returns a valid theme when running all checks for example-a', function (done) {
        checker(themePath('example-a')).then(function (theme) {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);

            theme.results.pass.should.be.an.Array().with.lengthOf(3);
            theme.results.pass.should.containEql('GS005-TPL-ERR', 'GS010-PJ-VAL', 'GS030-ASSET-REQ');

            theme.results.fail.should.be.an.Object().with.keys(
                'GS010-PJ-REQ', 'GS020-INDEX-REQ', 'GS020-POST-REQ',
                'GS020-DEF-REC', 'GS040-GH-REQ', 'GS040-GF-REQ'
            );

            done();
        });
    });
});