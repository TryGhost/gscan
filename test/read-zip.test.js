const fs = require('fs/promises');
const errors = require('@tryghost/errors');
const utils = require('./utils');
const readZip = require('../lib/read-zip');
const themePath = utils.themePath;

function loadReadZipWithExtract(extract) {
    const zipModulePath = require.resolve('@tryghost/zip');
    const readZipModulePath = require.resolve('../lib/read-zip');
    const originalZipExports = require.cache[zipModulePath].exports;

    delete require.cache[readZipModulePath];
    require.cache[zipModulePath].exports = {extract};

    return {
        readZip: require('../lib/read-zip'),
        restore() {
            require.cache[zipModulePath].exports = originalZipExports;
            delete require.cache[readZipModulePath];
            require('../lib/read-zip');
        }
    };
}

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
    const tempDirs = [];

    afterAll(async function () {
        await Promise.all(tempDirs.map(dir => fs.rm(dir, {recursive: true, force: true})));
    });

    it('Flat example: zip without folder should unzip and callback with a path', function () {
        return testReadZip('flat-example.zip')
            .then((zip) => {
                tempDirs.push(zip.origPath);
                expect(zip.path).toEqual(expect.any(String));
                expect(zip.origPath).toEqual(expect.any(String));
                expect(zip.name).toEqual(expect.any(String));
                expect(zip.origName).toEqual(expect.any(String));
                expect(zip.path).not.toMatch(/flat-example$/);
                expect(zip.path).toEqual(zip.origPath);
                expect(zip.origName).toEqual('flat-example');
            });
    });

    it('Simple example: zip with same-name folder should unzip and callback with a path, resolving base dir', function () {
        return testReadZip('example.zip')
            .then((zip) => {
                tempDirs.push(zip.origPath);
                expect(zip.path).toEqual(expect.any(String));
                expect(zip.origPath).toEqual(expect.any(String));
                expect(zip.name).toEqual(expect.any(String));
                expect(zip.origName).toEqual(expect.any(String));
                expect(zip.path).toMatch(/\/example$/);
                expect(zip.path).not.toEqual(zip.origPath);
                expect(zip.origName).toEqual('example');
            });
    });

    it('Bad example: zip with dif-name folder should unzip and callback with a path, resolving base dir', function () {
        return testReadZip('bad-example.zip')
            .then((zip) => {
                tempDirs.push(zip.origPath);
                expect(zip.path).toEqual(expect.any(String));
                expect(zip.origPath).toEqual(expect.any(String));
                expect(zip.name).toEqual(expect.any(String));
                expect(zip.origName).toEqual(expect.any(String));
                expect(zip.path).toMatch(/\/bad-example-folder/);
                expect(zip.path).not.toEqual(zip.origPath);
                expect(zip.origName).toEqual('bad-example');
            });
    });

    it('Nested example: zip with nested folders should unzip and callback with a path, resolving base dir', function () {
        return testReadZip('nested-example.zip')
            .then((zip) => {
                tempDirs.push(zip.origPath);
                expect(zip.path).toEqual(expect.any(String));
                expect(zip.origPath).toEqual(expect.any(String));
                expect(zip.name).toEqual(expect.any(String));
                expect(zip.origName).toEqual(expect.any(String));
                expect(zip.path).toMatch(/\/nested-example\/bad-example-folder$/);
                expect(zip.path).not.toEqual(zip.origPath);
                expect(zip.origName).toEqual('nested-example');
            });
    });

    it('Multi example: complex zip should unzip and callback with a path, resolving base dir', function () {
        return testReadZip('multi-example.zip')
            .then((zip) => {
                tempDirs.push(zip.origPath);
                expect(zip.path).toEqual(expect.any(String));
                expect(zip.origPath).toEqual(expect.any(String));
                expect(zip.name).toEqual(expect.any(String));
                expect(zip.origName).toEqual(expect.any(String));
                expect(zip.path).toMatch(/\/multi-example\/theme\/theme-name/);
                expect(zip.path).not.toEqual(zip.origPath);
                expect(zip.origName).toEqual('multi-example');
            });
    });

    // If the zip file does not contain index.hbs, we return the standard path, and our checks will report the errors
    it('No index.hbs example: zip should unzip and callback with a path', function () {
        return testReadZip('not-a-theme.zip')
            .then((zip) => {
                tempDirs.push(zip.origPath);
                expect(zip.path).toEqual(expect.any(String));
                expect(zip.origPath).toEqual(expect.any(String));
                expect(zip.name).toEqual(expect.any(String));
                expect(zip.origName).toEqual(expect.any(String));
                expect(zip.path).not.toMatch(/not-a-theme$/);
                expect(zip.path).toEqual(zip.origPath);
                expect(zip.origName).toEqual('not-a-theme');
            });
    });

    it('passes configured limits to zip extraction', async function () {
        const limits = {
            perEntryUncompressedBytes: 100,
            totalUncompressedBytes: 200
        };
        const extract = vi.fn(async (zipPath, tempPath) => {
            await fs.mkdir(tempPath, {recursive: true});
        });
        const mocked = loadReadZipWithExtract(extract);

        try {
            const zip = await mocked.readZip({path: '/tmp/theme.zip', name: 'theme.zip'}, {limits});
            tempDirs.push(zip.origPath);

            expect(extract).toHaveBeenCalledWith('/tmp/theme.zip', expect.any(String), {limits});
        } finally {
            mocked.restore();
        }
    });

    it('wraps extraction errors when limits are not configured', async function () {
        const extractError = new Error('invalid zip file');
        const extract = vi.fn(async () => {
            throw extractError;
        });
        const mocked = loadReadZipWithExtract(extract);

        try {
            await expect(mocked.readZip({path: '/tmp/theme.zip', name: 'theme.zip'})).rejects.toMatchObject({
                errorType: 'ValidationError',
                message: 'Failed to read zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                context: 'theme.zip',
                errorDetails: extractError.message
            });

            expect(extract).toHaveBeenCalledWith('/tmp/theme.zip', expect.any(String), {});
        } finally {
            mocked.restore();
        }
    });

    it('preserves zip GhostErrors from extraction', async function () {
        const zipError = new errors.UnsupportedMediaTypeError({
            message: 'Zip entry exceeds maximum uncompressed size.',
            context: 'The zip contains an entry that exceeds the maximum uncompressed size.',
            code: 'ENTRY_TOO_LARGE',
            errorDetails: {
                entryName: 'big-file.txt',
                observedBytes: 101,
                limitBytes: 100
            }
        });
        const extract = vi.fn(async () => {
            throw zipError;
        });
        const mocked = loadReadZipWithExtract(extract);

        try {
            await expect(mocked.readZip({path: '/tmp/theme.zip', name: 'theme.zip'}, {
                limits: {
                    perEntryUncompressedBytes: 100
                }
            })).rejects.toBe(zipError);
        } finally {
            mocked.restore();
        }
    });

    it('preserves zip symlink errors from extraction', async function () {
        const zipError = new errors.UnsupportedMediaTypeError({
            message: 'Symlinks are not allowed in the zip folder.',
            context: 'The zip contains a symlink entry.',
            code: 'SYMLINK_NOT_ALLOWED',
            errorDetails: {
                entryName: 'themes/test-target'
            }
        });
        const extract = vi.fn(async () => {
            throw zipError;
        });
        const mocked = loadReadZipWithExtract(extract);

        try {
            await expect(mocked.readZip({path: '/tmp/theme.zip', name: 'theme.zip'})).rejects.toBe(zipError);
        } finally {
            mocked.restore();
        }
    });
});
