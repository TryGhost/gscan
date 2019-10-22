const sinon = require('sinon');
const path = require('path');
const rewire = require('rewire');

const fs = require('fs-extra');
const checkZip = require('../lib').checkZip;
const themePath = require('./utils').themePath;
const readZip = require('../lib/read-zip');
const readTheme = rewire('../lib/read-theme');
const checker = require('../lib/checker');

const sandbox = sinon.sandbox.create();

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
        fs.remove('./test/tmp', function (err) {
            done(err);
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Flat example: zip without folder should unzip and callback with a path', function (done) {
        testReadZip('flat-example.zip')
            .then((zip) => {
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
        testReadZip('example.zip')
            .then((zip) => {
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
        testReadZip('bad-example.zip')
            .then((zip) => {
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
        testReadZip('nested-example.zip')
            .then((zip) => {
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
        testReadZip('multi-example.zip')
            .then((zip) => {
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
        testReadZip('not-a-theme.zip')
            .then((zip) => {
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
            return checkZip(themePath('030-assets/ignored.zip'), {keepExtractedDir: true, checkVersion: 'v1'})
                .then((theme) => {
                    theme.files.length.should.eql(1);
                    theme.files[0].file.should.match(/default\.hbs/);

                    return fs.readdir(path.join(theme.path, 'ignored', 'assets'));
                })
                .then(function (assetFiles) {
                    assetFiles.should.eql(['default.hbs']);
                });
        });

        it('Don\'t remove files if theme not in tmp directory', function () {
            return checker(themePath('030-assets/ignored'), {checkVersion: 'v1'})
                .then((theme) => {
                    theme.files.length.should.eql(1);
                    theme.files[0].file.should.match(/default\.hbs/);

                    return fs.readdir(path.join(theme.path, 'assets'));
                })
                .then(function (assetFiles) {
                    assetFiles.should.eql(['Thumbs.db', 'default.hbs']);
                });
        });
    });
});

describe('Read Hbs Files', function () {
    after(function () {
        sandbox.restore();
    });

    it('can read partials with POSIX paths', function (done) {
        // This roughly matches Example I
        const exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials/mypartial.hbs', ext: '.hbs'},
            {file: 'partials/subfolder/test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        sandbox.stub(fs, 'readFile').returns(Promise.resolve(''));

        readTheme.__get__('readFiles')({
            files: exampleI,
            path: 'fake/example-i'
        }).then((result) => {
            result.partials.should.be.an.Array().with.lengthOf(2);
            result.partials.should.eql(['mypartial', 'subfolder/test']);
            done();
        }).catch(done);
    });

    it('can read partials with windows paths', function (done) {
        // This matches Example I, but on Windows
        const exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials\\mypartial.hbs', ext: '.hbs'},
            {file: 'partials\\subfolder\\test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        readTheme.__get__('readFiles')({
            files: exampleI,
            path: 'fake\\example-i'
        })
            .then((result) => {
                result.partials.should.be.an.Array().with.lengthOf(2);
                result.partials.should.eql(['mypartial', 'subfolder\\test']);
                done();
            }).catch(done);
    });
});

