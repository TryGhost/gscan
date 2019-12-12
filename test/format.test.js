const themePath = require('./utils').themePath;
const checker = require('../lib/checker');

const format = require('../lib/format');

describe('Format', function () {
    describe('v2', function () {
        const options = {checkVersion: 'v2'};

        it('assert sorting in invalid theme', function (done) {
            checker(themePath('005-compile/v2/invalid'), options).then((theme) => {
                theme = format(theme);

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
            checker(themePath('is-empty'), options).then((theme) => {
                theme = format(theme);

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
            checker(themePath('005-compile/v2/invalid'), options).then((theme) => {
                theme = format(theme, {sortByFiles: true});

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
            checker(themePath('001-deprecations/v2/invalid_all'), options).then((theme) => {
                theme = format(theme, {sortByFiles: true});

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
            return checker(themePath('001-deprecations/v2/invalid_all'), options).then((theme) => {
                theme = format(theme, {format: 'cli'});

                theme.results.error[0].rule.should.equal('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                theme.results.error[0].details.should.startWith(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/api/handlebars-themes/helpers/pagination/).`);
            });
        });
    });

    describe('canary:', function () {
        const options = {checkVersion: 'canary'};

        it('assert sorting in invalid theme', function (done) {
            checker(themePath('005-compile/canary/invalid'), options).then((theme) => {
                theme = format(theme);

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
            checker(themePath('is-empty'), options).then((theme) => {
                theme = format(theme);

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
            checker(themePath('005-compile/canary/invalid'), options).then((theme) => {
                theme = format(theme, {sortByFiles: true});

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
            checker(themePath('001-deprecations/canary/invalid_all'), options).then((theme) => {
                theme = format(theme, {sortByFiles: true});

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
            return checker(themePath('001-deprecations/canary/invalid_all'), options).then((theme) => {
                theme = format(theme, {format: 'cli'});

                theme.results.error[0].rule.should.equal('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                theme.results.error[0].details.should.startWith(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/api/handlebars-themes/helpers/pagination/).`);
            });
        });
    });
});
