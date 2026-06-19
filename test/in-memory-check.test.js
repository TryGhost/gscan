const fs = require('fs/promises');
const utils = require('./utils');
const {check, checkZip, checkFiles, checkBuffer} = require('../lib');
const readBuffer = require('../lib/read-buffer');
const buildTheme = require('../lib/build-theme');
const themePath = utils.themePath;

const sortedFailCodes = theme => Object.keys(theme.results.fail).sort();

describe('In-memory checking (checkFiles / checkBuffer)', function () {
    describe('checkBuffer', function () {
        it('produces the same results as checkZip for the same zip', async function () {
            const buffer = await fs.readFile(themePath('example.zip'));

            const fromBuffer = await checkBuffer(buffer, {checkVersion: 'v1', themeName: 'example'});
            const fromZip = await checkZip(themePath('example.zip'), {checkVersion: 'v1'});

            utils.assertValidThemeObject(fromBuffer);
            expect(fromBuffer.results.pass.sort()).toEqual(fromZip.results.pass.sort());
            expect(sortedFailCodes(fromBuffer)).toEqual(sortedFailCodes(fromZip));
            expect(fromBuffer.checkedVersion).toEqual(fromZip.checkedVersion);
        });

        it('accepts an ArrayBuffer as well as a Uint8Array', async function () {
            const nodeBuffer = await fs.readFile(themePath('example.zip'));
            const arrayBuffer = nodeBuffer.buffer.slice(
                nodeBuffer.byteOffset,
                nodeBuffer.byteOffset + nodeBuffer.byteLength
            );

            const theme = await checkBuffer(arrayBuffer, {checkVersion: 'v1'});
            utils.assertValidThemeObject(theme);
        });

        it('wraps a corrupted zip in a ValidationError', async function () {
            const notAZip = new Uint8Array([1, 2, 3, 4, 5]);

            await expect(checkBuffer(notAZip, {themeName: 'broken'})).rejects.toMatchObject({
                errorType: 'ValidationError',
                message: 'Failed to read zip file',
                context: 'broken'
            });
        });
    });

    describe('checkFiles', function () {
        it('produces the same results as reading the same theme from disk', async function () {
            // Read the structure from disk only to obtain the file list + content,
            // then feed it through the in-memory path and compare with check().
            const fromDisk = await check(themePath('is-empty'), {checkVersion: 'v1'});

            const files = fromDisk.files.map(f => ({file: f.file, content: f.content}));
            const fromFiles = await checkFiles(files, {checkVersion: 'v1', themeName: 'is-empty'});

            utils.assertValidThemeObject(fromFiles);
            expect(fromFiles.results.pass.sort()).toEqual(fromDisk.results.pass.sort());
            expect(sortedFailCodes(fromFiles)).toEqual(sortedFailCodes(fromDisk));
        });

        it('parses partials and helpers from in-memory content', async function () {
            const theme = await checkFiles([
                {file: 'package.json', content: '{"name":"test","version":"1.0.0"}'},
                {file: 'index.hbs', content: '{{> mypartial}}{{foo}}'},
                {file: 'partials/mypartial.hbs', content: 'partial body'}
            ], {checkVersion: 'v5'});

            expect(theme.partials).toEqual(['mypartial']);
            expect(theme.templates.all).toContain('index');
            expect(theme.templates.all).not.toContain('partials/mypartial');
        });
    });

    describe('read-buffer', function () {
        it('resolves the theme base dir for a single nested folder', async function () {
            const buffer = await fs.readFile(themePath('example.zip'));
            const files = readBuffer(buffer);

            // example.zip nests the theme under example/ — the prefix must be stripped
            expect(files.some(f => f.file === 'index.hbs')).toBe(true);
            expect(files.every(f => !f.file.startsWith('example/'))).toBe(true);
        });

        it('attaches content only to content-bearing files', async function () {
            const buffer = await fs.readFile(themePath('example.zip'));
            const files = readBuffer(buffer);

            for (const f of files) {
                if (/\.(hbs|css|js)$/.test(f.file) || f.file === 'package.json') {
                    expect(typeof f.content).toBe('string');
                }
            }
        });
    });

    describe('ignore filtering', function () {
        it('drops ignored files and directories', function () {
            const theme = buildTheme('test', [
                {file: 'index.hbs', content: 'a'},
                {file: 'node_modules/dep/index.js', content: 'b'},
                {file: '.claude/settings.json', content: 'c'},
                {file: 'CLAUDE.md', content: 'd'},
                {file: 'assets/logo.png'}
            ]);

            const paths = theme.files.map(f => f.file);
            expect(paths).toContain('index.hbs');
            expect(paths).toContain('assets/logo.png');
            expect(paths).not.toContain('CLAUDE.md');
            expect(paths.some(p => p.startsWith('node_modules'))).toBe(false);
            expect(paths.some(p => p.startsWith('.claude'))).toBe(false);
        });
    });
});
