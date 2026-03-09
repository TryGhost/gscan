const _ = require('lodash');
const fs = require('fs-extra');
const sinon = require('sinon');
const themePath = require('./utils').themePath;

const readTheme = require('../lib/read-theme');
const {
    extractCustomTemplates,
    extractTemplates,
    readFiles
} = readTheme._private;

describe('Read theme', function () {
    let sandbox;

    beforeAll(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('returns correct result', function () {
        return readTheme(themePath('is-empty')).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', normalizedFile: '.gitkeep', ext: '.gitkeep', symlink: false},
                {file: 'README.md', normalizedFile: 'README.md', ext: '.md', symlink: false}
            ]);
        });
    });

    it('Can read partials', function () {
        return readTheme(themePath('theme-with-partials')).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.be.an.Array().with.lengthOf(7);

            const fileNames = _.map(theme.files, function (file) {
                return _.pickBy(file, function (value, key) {
                    return key === 'file' || key === 'ext';
                });
            });

            fileNames.should.containEql({file: 'index.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'package.json', ext: '.json'});
            fileNames.should.containEql({file: 'partialsbroke.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'partials/mypartial.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'partials/subfolder/test.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'post.hbs', ext: '.hbs'});
            fileNames.should.containEql({file: 'logo.new.hbs', ext: '.hbs'});

            theme.customSettings.should.be.empty();
        });
    });

    it('Can extract custom templates', function () {
        return readTheme(themePath('theme-with-custom-templates')).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.be.an.Array().with.lengthOf(13);
            theme.partials.length.should.eql(0);
            theme.templates.all.length.should.eql(10);
            theme.templates.custom.length.should.eql(4);

            theme.files[0].file.should.eql('assets/ignoreme.hbs');
            theme.files[0].ext.should.eql('.hbs');
            theme.files[0].content.should.eql('ignoreme');

            theme.files[1].file.should.eql('assets/styles.css');
            theme.files[1].ext.should.eql('.css');
            theme.files[1].content.should.eql('.some-class {\n    border: 0;\n}\n');

            theme.files[2].file.should.eql('custom/test.hbs');
            theme.files[2].ext.should.eql('.hbs');
            theme.files[2].content.should.eql('test');

            theme.files[3].file.should.eql('custom-My-Post.hbs');
            theme.files[3].ext.should.eql('.hbs');
            theme.files[3].content.should.eql('content');

            theme.templates.all.should.eql([
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

            _.map(theme.templates.custom, 'filename').should.eql([
                'custom-My-Post',
                'custom-about',
                'page-1',
                'post-welcome-ghost'
            ]);

            theme.templates.custom[0].filename.should.eql('custom-My-Post');
            theme.templates.custom[0].name.should.eql('My Post');
            theme.templates.custom[0].for.should.eql(['page', 'post']);
            should.not.exist(theme.templates.custom[0].slug);

            theme.templates.custom[1].filename.should.eql('custom-about');
            theme.templates.custom[1].name.should.eql('About');
            theme.templates.custom[1].for.should.eql(['page', 'post']);
            should.not.exist(theme.templates.custom[1].slug);

            theme.templates.custom[2].filename.should.eql('page-1');
            theme.templates.custom[2].name.should.eql('1');
            theme.templates.custom[2].for.should.eql(['page']);
            theme.templates.custom[2].slug.should.eql('1');

            theme.templates.custom[3].filename.should.eql('post-welcome-ghost');
            theme.templates.custom[3].name.should.eql('Welcome Ghost');
            theme.templates.custom[3].for.should.eql(['post']);
            theme.templates.custom[3].slug.should.eql('welcome-ghost');
        });
    });

    it('can read partials with POSIX paths', function () {
        const exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials/mypartial.hbs', ext: '.hbs'},
            {file: 'partials/subfolder/test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        sandbox.stub(fs, 'readFile').returns(Promise.resolve(''));

        return readFiles({
            files: exampleI,
            path: 'fake/example-i'
        }, {
            fs
        }).then((result) => {
            result.partials.should.be.an.Array().with.lengthOf(2);
            result.partials.should.eql(['mypartial', 'subfolder/test']);
        });
    });

    it('can read partials with windows paths', function () {
        const exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials\\mypartial.hbs', ext: '.hbs'},
            {file: 'partials\\subfolder\\test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        sandbox.stub(fs, 'readFile').returns(Promise.resolve(''));

        return readFiles({
            files: exampleI,
            path: 'fake\\example-i'
        }, {
            fs
        }).then((result) => {
            result.partials.should.be.an.Array().with.lengthOf(2);
            result.partials.should.eql(['mypartial', 'subfolder\\test']);
        });
    });

    it('can extract custom settings from package.json', function () {
        return readTheme(themePath('theme-with-custom-settings')).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            should.exist(theme.customSettings);

            theme.customSettings.should.deepEqual({
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

        theme.should.be.a.ValidThemeObject();

        should.exist(theme.customSettings);
        theme.customSettings.should.deepEqual({});
    });

    it('extractTemplates ignores partials and assets templates', function () {
        const templates = extractTemplates([
            {file: 'partials/author-card.hbs'},
            {file: 'partials\\post-card.hbs'},
            {file: 'assets/ignoreme.hbs'},
            {file: 'post.hbs'},
            {file: 'custom-about.hbs'},
            {file: 'notes.txt'}
        ]);

        templates.should.eql(['post', 'custom-about']);
    });

    it('extractCustomTemplates handles supported names and ignores nested templates', function () {
        const templates = extractCustomTemplates([
            'post-featured',
            'page-contact',
            'custom-long-form',
            'custom/nested',
            'index'
        ]);

        templates.should.eql([
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
                filename: 'custom-long-form',
                name: 'Long Form',
                for: ['page', 'post'],
                slug: null
            }
        ]);
    });
});
