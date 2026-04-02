const themePath = require('./utils').themePath;
const {check} = require('../lib/checker');

const format = require('../lib/format');

describe('Format', function () {
    describe('v2', function () {
        const options = {checkVersion: 'v2'};

        it('assert sorting in invalid theme', function () {
            return check(themePath('005-compile/v2/invalid'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error.length).toEqual(26);
                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[3].fatal).toEqual(false);

            });
        });

        it('assert sorting in empty theme', function () {
            return check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[1].fatal).toEqual(true);
                expect(theme.results.error[4].fatal).toEqual(false);
                expect(theme.results.error[10].fatal).toEqual(false);
                expect(theme.results.error[11].fatal).toEqual(false);
                expect(theme.results.error[12].fatal).toEqual(false);

            });
        });

        it('sort by files for invalid theme', function () {
            return check(themePath('005-compile/v2/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(1);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(1);

                expect(theme.results.warning.all.length).toEqual(3);
                expect(theme.results.warning.byFiles['default.hbs'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(26);

                // 1 rule has file references
                expect(theme.results.error.byFiles['author.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['page.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['package.json'].length).toEqual(9);

            });
        });

        it('sort by files for invalid_all theme', function () {
            return check(themePath('001-deprecations/v2/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(1);

                expect(theme.results.error.all.length).toEqual(97);
                expect(theme.results.warning.all.length).toEqual(5);

                expect(theme.results.error.byFiles['assets/my.css'].length).toEqual(3);
                expect(theme.results.error.byFiles['default.hbs'].length).toEqual(16);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(54);
                expect(theme.results.error.byFiles['partials/mypartial.hbs'].length).toEqual(5);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(9);

            });
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v2/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                expect(theme.results.error[0].rule).toEqual('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                expect(theme.results.error[0].details).toMatch(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                expect(theme.results.error[0].details).toMatch(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
            });
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('assert sorting in invalid theme', function () {
            return check(themePath('005-compile/v3/invalid'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error.length).toEqual(27);
                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[3].fatal).toEqual(false);

            });
        });

        it('assert sorting in empty theme', function () {
            return check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[1].fatal).toEqual(true);
                expect(theme.results.error[4].fatal).toEqual(false);
                expect(theme.results.error[10].fatal).toEqual(false);
                expect(theme.results.error[11].fatal).toEqual(false);
                expect(theme.results.error[12].fatal).toEqual(false);

            });
        });

        it('sort by files for invalid theme', function () {
            return check(themePath('005-compile/v3/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(1);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(1);

                expect(theme.results.warning.all.length).toEqual(4);
                expect(theme.results.warning.byFiles['default.hbs'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(27);

                // 1 rule has file references
                expect(theme.results.error.byFiles['author.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['page.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['package.json'].length).toEqual(10);

            });
        });

        it('sort by files for invalid_all theme', function () {
            return check(themePath('001-deprecations/v3/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(1);

                expect(theme.results.error.all.length).toEqual(99);
                expect(theme.results.warning.all.length).toEqual(6);

                expect(theme.results.error.byFiles['assets/my.css'].length).toEqual(3);
                expect(theme.results.error.byFiles['default.hbs'].length).toEqual(17);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(54);
                expect(theme.results.error.byFiles['partials/mypartial.hbs'].length).toEqual(5);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(9);

            });
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v4/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                expect(theme.results.error[0].rule).toEqual('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                expect(theme.results.error[0].details).toMatch(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                expect(theme.results.error[0].details).toMatch(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
            });
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('assert sorting in invalid theme', function () {
            return check(themePath('005-compile/v4/invalid'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error.length).toEqual(35);
                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[3].fatal).toEqual(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(1);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS005-TPL-ERR'
                ]);

            });
        });

        it('assert sorting in empty theme', function () {
            return check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[1].fatal).toEqual(true);
                expect(theme.results.error[4].fatal).toEqual(false);
                expect(theme.results.error[10].fatal).toEqual(false);
                expect(theme.results.error[11].fatal).toEqual(false);
                expect(theme.results.error[12].fatal).toEqual(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(2);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS020-INDEX-REQ',
                    'GS020-POST-REQ'
                ]);

            });
        });

        it('sort by files for invalid theme', function () {
            return check(themePath('005-compile/v4/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(2);

                expect(theme.results.warning.all.length).toEqual(5);
                expect(theme.results.warning.byFiles['default.hbs'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(35);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(1);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS005-TPL-ERR'
                ]);

                // 1 rule has file references
                expect(theme.results.error.byFiles['author.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['page.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['package.json'].length).toEqual(18);

            });
        });

        it('sort by files for invalid_all theme', function () {
            return check(themePath('001-deprecations/v4/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(107);
                expect(theme.results.warning.all.length).toEqual(10);

                expect(theme.results.error.byFiles['assets/my.css'].length).toEqual(3);
                expect(theme.results.error.byFiles['default.hbs'].length).toEqual(17);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(54);
                expect(theme.results.error.byFiles['partials/mypartial.hbs'].length).toEqual(5);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(9);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(23);
                expect(fatalErrors.map(e => e.code)).toEqual([
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

                expect(theme.results.warning.byFiles['index.hbs'].length).toEqual(1);

            });
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v4/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                expect(theme.results.error[0].rule).toEqual('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                expect(theme.results.error[0].details).toMatch(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                expect(theme.results.error[0].details).toMatch(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('assert sorting in invalid theme', function () {
            return check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error.length).toEqual(23);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(1);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS005-TPL-ERR'
                ]);

            });
        });

        it('assert sorting in empty theme', function () {
            return check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[1].fatal).toEqual(true);
                expect(theme.results.error[4].fatal).toEqual(false);
                expect(theme.results.error[10].fatal).toEqual(false);
                expect(theme.results.error[11].fatal).toEqual(false);
                expect(theme.results.error[12].fatal).toEqual(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(2);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS020-INDEX-REQ',
                    'GS020-POST-REQ'
                ]);

            });
        });

        it('sort by files for invalid theme', function () {
            return check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(2);

                expect(theme.results.warning.all.length).toEqual(7);
                expect(theme.results.warning.byFiles['default.hbs'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(23);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(1);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS005-TPL-ERR'
                ]);

                // two rules have file references
                expect(theme.results.error.byFiles['author.hbs'].length).toEqual(1);
                // page.hbs uses @blog which is deprecated and triggers the second rule failure
                expect(theme.results.error.byFiles['page.hbs'].length).toEqual(3);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['package.json'].length).toEqual(17);

            });
        });

        it('sort by files for invalid_all theme', function () {
            return check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(105);
                expect(theme.results.warning.all.length).toEqual(9);

                const errorErrors = theme.results.error.all
                    .filter(error => (error.level === 'error') && !error.fatal);

                expect(errorErrors.length).toEqual(69);
                expect(errorErrors.map(e => e.code)).toEqual([
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
                expect(fatalErrors.length).toEqual(36);
                expect(fatalErrors.map(e => e.code)).toEqual([
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

                expect(theme.results.error.byFiles['assets/my.css'].length).toEqual(3);
                expect(theme.results.error.byFiles['default.hbs'].length).toEqual(21);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(66);
                expect(theme.results.error.byFiles['partials/mypartial.hbs'].length).toEqual(5);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(14);

            });
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                expect(theme.results.error[0].rule).toEqual('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                expect(theme.results.error[0].details).toMatch(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                expect(theme.results.error[0].details).toMatch(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('assert sorting in invalid theme', function () {
            return check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error.length).toEqual(23);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(1);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS005-TPL-ERR'
                ]);

            });
        });

        it('assert sorting in empty theme', function () {
            return check(themePath('is-empty'), options).then((theme) => {
                theme = format(theme, options);

                expect(theme.results.error[0].fatal).toEqual(true);
                expect(theme.results.error[1].fatal).toEqual(true);
                expect(theme.results.error[4].fatal).toEqual(false);
                expect(theme.results.error[10].fatal).toEqual(false);
                expect(theme.results.error[11].fatal).toEqual(false);
                expect(theme.results.error[12].fatal).toEqual(false);

                const fatalErrors = theme.results.error.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(2);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS020-INDEX-REQ',
                    'GS020-POST-REQ'
                ]);

            });
        });

        it('sort by files for invalid theme', function () {
            return check(themePath('005-compile/v5/invalid'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(2);

                expect(theme.results.warning.all.length).toEqual(7);
                expect(theme.results.warning.byFiles['default.hbs'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(23);

                const fatalErrors = theme.results.error.all.filter(error => error.fatal);
                expect(fatalErrors.length).toEqual(1);
                expect(fatalErrors.map(e => e.code)).toEqual([
                    'GS005-TPL-ERR'
                ]);

                // two rules have file references
                expect(theme.results.error.byFiles['author.hbs'].length).toEqual(1);
                // page.hbs uses @blog which is deprecated and triggers the second rule failure
                expect(theme.results.error.byFiles['page.hbs'].length).toEqual(3);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(1);
                expect(theme.results.error.byFiles['package.json'].length).toEqual(17);

            });
        });

        it('sort by files for invalid_all theme', function () {
            return check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {sortByFiles: true});
                theme = format(theme, themeOptions);

                expect(theme.results.hasFatalErrors).toBe(true);

                expect(theme.results.recommendation.all.length).toEqual(2);
                expect(theme.results.recommendation.byFiles['package.json'].length).toEqual(2);

                expect(theme.results.error.all.length).toEqual(105);
                expect(theme.results.warning.all.length).toEqual(9);

                const errorErrors = theme.results.error.all
                    .filter(error => (error.level === 'error') && !error.fatal);

                expect(errorErrors.length).toEqual(69);
                expect(errorErrors.map(e => e.code)).toEqual([
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
                expect(fatalErrors.length).toEqual(36);
                expect(fatalErrors.map(e => e.code)).toEqual([
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

                expect(theme.results.error.byFiles['assets/my.css'].length).toEqual(3);
                expect(theme.results.error.byFiles['default.hbs'].length).toEqual(21);
                expect(theme.results.error.byFiles['post.hbs'].length).toEqual(66);
                expect(theme.results.error.byFiles['partials/mypartial.hbs'].length).toEqual(5);
                expect(theme.results.error.byFiles['index.hbs'].length).toEqual(14);

            });
        });

        it('formats for CLI output', function () {
            return check(themePath('001-deprecations/v5/invalid_all'), options).then((theme) => {
                const themeOptions = Object.assign({}, options, {format: 'cli'});
                theme = format(theme, themeOptions);

                expect(theme.results.error[0].rule).toEqual('Replace \u001b[36m{{pageUrl}}\u001b[39m with \u001b[36m{{page_url}}\u001b[39m');

                expect(theme.results.error[0].details).toMatch(`The helper \u001b[36m{{pageUrl}}\u001b[39m was replaced with \u001b[36m{{page_url}}\u001b[39m.\n`);
                expect(theme.results.error[0].details).toMatch(`Find more information about the \u001b[36m{{page_url}}\u001b[39m helper here (https://ghost.org/docs/themes/helpers/pagination/).`);
            });
        });
    });
});
