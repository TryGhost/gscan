const _ = require('lodash');
const fs = require('fs/promises');
const utils = require('./utils');
const readTheme = require('../lib/read-theme');
const themePath = utils.themePath;

describe('Read theme', function () {

    it('returns correct result', async function () {
        const theme = await readTheme(themePath('is-empty'));
        utils.assertValidThemeObject(theme);

        expect(theme.files).toEqual([
            {file: '.gitkeep', normalizedFile: '.gitkeep', ext: '.gitkeep', symlink: false},
            {file: 'README.md', normalizedFile: 'README.md', ext: '.md', symlink: false}
        ]);
    });

    it('Can read partials', async function () {
        const theme = await readTheme(themePath('theme-with-partials'));
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

    it('Can extract custom templates', async function () {
        const theme = await readTheme(themePath('theme-with-custom-templates'));
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

    it('can extract custom settings from package.json', async function () {
        const theme = await readTheme(themePath('theme-with-custom-settings'));
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

    it('can handle missing config in package.json', async function () {
        const options = {labs: {customThemeSettings: true}};

        const theme = await readTheme(themePath('010-packagejson/no-config'), options);

        utils.assertValidThemeObject(theme);

        expect(theme.customSettings).toBeDefined();

        expect(theme.customSettings).toEqual({});
    });

    it('ignores AI tooling files and dirs (.claude, CLAUDE.md, AGENTS.md)', async function () {
        // Regression for PR #796: a symlink under `.claude/` previously
        // surfaced in theme.files and triggered a fatal GS030-ASSET-SYM.
        // The fixture intentionally includes a symlink inside `.claude/`.
        const theme = await readTheme(themePath('theme-with-ai-tooling'));
        utils.assertValidThemeObject(theme);

        const filePaths = theme.files.map(f => f.file);

        expect(filePaths).toEqual(['index.hbs']);
        expect(filePaths).not.toContain('CLAUDE.md');
        expect(filePaths).not.toContain('AGENTS.md');
        expect(filePaths.some(p => p.startsWith('.claude'))).toBe(false);
        expect(theme.files.some(f => f.symlink)).toBe(false);
    });

    it('refuses to read a file path that escapes the theme directory', async function () {
        await expect(readTheme._private.readFiles({
            path: themePath('is-empty'),
            files: [
                {file: '../../../../etc/evil.hbs', ext: '.hbs'}
            ]
        })).rejects.toThrow(/outside of theme directory/);
    });

    it('does not reject a file whose name merely starts with two dots (readFiles)', async function () {
        const readFileSpy = vi.spyOn(fs, 'readFile').mockResolvedValue('content');

        try {
            const theme = await readTheme._private.readFiles({
                path: themePath('is-empty'),
                files: [
                    {file: '..backup.hbs', ext: '.hbs'}
                ]
            });

            expect(theme.files[0].content).toEqual('content');
        } finally {
            readFileSpy.mockRestore();
        }
    });

    it('never reads the content of a symlinked file, even one that looks like package.json/*.hbs', async function () {
        const readFileSpy = vi.spyOn(fs, 'readFile').mockResolvedValue('should never be read');

        try {
            const theme = await readTheme._private.readFiles({
                path: themePath('is-empty'),
                files: [
                    {file: 'package.json', ext: '.json', symlink: true},
                    {file: 'index.hbs', ext: '.hbs', symlink: true}
                ]
            });

            expect(readFileSpy).not.toHaveBeenCalled();
            expect(theme.files[0].content).toBeUndefined();
            expect(theme.files[1].content).toBeUndefined();
        } finally {
            readFileSpy.mockRestore();
        }
    });

    it('does not reject a directory entry whose name merely starts with two dots (readThemeStructure)', async function () {
        const readdirSpy = vi.spyOn(fs, 'readdir').mockResolvedValue([
            {name: '..backup.hbs', isDirectory: () => false, isSymbolicLink: () => false}
        ]);

        try {
            const result = await readTheme._private.readThemeStructure(themePath('is-empty'));
            expect(result).toContainEqual(expect.objectContaining({file: '..backup.hbs'}));
        } finally {
            readdirSpy.mockRestore();
        }
    });

    it('bounds concurrent directory reads across a wide tree instead of fanning out unboundedly', async function () {
        const root = themePath('is-empty');
        const dirCount = 200;
        let activeReaddirs = 0;
        let peakReaddirs = 0;

        const readdirSpy = vi.spyOn(fs, 'readdir').mockImplementation(async (dirPath) => {
            activeReaddirs += 1;
            peakReaddirs = Math.max(peakReaddirs, activeReaddirs);

            await new Promise((resolve) => {
                setTimeout(resolve, 5);
            });

            activeReaddirs -= 1;

            if (dirPath === root) {
                return Array.from({length: dirCount}, (v, i) => ({
                    name: `dir-${i}`,
                    isDirectory: () => true,
                    isSymbolicLink: () => false
                }));
            }

            // leaf directories - nothing further to walk
            return [];
        });

        try {
            const result = await readTheme._private.readThemeStructure(root);

            expect(result).toEqual([]);
            // never more than the configured cap in flight at once...
            expect(peakReaddirs).toBeLessThanOrEqual(64);
            // ...but still genuinely running some of the 200 concurrently, not one-by-one
            expect(peakReaddirs).toBeGreaterThan(1);
        } finally {
            readdirSpy.mockRestore();
        }
    });

    describe('with skipChecks', function () {
        it('still returns correct partials, templates, and customSettings', async function () {
            const theme = await readTheme(themePath('theme-with-partials'), {skipChecks: true});
            utils.assertValidThemeObject(theme);

            expect(theme.partials).toEqual(['mypartial', 'subfolder/test']);
            expect(theme.templates.all).not.toContain('partials/mypartial');
            expect(theme.templates.all).not.toContain('partials/subfolder/test');
            expect(theme.customSettings).toEqual({});
        });

        it('excludes a symlinked partial from theme.partials the same way with or without skipChecks', async function () {
            const readFileSpy = vi.spyOn(fs, 'readFile').mockResolvedValue('');
            const files = () => [
                {file: 'partials/legit.hbs', ext: '.hbs', symlink: false},
                {file: 'partials/escape.hbs', ext: '.hbs', symlink: true}
            ];

            try {
                const withSkipChecks = await readTheme._private.readFiles(
                    {path: themePath('is-empty'), files: files()},
                    {skipChecks: true}
                );
                const withoutSkipChecks = await readTheme._private.readFiles(
                    {path: themePath('is-empty'), files: files()}
                );

                expect(withSkipChecks.partials).toEqual(['legit']);
                expect(withoutSkipChecks.partials).toEqual(['legit']);
            } finally {
                readFileSpy.mockRestore();
            }
        });

        it('still returns correct templates.all and templates.custom', async function () {
            const theme = await readTheme(themePath('theme-with-custom-templates'), {skipChecks: true});
            utils.assertValidThemeObject(theme);

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
        });

        it('extracts customSettings from package.json without checks running', async function () {
            const theme = await readTheme(themePath('theme-with-custom-settings'), {skipChecks: true});
            utils.assertValidThemeObject(theme);

            expect(theme.customSettings).toEqual({
                test_select: {
                    type: 'select',
                    options: ['one', 'two'],
                    default: 'two'
                }
            });
        });

        it('does not populate theme.helpers or read .hbs/.css/.js content', async function () {
            const theme = await readTheme(themePath('theme-with-custom-templates'), {skipChecks: true});

            expect(theme.helpers).toEqual({});

            const hbsFile = theme.files.find(f => f.file === 'custom-My-Post.hbs');
            const cssFile = theme.files.find(f => f.file === 'assets/styles.css');

            expect(hbsFile.content).toBeUndefined();
            expect(hbsFile.parsed).toBeUndefined();
            expect(cssFile.content).toBeUndefined();
        });

        it('still reads package.json content for customSettings when no other files match', async function () {
            const theme = await readTheme(themePath('010-packagejson/no-config'), {skipChecks: true});
            utils.assertValidThemeObject(theme);

            expect(theme.customSettings).toEqual({});
        });

        it('only reads the root package.json, not a same-named nested file or lookalike', async function () {
            const readFileSpy = vi.spyOn(fs, 'readFile').mockImplementation(async (filePath) => {
                if (filePath.endsWith('/package.json') && !filePath.includes('vendor')) {
                    return '{"config":{"custom":{"from_root":{"type":"text","default":"yep"}}}}';
                }
                throw new Error(`unexpected read: ${filePath}`);
            });

            try {
                const theme = await readTheme._private.readFiles({
                    path: themePath('is-empty'),
                    files: [
                        {file: 'package.json', ext: '.json', symlink: false},
                        {file: 'vendor/package.json', ext: '.json', symlink: false},
                        {file: 'assets/package.json.hbs', ext: '.hbs', symlink: false}
                    ]
                }, {skipChecks: true});

                expect(readFileSpy).toHaveBeenCalledTimes(1);
                expect(theme.customSettings).toEqual({from_root: {type: 'text', default: 'yep'}});
            } finally {
                readFileSpy.mockRestore();
            }
        });
    });

    describe('without skipChecks (unchanged behavior)', function () {
        it('still populates theme.helpers and file content', async function () {
            const theme = await readTheme(themePath('theme-with-custom-templates'));

            const hbsFile = theme.files.find(f => f.file === 'custom-My-Post.hbs');
            const cssFile = theme.files.find(f => f.file === 'assets/styles.css');

            expect(hbsFile.content).toEqual('content');
            expect(hbsFile.parsed).toBeDefined();
            expect(cssFile.content).toEqual('.some-class {\n    border: 0;\n}\n');
        });
    });

    describe('directory walk ordering', function () {
        it('returns files in the same order after parallelizing readThemeStructure', async function () {
            const theme = await readTheme(themePath('theme-with-custom-templates'));

            expect(theme.files.map(f => f.file)).toEqual([
                'assets/ignoreme.hbs',
                'assets/styles.css',
                'custom/test.hbs',
                'custom-My-Post.hbs',
                'custom-about.hbs',
                'my-page-about.hbs',
                'package.json',
                'page-1.hbs',
                'page.hbs',
                'podcast/rss.hbs',
                'post-partials/footer.hbs',
                'post-welcome-ghost.hbs',
                'post.hbs'
            ]);
        });

        it('assembles a wide directory in original readdir order without quadratic re-copying', async function () {
            const entryCount = 5000;
            const entries = Array.from({length: entryCount}, (entry, i) => ({
                name: `file-${String(i).padStart(5, '0')}.hbs`,
                isDirectory: () => false,
                isSymbolicLink: () => false
            }));
            const readdirSpy = vi.spyOn(fs, 'readdir').mockResolvedValue(entries);

            try {
                const result = await readTheme._private.readThemeStructure(themePath('is-empty'));

                expect(result).toHaveLength(entryCount);
                expect(result.map(f => f.file)).toEqual(entries.map(e => e.name));
            } finally {
                readdirSpy.mockRestore();
            }
        });
    });
});
