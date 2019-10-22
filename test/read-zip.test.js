const sinon = require('sinon');
const fs = require('fs-extra');
const themePath = require('./utils').themePath;
const readZip = require('../lib/read-zip');

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
    let sandbox;

    before(function () {
        sandbox = sinon.createSandbox();
    });

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
