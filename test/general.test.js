const path = require('path');
const fs = require('fs/promises');
const errors = require('@tryghost/errors');
const {check, checkZip} = require('../lib');
const utils = require('./utils');
const themePath = utils.themePath;

process.env.NODE_ENV = 'testing';

describe('Check zip', function () {
    describe('ensure ignored assets are getting ignored', function () {
        it('default', function () {
            return checkZip(themePath('030-assets/ignored.zip'), {keepExtractedDir: true, checkVersion: 'v1'})
                .then((theme) => {
                    expect(theme.files.length).toEqual(1);
                    expect(theme.files[0].file).toMatch(/default\.hbs/);

                    return fs.readdir(path.join(theme.path, 'ignored', 'assets'));
                })
                .then(function (assetFiles) {
                    expect(assetFiles).toEqual(['default.hbs']);
                });
        });

        it('Don\'t remove files if theme not in tmp directory', function () {
            return check(themePath('030-assets/ignored'), {checkVersion: 'v1'})
                .then((theme) => {
                    expect(theme.files.length).toEqual(1);
                    expect(theme.files[0].file).toMatch(/default\.hbs/);

                    return fs.readdir(path.join(theme.path, 'assets'));
                })
                .then(function (assetFiles) {
                    expect(assetFiles).toEqual(['Thumbs.db', 'default.hbs']);
                });
        });
    });

    describe('throws errors', function () {
        it('non existing file', async function () {
            try {
                await checkZip(themePath('030-assets/do_not_exist.zip'));
                throw new Error('Should have errored');
            } catch (err) {
                expect(err).toBeDefined();

                expect(err.errorType).toBeDefined();
                expect(err.errorType).toEqual('ValidationError');

                expect(err.message).toBeDefined();
                expect(err.message).toEqual('Failed to read zip file');

                expect(err.help).toBeDefined();
                expect(err.help).toEqual('Your zip file might be corrupted, try unzipping and zipping again.');
            }
        });

        it('wraps non-ghost errors as a check-zip validation error', async function () {
            const isGhostErrorStub = vi.spyOn(errors.utils, 'isGhostError').mockReturnValue(false);

            try {
                await checkZip(themePath('030-assets/do_not_exist.zip'));
                throw new Error('Should have errored');
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.errorType).toEqual('ValidationError');
                expect(err.message).toEqual('Failed to check zip file');
                expect(err.context).toEqual('do_not_exist');
            } finally {
                isGhostErrorStub.mockRestore();
            }
        });
    });

    describe('successful zip checking', function () {
        it('removes extracted directory by default', async function () {
            const theme = await checkZip(themePath('030-assets/ignored.zip'), {checkVersion: 'v1'});

            expect(theme.files.length).toEqual(1);
            expect(theme.files[0].file).toMatch(/default\.hbs/);

            await expect(fs.access(theme.path)).rejects.toThrow();
        });

        it('removes extracted directory when checks fail', async function () {
            const readThemePath = require.resolve('../lib/read-theme');
            const originalReadTheme = require(readThemePath);
            const removeSpy = vi.spyOn(fs, 'rm');
            let removedPath;

            require.cache[readThemePath].exports = async function () {
                throw new Error('forced check failure');
            };

            try {
                await checkZip(themePath('030-assets/ignored.zip'), {checkVersion: 'v1'});
                throw new Error('Should have errored');
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.errorType).toEqual('ValidationError');
                expect(err.message).toEqual('Failed theme files check');

                expect(removeSpy).toHaveBeenCalledTimes(1);
                removedPath = removeSpy.mock.calls[0][0];
                expect(removedPath).toBeDefined();
            } finally {
                require.cache[readThemePath].exports = originalReadTheme;
                removeSpy.mockRestore();
            }

            await expect(fs.access(removedPath)).rejects.toThrow();
        });

        it('removes entire temp directory for nested zips', async function () {
            const theme = await checkZip(themePath('example.zip'), {checkVersion: 'v1'});

            expect(theme.files.length).toBeGreaterThan(0);

            await expect(fs.access(path.dirname(theme.path))).rejects.toThrow();
        });

        it('keeps extracted directory when keepExtractedDir is true', async function () {
            const theme = await checkZip(themePath('030-assets/ignored.zip'), {keepExtractedDir: true, checkVersion: 'v1'});

            expect(theme.files.length).toEqual(1);
            expect(theme.files[0].file).toMatch(/default\.hbs/);

            await expect(fs.access(theme.path)).resolves.not.toThrow();

            await fs.rm(theme.path, {recursive: true, force: true});
        });

        it('accepts an object zip input', async function () {
            const theme = await checkZip({
                path: themePath('030-assets/ignored.zip'),
                name: 'ignored.zip'
            }, {keepExtractedDir: true, checkVersion: 'v1'});

            expect(theme.files.length).toEqual(1);
            expect(theme.files[0].file).toMatch(/default\.hbs/);

            await fs.rm(theme.path, {recursive: true, force: true});
        });
    });
});
