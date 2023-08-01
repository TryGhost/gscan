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
                theme.results.error[3].fatal.should.eql(false);

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
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
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
                theme.results.error[3].fatal.should.eql(false);

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
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
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
                theme.results.error[3].fatal.should.eql(false);

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

                theme.results.recommendation.all.length.should.eql(2);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(2);

                theme.results.error.all.length.should.eql(107);
                theme.results.warning.all.length.should.eql(10);

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
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('assert sorting in invalid theme', function (done) {
            check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                theme = format(theme, options);

                theme.results.error.length.should.eql(23);

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
            check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(2);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(2);

                theme.results.warning.all.length.should.eql(6);
                theme.results.warning.byFiles['default.hbs'].length.should.eql(2);

                theme.results.error.all.length.should.eql(23);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                fatalErrors.length.should.eql(1);
                fatalErrors.map(e => e.code).should.eql([
                    'GS005-TPL-ERR'
                ]);

                // two rules have file references
                theme.results.error.byFiles['author.hbs'].length.should.eql(1);
                // page.hbs uses @blog which is deprecated and triggers the second rule failure
                theme.results.error.byFiles['page.hbs'].length.should.eql(3);
                theme.results.error.byFiles['post.hbs'].length.should.eql(1);
                theme.results.error.byFiles['index.hbs'].length.should.eql(1);
                theme.results.error.byFiles['package.json'].length.should.eql(17);

                done();
            }).catch(done);
        });

        it('sort by files for invalid_all theme', function (done) {
            check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                theme.results.hasFatalErrors.should.be.true();

                theme.results.recommendation.all.length.should.eql(2);
                theme.results.recommendation.byFiles['package.json'].length.should.eql(2);

                theme.results.error.all.length.should.eql(105);
                theme.results.warning.all.length.should.eql(8);

                const errorErrors = theme.results.error.all
                    .filter(error => (error.level === 'error') && !error.fatal);

                errorErrors.length.should.eql(69);
                errorErrors.map(e => e.code).should.eql([
                    'GS001-DEPR-MD',
                    'GS001-DEPR-AIMG',
                    'GS001-DEPR-AC',
                    'GS001-DEPR-PAIMG',
                    'GS001-DEPR-PAC',
                    'GS001-DEPR-CON-AC',
                    'GS001-DEPR-CON-AIMG',
                    'GS001-DEPR-CON-PAC',
                    'GS001-DEPR-CON-PAIMG',
                    'GS001-DEPR-PPP',
                    'GS001-DEPR-C0H',
                    'GS001-DEPR-CSS-AT',
                    'GS001-DEPR-CSS-PATS',
                    'GS001-DEPR-USER-GET',
                    'GS001-DEPR-AUTH-INCL',
                    'GS001-DEPR-AUTH-FIELD',
                    'GS001-DEPR-AUTH-FILT',
                    'GS001-DEPR-AUTHBL',
                    'GS001-DEPR-CON-AUTH',
                    'GS001-DEPR-CON-PAUTH',
                    'GS001-DEPR-AUTH',
                    'GS001-DEPR-AUTH-ID',
                    'GS001-DEPR-AUTH-SLUG',
                    'GS001-DEPR-AUTH-MAIL',
                    'GS001-DEPR-AUTH-MT',
                    'GS001-DEPR-AUTH-MD',
                    'GS001-DEPR-AUTH-NAME',
                    'GS001-DEPR-AUTH-BIO',
                    'GS001-DEPR-AUTH-LOC',
                    'GS001-DEPR-AUTH-WEB',
                    'GS001-DEPR-AUTH-TW',
                    'GS001-DEPR-AUTH-FB',
                    'GS001-DEPR-AUTH-PIMG',
                    'GS001-DEPR-AUTH-CIMG',
                    'GS001-DEPR-AUTH-URL',
                    'GS001-DEPR-IUA',
                    'GS001-DEPR-BLOG',
                    'GS001-DEPR-LANG',
                    'GS001-DEPR-ESC',
                    'GS001-DEPR-LABS-MEMBERS',
                    'GS001-DEPR-CURR-SYM',
                    'GS001-DEPR-SITE-LANG',
                    'GS010-PJ-REQ',
                    'GS010-PJ-PARSE',
                    'GS010-PJ-NAME-REQ',
                    'GS010-PJ-NAME-LC',
                    'GS010-PJ-NAME-HY',
                    'GS010-PJ-VERSION-SEM',
                    'GS010-PJ-VERSION-REQ',
                    'GS010-PJ-AUT-EM-VAL',
                    'GS010-PJ-AUT-EM-REQ',
                    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS',
                    'GS010-PJ-CUST-THEME-SETTINGS-CASE',
                    'GS010-PJ-CUST-THEME-SETTINGS-TYPE',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS',
                    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT',
                    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT',
                    'GS050-CSS-KGWW',
                    'GS050-CSS-KGWF',
                    'GS090-NO-PRODUCTS-HELPER',
                    'GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT',
                    'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL',
                    'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT',
                    'GS090-NO-PRICE-DATA-MONTHLY-YEARLY',
                    'GS090-NO-TIER-PRICE-AS-OBJECT',
                    'GS110-NO-MISSING-PAGE-BUILDER-USAGE',
                    'GS120-NO-UNKNOWN-GLOBALS'
                ]);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                fatalErrors.length.should.eql(36);
                fatalErrors.map(e => e.code).should.eql([
                    'GS001-DEPR-PURL',
                    'GS001-DEPR-IMG',
                    'GS001-DEPR-COV',
                    'GS001-DEPR-PIMG',
                    'GS001-DEPR-BC',
                    'GS001-DEPR-TIMG',
                    'GS001-DEPR-PTIMG',
                    'GS001-DEPR-TSIMG',
                    'GS001-DEPR-CON-IMG',
                    'GS001-DEPR-CON-COV',
                    'GS001-DEPR-CON-BC',
                    'GS001-DEPR-CON-TIMG',
                    'GS001-DEPR-CON-PTIMG',
                    'GS001-DEPR-CON-TSIMG',
                    'GS001-DEPR-PAUTH',
                    'GS001-DEPR-PAUTH-ID',
                    'GS001-DEPR-PAUTH-SLUG',
                    'GS001-DEPR-PAUTH-MAIL',
                    'GS001-DEPR-PAUTH-MT',
                    'GS001-DEPR-PAUTH-MD',
                    'GS001-DEPR-PAUTH-NAME',
                    'GS001-DEPR-PAUTH-BIO',
                    'GS001-DEPR-PAUTH-LOC',
                    'GS001-DEPR-PAUTH-WEB',
                    'GS001-DEPR-PAUTH-TW',
                    'GS001-DEPR-PAUTH-FB',
                    'GS001-DEPR-PAUTH-PIMG',
                    'GS001-DEPR-PAUTH-CIMG',
                    'GS001-DEPR-PAUTH-URL',
                    'GS001-DEPR-PAID',
                    'GS001-DEPR-NAUTH',
                    'GS001-DEPR-BPL',
                    'GS001-DEPR-SPL',
                    'GS001-DEPR-SGH',
                    'GS001-DEPR-SGF',
                    'GS005-TPL-ERR'
                ]);

                theme.results.error.byFiles['assets/my.css'].length.should.eql(3);
                theme.results.error.byFiles['default.hbs'].length.should.eql(21);
                theme.results.error.byFiles['post.hbs'].length.should.eql(65);
                theme.results.error.byFiles['partials/mypartial.hbs'].length.should.eql(5);
                theme.results.error.byFiles['index.hbs'].length.should.eql(14);

                done();
            }).catch(done);
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                theme.results.error[0].rule.should.equal('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                theme.results.error[0].details.should.startWith(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                theme.results.error[0].details.should.endWith(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
            });
        });
    });
});
