const _ = require('lodash');
const fs = require('fs-extra');
const sinon = require('sinon');
const rewire = require('rewire');
const themePath = require('./utils').themePath;
const readTheme = rewire('../lib/read-theme');

describe('Read theme', function () {
    let sandbox;

    before(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('returns correct result', function (done) {
        readTheme(themePath('is-empty')).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.eql([
                {file: '.gitkeep', ext: '.gitkeep'},
                {file: 'README.md', ext: '.md'}
            ]);
            done();
        }).catch(done);
    });

    it('Can read partials', function (done) {
        readTheme(themePath('theme-with-partials')).then((theme) => {
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

            done();
        }).catch(done);
    });

    it('Can extract custom templates', function (done) {
        readTheme(themePath('theme-with-custom-templates')).then((theme) => {
            theme.should.be.a.ValidThemeObject();

            theme.files.should.be.an.Array().with.lengthOf(12);
            theme.partials.length.should.eql(0);
            theme.templates.all.length.should.eql(9);
            theme.templates.custom.length.should.eql(4);

            // ensure we don't change the structure of theme.files
            theme.files[0].file.should.eql('assets/ignoreme.hbs');
            theme.files[0].ext.should.eql('.hbs');
            theme.files[0].content.should.eql('ignoreme');
            should.exist(theme.files[0].compiled);

            theme.files[1].file.should.eql('assets/styles.css');
            theme.files[1].ext.should.eql('.css');
            theme.files[1].content.should.eql('.some-class {\n    border: 0;\n}\n');
            should.not.exist(theme.files[1].compiled);

            theme.files[2].file.should.eql('custom/test.hbs');
            theme.files[2].ext.should.eql('.hbs');
            theme.files[2].content.should.eql('test');
            should.exist(theme.files[2].compiled);

            theme.files[3].file.should.eql('custom-My-Post.hbs');
            theme.files[3].ext.should.eql('.hbs');
            theme.files[3].content.should.eql('content');
            should.exist(theme.files[2].compiled);

            theme.templates.all.should.eql([
                'custom/test',
                'custom-My-Post',
                'custom-about',
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

            done();
        }).catch(done);
    });

    it('can read partials with POSIX paths', function (done) {
        // This roughly matches Example I
        const exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials/mypartial.hbs', ext: '.hbs'},
            {file: 'partials/subfolder/test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        sandbox.stub(fs, 'readFile').returns(Promise.resolve(''));

        readTheme.__get__('readFiles')({
            files: exampleI,
            path: 'fake/example-i'
        }).then((result) => {
            result.partials.should.be.an.Array().with.lengthOf(2);
            result.partials.should.eql(['mypartial', 'subfolder/test']);
            done();
        }).catch(done);
    });

    it('can read partials with windows paths', function (done) {
        // This matches Example I, but on Windows
        const exampleI = [
            {file: 'index.hbs', ext: '.hbs'},
            {file: 'package.json', ext: '.json'},
            {file: 'partialsbroke.hbs', ext: '.hbs'},
            {file: 'partials\\mypartial.hbs', ext: '.hbs'},
            {file: 'partials\\subfolder\\test.hbs', ext: '.hbs'},
            {file: 'post.hbs', ext: '.hbs'}
        ];

        sandbox.stub(fs, 'readFile').returns(Promise.resolve(''));

        readTheme.__get__('readFiles')({
            files: exampleI,
            path: 'fake\\example-i'
        })
            .then((result) => {
                result.partials.should.be.an.Array().with.lengthOf(2);
                result.partials.should.eql(['mypartial', 'subfolder\\test']);
                done();
            }).catch(done);
    });
});
