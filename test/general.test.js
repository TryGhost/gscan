const path = require('path');
const fs = require('fs-extra');
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
            const isGhostErrorStub = vi.spyOn(errors.utils, 'isGhostError').mockReturnValue(false);

            try {
                await checkZip(themePath('030-assets/do_not_exist.zip'));
                should.fail(checkZip, 'Should have errored');
            } catch (err) {
                should.exist(err);
                should.equal(err.errorType, 'ValidationError');
                should.equal(err.message, 'Failed to check zip file');
                should.equal(err.context, 'do_not_exist');
            } finally {
                isGhostErrorStub.mockRestore();
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

        it('removes extracted directory when checks fail', async function () {
            const readThemePath = require.resolve('../lib/read-theme');
            const originalReadTheme = require(readThemePath);
            const removeSpy = vi.spyOn(fs, 'remove');
            let removedPath;

            require.cache[readThemePath].exports = async function () {
                throw new Error('forced check failure');
            };

            try {
                await checkZip(themePath('030-assets/ignored.zip'), {checkVersion: 'v1'});
                should.fail(checkZip, 'Should have errored');
            } catch (err) {
                should.exist(err);
                should.equal(err.errorType, 'ValidationError');
                should.equal(err.message, 'Failed theme files check');

                expect(removeSpy).toHaveBeenCalledTimes(1);
                removedPath = removeSpy.mock.calls[0][0];
                should.exist(removedPath);
            } finally {
                require.cache[readThemePath].exports = originalReadTheme;
                removeSpy.mockRestore();
            }

            const extractedThemePathExists = await fs.pathExists(removedPath);
            extractedThemePathExists.should.eql(false);
        });

        it('removes entire temp directory for nested zips', async function () {
            const theme = await checkZip(themePath('example.zip'), {checkVersion: 'v1'});

            theme.files.length.should.be.above(0);

            const extractedParentPathExists = await fs.pathExists(path.dirname(theme.path));
            extractedParentPathExists.should.eql(false);
        });

        it('keeps extracted directory when keepExtractedDir is true', async function () {
            const theme = await checkZip(themePath('030-assets/ignored.zip'), {keepExtractedDir: true, checkVersion: 'v1'});

            theme.files.length.should.eql(1);
            theme.files[0].file.should.match(/default\.hbs/);

            const extractedThemePathExists = await fs.pathExists(theme.path);
            extractedThemePathExists.should.eql(true);

            await fs.remove(theme.path);
        });

        it('accepts an object zip input', async function () {
            const theme = await checkZip({
                path: themePath('030-assets/ignored.zip'),
                name: 'ignored.zip'
            }, {keepExtractedDir: true, checkVersion: 'v1'});

            theme.files.length.should.eql(1);
            theme.files[0].file.should.match(/default\.hbs/);

            await fs.remove(theme.path);
        });
    });
});
