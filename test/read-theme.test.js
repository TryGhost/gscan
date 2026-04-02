const _ = require('lodash');
const fs = require('fs-extra');
const utils = require('./utils');
const readTheme = require('../lib/read-theme');
const themePath = utils.themePath;

describe('Read theme', function () {

    it('returns correct result', function () {
        return readTheme(themePath('is-empty')).then((theme) => {
            utils.assertValidThemeObject(theme);

            expect(theme.files).toEqual([
                {file: '.gitkeep', normalizedFile: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', normalizedFile: 'README.md', ext: '.md', symlink: false}
            ]);
        });
    });

    it('Can read partials', function () {
        return readTheme(themePath('theme-with-partials')).then((theme) => {
            utils.assertValidThemeObject(theme);

            expect(theme.files).toHaveLength(7);

            const fileNames = _.map(theme.files, function (file) {
                return _.pickBy(file, function (value, key) {
                    return key === 'file' || key === 'ext';
                });
            });

            expect(fileNames).toContainEqual({file: 'index.hbs', ext: '.hbs'});
            expect(fileNames).toContainEqual({file: 'package.json', ext: '.json'});
            expect(fileNames).toContainEqual({file: 'partialsbroke.hbs', ext: '.hbs'});
            expect(fileNames).toContainEqual({file: 'partials/mypartial.hbs', ext: '.hbs'});
            expect(fileNames).toContainEqual({file: 'partials/subfolder/test.hbs', ext: '.hbs'});
            expect(fileNames).toContainEqual({file: 'post.hbs', ext: '.hbs'});
            expect(fileNames).toContainEqual({file: 'logo.new.hbs', ext: '.hbs'});

            expect(theme.customSettings).toEqual({});

            // partials should not appear in templates
            expect(theme.templates.all).not.toContain('partials/mypartial');
            expect(theme.templates.all).not.toContain('partials/subfolder/test');
        });
    });

    it('can read partials with POSIX paths', async function () {
        const readFileSpy = vi.spyOn(fs, 'readFile').mockResolvedValue('');

        try {
            const result = await readTheme._private.readFiles({
                files: [
                    {file: 'index.hbs', ext: '.hbs'},
                    {file: 'package.json', ext: '.json'},
                    {file: 'partialsbroke.hbs', ext: '.hbs'},
                    {file: 'partials/mypartial.hbs', ext: '.hbs'},
                    {file: 'partials/subfolder/test.hbs', ext: '.hbs'},
                    {file: 'post.hbs', ext: '.hbs'}
                ],
                path: 'fake/example-i'
            });

            expect(result.partials).toHaveLength(2);
            expect(result.partials).toEqual(['mypartial', 'subfolder/test']);
        } finally {
            readFileSpy.mockRestore();
        }
    });

    it('can read partials with windows paths', async function () {
        const readFileSpy = vi.spyOn(fs, 'readFile').mockResolvedValue('');

        try {
            const result = await readTheme._private.readFiles({
                files: [
                    {file: 'index.hbs', ext: '.hbs'},
                    {file: 'package.json', ext: '.json'},
                    {file: 'partialsbroke.hbs', ext: '.hbs'},
                    {file: 'partials\\mypartial.hbs', ext: '.hbs'},
                    {file: 'partials\\subfolder\\test.hbs', ext: '.hbs'},
                    {file: 'post.hbs', ext: '.hbs'}
                ],
                path: 'fake\\example-i'
            });

            expect(result.partials).toHaveLength(2);
            expect(result.partials).toEqual(['mypartial', 'subfolder\\test']);
        } finally {
            readFileSpy.mockRestore();
        }
    });

    it('Can extract custom templates', function () {
        return readTheme(themePath('theme-with-custom-templates')).then((theme) => {
            utils.assertValidThemeObject(theme);

            expect(theme.files).toHaveLength(13);
            expect(theme.partials.length).toEqual(0);
            expect(theme.templates.all.length).toEqual(10);
            expect(theme.templates.custom.length).toEqual(4);

            // ensure we don't change the structure of theme.files
            expect(theme.files[0].file).toEqual('assets/ignoreme.hbs');
            expect(theme.files[0].ext).toEqual('.hbs');
            expect(theme.files[0].content).toEqual('ignoreme');

            expect(theme.files[1].file).toEqual('assets/styles.css');
            expect(theme.files[1].ext).toEqual('.css');
            expect(theme.files[1].content).toEqual('.some-class {\n    border: 0;\n}\n');

            expect(theme.files[2].file).toEqual('custom/test.hbs');
            expect(theme.files[2].ext).toEqual('.hbs');
            expect(theme.files[2].content).toEqual('test');

            expect(theme.files[3].file).toEqual('custom-My-Post.hbs');
            expect(theme.files[3].ext).toEqual('.hbs');
            expect(theme.files[3].content).toEqual('content');

            expect(theme.templates.all).toEqual([
                'custom/test',
                'custom-My-Post',
                'custom-about',
                'my-page-about',
                'page-1',
                'page',
                'podcast/rss',
                'post-partials/footer',
                'post-welcome-ghost',
                'post'
            ]);

            expect(_.map(theme.templates.custom, 'filename')).toEqual([
                'custom-My-Post',
                'custom-about',
                'page-1',
                'post-welcome-ghost'
            ]);

            expect(theme.templates.custom[0].filename).toEqual('custom-My-Post');
            expect(theme.templates.custom[0].name).toEqual('My Post');
            expect(theme.templates.custom[0].for).toEqual(['page', 'post']);
            expect(theme.templates.custom[0].slug).toBeNull();

            expect(theme.templates.custom[1].filename).toEqual('custom-about');
            expect(theme.templates.custom[1].name).toEqual('About');
            expect(theme.templates.custom[1].for).toEqual(['page', 'post']);
            expect(theme.templates.custom[1].slug).toBeNull();

            expect(theme.templates.custom[2].filename).toEqual('page-1');
            expect(theme.templates.custom[2].name).toEqual('1');
            expect(theme.templates.custom[2].for).toEqual(['page']);
            expect(theme.templates.custom[2].slug).toEqual('1');

            expect(theme.templates.custom[3].filename).toEqual('post-welcome-ghost');
            expect(theme.templates.custom[3].name).toEqual('Welcome Ghost');
            expect(theme.templates.custom[3].for).toEqual(['post']);
            expect(theme.templates.custom[3].slug).toEqual('welcome-ghost');

            // nested and non-matching templates should not appear in custom
            expect(_.map(theme.templates.custom, 'filename')).not.toContain('custom/test');
            expect(_.map(theme.templates.custom, 'filename')).not.toContain('post');
            expect(_.map(theme.templates.custom, 'filename')).not.toContain('page');
            expect(_.map(theme.templates.custom, 'filename')).not.toContain('my-page-about');
        });
    });

    it('can extract custom settings from package.json', function () {
        return readTheme(themePath('theme-with-custom-settings')).then((theme) => {
            utils.assertValidThemeObject(theme);

            expect(theme.customSettings).toBeDefined();

            expect(theme.customSettings).toEqual({
                test_select: {
                    type: 'select',
                    options: ['one', 'two'],
                    default: 'two'
                }
            });

        });
    });

    it('can handle missing config in package.json', async function () {
        const options = {labs: {customThemeSettings: true}};

        const theme = await readTheme(themePath('010-packagejson/no-config'), options);

        utils.assertValidThemeObject(theme);

        expect(theme.customSettings).toBeDefined();

        expect(theme.customSettings).toEqual({});
    });
});
