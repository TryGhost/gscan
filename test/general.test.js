const path = require('path');
const fs = require('fs-extra');
const sinon = require('sinon');
const errors = require('@tryghost/errors');
const {check, checkZip} = require('../lib');
const themePath = require('./utils').themePath;

process.env.NODE_ENV = 'testing';

describe('Check zip', function () {
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
            return check(themePath('030-assets/ignored'), {checkVersion: 'v1'})
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

    describe('throws errors', function () {
        it('non existing file', async function () {
            try {
                await checkZip(themePath('030-assets/do_not_exist.zip'));
                should.fail(checkZip, 'Should have errored');
            } catch (err) {
                should.exist(err);

                should.exist(err.errorType);
                should.equal(err.errorType, 'ValidationError');

                should.exist(err.message);
                should.equal(err.message, 'Failed to read zip file');

                should.exist(err.help);
                should.equal(err.help, 'Your zip file might be corrupted, try unzipping and zipping again.');
            }
        });

        it('wraps non-ghost errors as a check-zip validation error', async function () {
            const isGhostErrorStub = sinon.stub(errors.utils, 'isGhostError').returns(false);

            try {
                await checkZip(themePath('030-assets/do_not_exist.zip'));
                should.fail(checkZip, 'Should have errored');
            } catch (err) {
                should.exist(err);
                should.equal(err.errorType, 'ValidationError');
                should.equal(err.message, 'Failed to check zip file');
                should.equal(err.context, 'do_not_exist');
            } finally {
                isGhostErrorStub.restore();
            }
        });
    });

    describe('successful zip checking', function () {
        it('removes extracted directory by default', async function () {
            const theme = await checkZip(themePath('030-assets/ignored.zip'), {checkVersion: 'v1'});

            theme.files.length.should.eql(1);
            theme.files[0].file.should.match(/default\.hbs/);

            const extractedThemePathExists = await fs.pathExists(theme.path);
            extractedThemePathExists.should.eql(false);
        });

        it('accepts an object zip input', async function () {
            const theme = await checkZip({
                path: themePath('030-assets/ignored.zip'),
                name: 'ignored.zip'
            }, {keepExtractedDir: true, checkVersion: 'v1'});

            theme.files.length.should.eql(1);
            theme.files[0].file.should.match(/default\.hbs/);
        });
    });
});
