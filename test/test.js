/*globals describe, it */
var should    = require('should'),
    fs        = require('fs-extra'),
    themePath = require('./utils').themePath,
    readZip   = require('../lib/read-zip'),
    readTheme = require('../lib/read-theme');

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
        readTheme(themePath('example-a')).then(function (result) {
            should.exist(result);
            result.should.be.an.Object;
            result.should.have.properties(['path', 'files']);
            result.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);
            done();
        });
    });
});