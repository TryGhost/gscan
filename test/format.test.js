const themePath = require('./utils').themePath;
const {check} = require('../lib/checker');

const format = require('../lib/format');

describe('Format', function () {
    describe('v2', function () {
        const options = {checkVersion: 'v2'};

        it('assert sorting in invalid theme', function (done) {
            check(themePath('005-compile/v2/invalid'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error.length.should.eql(26);
                theme.results.error[0].fatal.should.eql(true);
                // theme.results.error[1].fatal.should.eql(true);
                // theme.results.error[2].fatal.should.eql(true);
                theme.results.error[3].fatal.should.eql(false);
                // theme.results.error[10].fatal.should.eql(false);

                done();
            }).catch(done);
        });

        it('assert sorting in empty theme', function (done) {
            check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error[0].fatal.should.eql(true);
                theme.results.error[1].fatal.should.eql(true);
                theme.results.error[4].fatal.should.eql(false);
                theme.results.error[10].fatal.should.eql(false);
                theme.results.error[11].fatal.should.eql(false);
                theme.results.error[12].fatal.should.eql(false);

                done();
            }).catch(done);
        });

        it('sort by files for invalid theme', function (done) {
            check(themePath('005-compile/v2/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(1);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(1);

                theme.results.warning.all.length.should.eql(3);
                theme.results.warning.byFiles['default.hbs'].length.should.eql(2);

                theme.results.error.all.length.should.eql(26);

                // 1 rule has file references
                theme.results.error.byFiles['author.hbs'].length.should.eql(1);
                theme.results.error.byFiles['page.hbs'].length.should.eql(1);
                theme.results.error.byFiles['post.hbs'].length.should.eql(1);
                theme.results.error.byFiles['index.hbs'].length.should.eql(1);
                theme.results.error.byFiles['package.json'].length.should.eql(9);

                done();
            }).catch(done);
        });

        it('sort by files for invalid_all theme', function (done) {
            check(themePath('001-deprecations/v2/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(2);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(1);

                theme.results.error.all.length.should.eql(97);
                theme.results.warning.all.length.should.eql(5);

                theme.results.error.byFiles['assets/my.css'].length.should.eql(3);
                theme.results.error.byFiles['default.hbs'].length.should.eql(16);
                theme.results.error.byFiles['post.hbs'].length.should.eql(54);
                theme.results.error.byFiles['partials/mypartial.hbs'].length.should.eql(5);
                theme.results.error.byFiles['index.hbs'].length.should.eql(9);

                done();
            }).catch(done);
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v2/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                theme.results.error[0].rule.should.equal('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                theme.results.error[0].details.should.startWith(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/api/handlebars-themes/helpers/pagination/).`);
            });
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('assert sorting in invalid theme', function (done) {
            check(themePath('005-compile/v3/invalid'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error.length.should.eql(27);
                theme.results.error[0].fatal.should.eql(true);
                // theme.results.error[1].fatal.should.eql(true);
                // theme.results.error[2].fatal.should.eql(true);
                theme.results.error[3].fatal.should.eql(false);
                // theme.results.error[10].fatal.should.eql(false);

                done();
            }).catch(done);
        });

        it('assert sorting in empty theme', function (done) {
            check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error[0].fatal.should.eql(true);
                theme.results.error[1].fatal.should.eql(true);
                theme.results.error[4].fatal.should.eql(false);
                theme.results.error[10].fatal.should.eql(false);
                theme.results.error[11].fatal.should.eql(false);
                theme.results.error[12].fatal.should.eql(false);

                done();
            }).catch(done);
        });

        it('sort by files for invalid theme', function (done) {
            check(themePath('005-compile/v3/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(1);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(1);

                theme.results.warning.all.length.should.eql(4);
                theme.results.warning.byFiles['default.hbs'].length.should.eql(2);

                theme.results.error.all.length.should.eql(27);

                // 1 rule has file references
                theme.results.error.byFiles['author.hbs'].length.should.eql(1);
                theme.results.error.byFiles['page.hbs'].length.should.eql(1);
                theme.results.error.byFiles['post.hbs'].length.should.eql(1);
                theme.results.error.byFiles['index.hbs'].length.should.eql(1);
                theme.results.error.byFiles['package.json'].length.should.eql(10);

                done();
            }).catch(done);
        });

        it('sort by files for invalid_all theme', function (done) {
            check(themePath('001-deprecations/v3/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(2);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(1);

                theme.results.error.all.length.should.eql(99);
                theme.results.warning.all.length.should.eql(6);

                theme.results.error.byFiles['assets/my.css'].length.should.eql(3);
                theme.results.error.byFiles['default.hbs'].length.should.eql(17);
                theme.results.error.byFiles['post.hbs'].length.should.eql(54);
                theme.results.error.byFiles['partials/mypartial.hbs'].length.should.eql(5);
                theme.results.error.byFiles['index.hbs'].length.should.eql(9);

                done();
            }).catch(done);
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v4/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                theme.results.error[0].rule.should.equal('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                theme.results.error[0].details.should.startWith(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/api/handlebars-themes/helpers/pagination/).`);
            });
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('assert sorting in invalid theme', function (done) {
            check(themePath('005-compile/v4/invalid'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error.length.should.eql(35);
                theme.results.error[0].fatal.should.eql(true);
                // theme.results.error[1].fatal.should.eql(true);
                // theme.results.error[2].fatal.should.eql(true);
                theme.results.error[3].fatal.should.eql(false);
                // theme.results.error[10].fatal.should.eql(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                fatalErrors.length.should.eql(1);
                fatalErrors.map(e => e.code).should.eql([
                    'GS005-TPL-ERR'
                ]);

                done();
            }).catch(done);
        });

        it('assert sorting in empty theme', function (done) {
            check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error[0].fatal.should.eql(true);
                theme.results.error[1].fatal.should.eql(true);
                theme.results.error[4].fatal.should.eql(false);
                theme.results.error[10].fatal.should.eql(false);
                theme.results.error[11].fatal.should.eql(false);
                theme.results.error[12].fatal.should.eql(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                fatalErrors.length.should.eql(2);
                fatalErrors.map(e => e.code).should.eql([
                    'GS020-INDEX-REQ',
                    'GS020-POST-REQ'
                ]);

                done();
            }).catch(done);
        });

        it('sort by files for invalid theme', function (done) {
            check(themePath('005-compile/v4/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(2);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(2);

                theme.results.warning.all.length.should.eql(5);
                theme.results.warning.byFiles['default.hbs'].length.should.eql(2);

                theme.results.error.all.length.should.eql(35);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                fatalErrors.length.should.eql(1);
                fatalErrors.map(e => e.code).should.eql([
                    'GS005-TPL-ERR'
                ]);

                // 1 rule has file references
                theme.results.error.byFiles['author.hbs'].length.should.eql(1);
                theme.results.error.byFiles['page.hbs'].length.should.eql(1);
                theme.results.error.byFiles['post.hbs'].length.should.eql(1);
                theme.results.error.byFiles['index.hbs'].length.should.eql(1);
                theme.results.error.byFiles['package.json'].length.should.eql(18);

                done();
            }).catch(done);
        });

        it('sort by files for invalid_all theme', function (done) {
            check(themePath('001-deprecations/v4/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(3);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(2);

                theme.results.error.all.length.should.eql(107);
                theme.results.warning.all.length.should.eql(9);

                theme.results.error.byFiles['assets/my.css'].length.should.eql(3);
                theme.results.error.byFiles['default.hbs'].length.should.eql(17);
                theme.results.error.byFiles['post.hbs'].length.should.eql(54);
                theme.results.error.byFiles['partials/mypartial.hbs'].length.should.eql(5);
                theme.results.error.byFiles['index.hbs'].length.should.eql(9);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                fatalErrors.length.should.eql(23);
                fatalErrors.map(e => e.code).should.eql([
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS005-TPL-ERR'
                ]);

                theme.results.warning.byFiles['index.hbs'].length.should.eql(1);

                done();
            }).catch(done);
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v4/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                theme.results.error[0].rule.should.equal('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                theme.results.error[0].details.should.startWith(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/api/handlebars-themes/helpers/pagination/).`);
            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('assert sorting in invalid theme', function (done) {
            check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error.length.should.eql(36);
                theme.results.error[0].fatal.should.eql(true);
                // theme.results.error[1].fatal.should.eql(true);
                // theme.results.error[2].fatal.should.eql(true);
                theme.results.error[3].fatal.should.eql(false);
                // theme.results.error[10].fatal.should.eql(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                fatalErrors.length.should.eql(2);
                fatalErrors.map(e => e.code).should.eql([
                    'GS001-DEPR-BLOG',
                    'GS005-TPL-ERR'
                ]);

                done();
            }).catch(done);
        });

        it('assert sorting in empty theme', function (done) {
            check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error[0].fatal.should.eql(true);
                theme.results.error[1].fatal.should.eql(true);
                theme.results.error[4].fatal.should.eql(false);
                theme.results.error[10].fatal.should.eql(false);
                theme.results.error[11].fatal.should.eql(false);
                theme.results.error[12].fatal.should.eql(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                fatalErrors.length.should.eql(2);
                fatalErrors.map(e => e.code).should.eql([
                    'GS020-INDEX-REQ',
                    'GS020-POST-REQ'
                ]);

                done();
            }).catch(done);
        });

        it('sort by files for invalid theme', function (done) {
            check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(2);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(2);

                theme.results.warning.all.length.should.eql(4);
                theme.results.warning.byFiles['default.hbs'].length.should.eql(2);

                theme.results.error.all.length.should.eql(36);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                fatalErrors.length.should.eql(2);
                fatalErrors.map(e => e.code).should.eql([
                    'GS001-DEPR-BLOG',
                    'GS005-TPL-ERR'
                ]);

                // 1 rule has file references
                theme.results.error.byFiles['author.hbs'].length.should.eql(1);
                theme.results.error.byFiles['page.hbs'].length.should.eql(1);
                theme.results.error.byFiles['post.hbs'].length.should.eql(1);
                theme.results.error.byFiles['index.hbs'].length.should.eql(1);
                theme.results.error.byFiles['package.json'].length.should.eql(19);

                done();
            }).catch(done);
        });

        it('sort by files for invalid_all theme', function (done) {
            check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(3);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(2);

                theme.results.error.all.length.should.eql(109);
                theme.results.warning.all.length.should.eql(8);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                fatalErrors.length.should.eql(25);
                fatalErrors.map(e => e.code).should.eql([
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-BLOG',
                    'GS005-TPL-ERR',
                    'GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT'
                ]);

                theme.results.error.byFiles['assets/my.css'].length.should.eql(3);
                theme.results.error.byFiles['default.hbs'].length.should.eql(17);
                theme.results.error.byFiles['post.hbs'].length.should.eql(55);
                theme.results.error.byFiles['partials/mypartial.hbs'].length.should.eql(5);
                theme.results.error.byFiles['index.hbs'].length.should.eql(9);

                theme.results.warning.byFiles['index.hbs'].length.should.eql(1);

                done();
            }).catch(done);
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                theme.results.error[0].rule.should.equal('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                theme.results.error[0].details.should.startWith(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/api/handlebars-themes/helpers/pagination/).`);
            });
        });
    });
});
