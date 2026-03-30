const fs = require('fs-extra');
const utils = require('./utils');
const readZip = require('../lib/read-zip');
const themePath = utils.themePath;

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
        await Promise.all(tempDirs.map(dir => fs.remove(dir)));
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
});
