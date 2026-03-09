const should = require('should'); // eslint-disable-line no-unused-vars
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const sinon = require('sinon');

const readTheme = require('../lib/read-theme');
const {
    extractCustomTemplates,
    extractTemplates,
    linter,
    processHelpers,
    readFiles,
    readThemeStructure
} = readTheme._private;

describe('Read theme internals', function () {
    afterEach(function () {
        sinon.restore();
    });

    it('extracts custom templates and ignores nested matches', function () {
        extractCustomTemplates([
            'post-featured',
            'page-contact',
            'custom-home',
            'custom/nested',
            'index'
        ]).should.deepEqual([
            {
                filename: 'post-featured',
                name: 'Featured',
                for: ['post'],
                slug: 'featured'
            },
            {
                filename: 'page-contact',
                name: 'Contact',
                for: ['page'],
                slug: 'contact'
            },
            {
                filename: 'custom-home',
                name: 'Home',
                for: ['page', 'post'],
                slug: null
            }
        ]);
    });

    it('extracts templates while skipping partials and assets', function () {
        extractTemplates([
            {file: 'partials/card.hbs'},
            {file: 'assets/ignoreme.hbs'},
            {file: 'index.hbs'},
            {file: 'custom-home.hbs'},
            {file: 'README.md'}
        ]).should.eql([
            'index',
            'custom-home'
        ]);
    });

    it('reads theme structure recursively, drops ignored files in tmp, and marks symlinks', async function () {
        const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'gscan-theme-'));
        const nestedDir = path.join(tmpRoot, 'partials');
        const symlinkTarget = path.join(tmpRoot, 'source.hbs');
        const symlinkPath = path.join(tmpRoot, 'linked.hbs');

        await fs.ensureDir(nestedDir);
        await fs.writeFile(path.join(tmpRoot, '.DS_Store'), 'ignored');
        await fs.writeFile(path.join(tmpRoot, 'LICENSE'), 'no extension');
        await fs.writeFile(path.join(nestedDir, 'card.hbs'), '{{title}}');
        await fs.writeFile(symlinkTarget, '{{content}}');
        await fs.symlink(symlinkTarget, symlinkPath);

        try {
            const files = await readThemeStructure(tmpRoot);

            files.should.containDeep([
                {
                    file: 'LICENSE',
                    normalizedFile: 'LICENSE',
                    ext: undefined,
                    symlink: false
                },
                {
                    file: 'partials/card.hbs',
                    normalizedFile: 'partials/card.hbs',
                    ext: '.hbs',
                    symlink: false
                },
                {
                    file: 'linked.hbs',
                    normalizedFile: 'linked.hbs',
                    ext: '.hbs',
                    symlink: true
                }
            ]);

            (await fs.pathExists(path.join(tmpRoot, '.DS_Store'))).should.eql(false);
        } finally {
            await fs.remove(tmpRoot);
        }
    });

    it('reads file content, custom settings, partials, and parsed handlebars files', async function () {
        const parseStub = sinon.stub().returns({ast: true});
        const processHelpersStub = sinon.stub();
        const readFileStub = sinon.stub(fs, 'readFile');

        readFileStub
            .withArgs(path.join('/tmp/theme', 'package.json'), 'utf8')
            .resolves(JSON.stringify({
                config: {
                    custom: {
                        accent_color: {
                            type: 'color'
                        }
                    }
                }
            }));
        readFileStub
            .withArgs(path.join('/tmp/theme', 'partials/card.hbs'), 'utf8')
            .resolves('{{title}}');
        readFileStub
            .withArgs(path.join('/tmp/theme', 'assets/app.css'), 'utf8')
            .resolves('body{}');
        readFileStub
            .withArgs(path.join('/tmp/theme', 'scripts/app.js'), 'utf8')
            .resolves('console.log("x");');

        const theme = await readFiles({
            path: '/tmp/theme',
            files: [
                {file: 'package.json', ext: '.json'},
                {file: 'partials/card.hbs', ext: '.hbs'},
                {file: 'assets/app.css', ext: '.css'},
                {file: 'scripts/app.js', ext: '.js'},
                {file: 'README.md', ext: '.md'}
            ]
        }, {
            ASTLinter: {
                parse: parseStub
            },
            fs,
            processHelpers: processHelpersStub
        });

        theme.customSettings.should.deepEqual({
            accent_color: {
                type: 'color'
            }
        });
        theme.partials.should.eql(['card']);
        parseStub.calledOnce.should.eql(true);
        processHelpersStub.calledOnce.should.eql(true);
        theme.files[1].parsed.should.deepEqual({ast: true});
        readFileStub.callCount.should.eql(4);
    });

    it('keeps defaults when package.json is invalid and ignores non-template files', async function () {
        const parseStub = sinon.stub().returns({ast: true});
        const processHelpersStub = sinon.stub();
        const readFileStub = sinon.stub(fs, 'readFile');

        readFileStub
            .withArgs(path.join('/tmp/theme', 'package.json'), 'utf8')
            .resolves('{invalid');

        const theme = await readFiles({
            path: '/tmp/theme',
            files: [
                {file: 'package.json', ext: '.json'},
                {file: 'logo.svg', ext: '.svg'}
            ],
            customSettings: {
                existing: true
            }
        }, {
            ASTLinter: {
                parse: parseStub
            },
            fs,
            processHelpers: processHelpersStub
        });

        theme.customSettings.should.deepEqual({
            existing: true
        });
        theme.partials.should.eql([]);
        parseStub.called.should.eql(false);
        processHelpersStub.called.should.eql(false);
        readFileStub.calledOnce.should.eql(true);
    });

    it('collects helper usage into the theme helper map', function () {
        const originalHelpers = linter.helpers;
        const verifyStub = sinon.stub(linter, 'verify');

        linter.helpers = [
            {name: 'get'},
            {name: 'get'},
            {name: 'foreach'}
        ];

        const theme = {
            helpers: {
                get: ['index.hbs']
            }
        };

        try {
            processHelpers(theme, {
                parsed: {ast: true},
                content: '{{content}}',
                file: 'post.hbs'
            });

            verifyStub.calledOnce.should.eql(true);
            theme.helpers.should.deepEqual({
                get: ['index.hbs', 'post.hbs', 'post.hbs'],
                foreach: ['post.hbs']
            });
        } finally {
            linter.helpers = originalHelpers;
        }
    });
});
