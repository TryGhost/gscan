const should = require('should');
const {check} = require('../lib/checker');
const format = require('../lib/format');
const calcScore = require('../lib/utils/score-calculator');
const deepMerge = require('../lib/utils/deep-merge');
const getPackageJSON = require('../lib/utils/package-json');
const checkPackageJSON = require('../lib/checks/010-package-json');
const checkAssets = require('../lib/checks/030-assets');
const checkCustomFontsCssProperties = require('../lib/checks/051-custom-fonts-css-properties');
const checkGhostUrlAPI = require('../lib/checks/060-js-api-usage');
const BaseRule = require('../lib/ast-linter/rules/base');
const MarkDeclaredInlinePartials = require('../lib/ast-linter/rules/mark-declared-inline-partials');
const MarkUsedHelpers = require('../lib/ast-linter/rules/mark-used-helpers');
const MarkUsedPartials = require('../lib/ast-linter/rules/mark-used-partials');
const sinon = require('sinon');
const NoLimitAllInGetHelper = require('../lib/ast-linter/rules/lint-no-limit-all-in-get-helper');
const NoLimitOver100InGetHelper = require('../lib/ast-linter/rules/lint-no-limit-over-100-in-get-helper');
const NoMultiParamConditionals = require('../lib/ast-linter/rules/lint-no-multi-param-conditionals');

describe('Coverage gaps', function () {
    it('wraps read-theme failures when checking a directory', async function () {
        try {
            await check('/tmp/gscan-this-path-does-not-exist', {checkVersion: 'v6'});
            should.fail('Expected check() to throw for a missing theme path');
        } catch (err) {
            should.equal(err.errorType, 'ValidationError');
            should.equal(err.message, 'Failed theme files check');
            should.equal(err.help, 'Your theme file structure is corrupted or contains errors');
        }
    });

    it('handles recommendation entries without file references when sorting by file', function () {
        const result = format({
            results: {
                pass: [],
                fail: {
                    'GS020-DEF-REC': {}
                }
            }
        }, {
            checkVersion: 'v6',
            sortByFiles: true
        });

        result.results.recommendation.all.should.have.length(1);
        result.results.recommendation.byFiles.should.deepEqual({});
    });

    it('skips error and warning grouping when failures are missing', function () {
        const result = format({
            results: {
                pass: [],
                fail: {
                    'GS010-PJ-NAME-REQ': {},
                    'GS010-PJ-KEYWORDS': {}
                }
            }
        }, {
            checkVersion: 'v6',
            sortByFiles: true
        });

        result.results.error.all.should.have.length(1);
        result.results.warning.all.should.have.length(1);
        result.results.error.byFiles.should.deepEqual({});
        result.results.warning.byFiles.should.deepEqual({});
    });

    it('calculates score levels for error, warning, and passing states', function () {
        calcScore({
            error: [{code: 'A'}],
            warning: [],
            recommendation: []
        }, {
            error: 1,
            warning: 0,
            recommendation: 0
        }).level.should.eql('error');

        calcScore({
            error: [],
            warning: [{code: 'A'}, {code: 'B'}, {code: 'C'}],
            recommendation: [{code: 'D'}, {code: 'E'}]
        }, {
            error: 0,
            warning: 3,
            recommendation: 2
        }).level.should.eql('warning');

        calcScore({
            error: [],
            warning: [],
            recommendation: []
        }, {
            error: 0,
            warning: 1,
            recommendation: 1
        }).level.should.eql('passing');
    });

    it('handles missing result levels when calculating score', function () {
        calcScore({}, {
            error: 1,
            warning: 1,
            recommendation: 1
        }).should.deepEqual({
            value: 100,
            level: 'passing'
        });
    });

    it('deep-merges nested plain objects and handles invalid targets and empty sources', function () {
        deepMerge(null, undefined, {alpha: 1}).should.deepEqual({alpha: 1});
        deepMerge({nested: 1}, {nested: {beta: true}}).should.deepEqual({nested: {beta: true}});
        deepMerge({nested: {left: true}}, {nested: {right: true}}).should.deepEqual({
            nested: {
                left: true,
                right: true
            }
        });
    });

    it('handles object card_assets values when validating package.json', function () {
        const basePackageJSON = {
            name: 'theme-name',
            version: '1.0.0',
            author: {
                email: 'owner@example.com'
            },
            keywords: ['ghost-theme'],
            config: {
                posts_per_page: 10
            }
        };

        const createTheme = packageJSON => ({
            files: [{
                file: 'package.json',
                content: JSON.stringify(packageJSON)
            }],
            results: {
                pass: [],
                fail: {}
            }
        });

        const emptyObjectResult = checkPackageJSON(createTheme({
            ...basePackageJSON,
            config: {
                ...basePackageJSON.config,
                card_assets: {}
            }
        }), {checkVersion: 'v6'});

        should.exist(emptyObjectResult.results.fail['GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT']);

        const nonEmptyObjectResult = checkPackageJSON(createTheme({
            ...basePackageJSON,
            config: {
                ...basePackageJSON.config,
                card_assets: {
                    exclude: ['audio']
                }
            }
        }), {checkVersion: 'v6'});

        should.not.exist(nonEmptyObjectResult.results.fail['GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT']);
    });

    it('parses package.json safely and falls back to defaults on invalid JSON', function () {
        getPackageJSON({
            files: [{
                file: 'package.json',
                content: '{"name":"my-theme","config":{"posts_per_page":10}}'
            }]
        }, {posts_per_page: 5, card_assets: true}).should.deepEqual({
            name: 'my-theme',
            config: {
                posts_per_page: 10,
                card_assets: true
            }
        });

        getPackageJSON({
            files: [{
                file: 'package.json',
                content: '{invalid'
            }]
        }, {posts_per_page: 5}).should.deepEqual({
            config: {
                posts_per_page: 5
            }
        });

        getPackageJSON({
            files: []
        }, {posts_per_page: 5}).should.deepEqual({
            config: {
                posts_per_page: 5
            }
        });
    });

    it('returns undefined source snippets for nodes without location data', function () {
        const baseRule = new BaseRule({
            name: 'base-test',
            log: () => {},
            source: ''
        });

        should.equal(baseRule.visitor(), undefined);
        should.equal(baseRule.sourceForNode({}), undefined);
    });

    it('exercises the program frame path in BaseRule visitor generation', function () {
        const baseRule = new BaseRule({
            name: 'base-test',
            log: () => {},
            source: 'x'
        });

        const visitor = baseRule.getVisitor({fileName: 'index.hbs'});
        (() => visitor.Program({
            loc: {
                start: {line: 1},
                column: 0
            }
        }, {parents: []})).should.throw();
    });

    it('supports unquoted limit values in get-helper limit-all and limit-over-100 checks', function () {
        const limitAllLog = sinon.spy();
        const limitAllRule = new NoLimitAllInGetHelper({
            name: 'GS090-NO-LIMIT-ALL-IN-GET-HELPER',
            log: limitAllLog,
            source: 'x',
            partials: [],
            helpers: []
        });

        limitAllRule._checkForLimitAll({
            type: 'BlockStatement',
            path: {data: false, parts: ['get']},
            hash: {pairs: [{key: 'limit', value: {original: 'all'}}]},
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 1}}
        });
        limitAllLog.calledOnce.should.eql(true);

        const limitOver100Log = sinon.spy();
        const limitOver100Rule = new NoLimitOver100InGetHelper({
            name: 'GS090-NO-LIMIT-OVER-100-IN-GET-HELPER',
            log: limitOver100Log,
            source: 'x',
            partials: [],
            helpers: []
        });

        limitOver100Rule._checkForLimitOver100({
            type: 'BlockStatement',
            path: {data: false, parts: ['get']},
            hash: {pairs: [{key: 'limit', value: {original: '150'}}]},
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 1}}
        });
        limitOver100Log.calledOnce.should.eql(true);
    });

    it('reports multi-param unless conditionals', function () {
        const logSpy = sinon.spy();
        const rule = new NoMultiParamConditionals({
            name: 'no-multi-param-conditionals',
            log: logSpy,
            source: 'x',
            partials: [],
            helpers: []
        });

        rule._checkForMultipleParams({
            path: {original: 'unless'},
            params: [{original: 'a'}, {original: 'b'}],
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 1}}
        });

        logSpy.calledOnce.should.eql(true);
    });

    it('marks declared inline partials and ignores non-inline decorators', function () {
        const rule = new MarkDeclaredInlinePartials({
            name: 'mark-declared-inline-partials',
            log: () => {},
            source: 'x',
            partials: [],
            helpers: []
        });
        rule.scanner = {context: {inlinePartials: []}};

        rule._markDeclaredInlinePartials({
            type: 'DecoratorBlock',
            path: {original: 'inline'},
            params: [{original: 'hero'}],
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 10}}
        }, {
            parents: [{type: 'Program', loc: {start: {line: 1, column: 0}, end: {line: 1, column: 1}}}]
        });

        rule._markDeclaredInlinePartials({
            type: 'DecoratorBlock',
            path: {original: 'other'},
            params: [{original: 'ignored'}],
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 10}}
        }, {parents: []});

        rule._markDeclaredInlinePartials({
            type: 'DecoratorBlock',
            path: {original: 'inline'},
            params: [],
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 10}}
        }, {parents: []});

        rule.scanner.context.inlinePartials.should.have.length(1);
        rule.visitor().should.have.property('DecoratorBlock');
    });

    it('marks helper-like nodes and handles missing params safely', function () {
        const rule = new MarkUsedHelpers({
            name: 'mark-used-helpers',
            log: () => {},
            source: 'x',
            partials: [],
            helpers: []
        });
        rule.scanner = {context: {helpers: []}};

        rule._markUsedHelpers({
            type: 'MustacheStatement',
            path: {
                type: 'PathExpression',
                data: false,
                parts: ['title'],
                original: 'title'
            },
            params: [],
            hash: {pairs: []},
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 7}}
        });

        rule._markUsedHelpers({
            type: 'MustacheStatement',
            path: {
                type: 'PathExpression',
                data: true,
                parts: ['member'],
                original: '@member'
            },
            hash: {pairs: []},
            loc: {start: {line: 2, column: 0}, end: {line: 2, column: 8}}
        });

        rule.scanner.context.helpers.should.have.length(2);
        rule.visitor().should.have.properties(['BlockStatement', 'MustacheStatement', 'SubExpression']);
    });

    it('marks used partials only when a partial name exists', function () {
        const rule = new MarkUsedPartials({
            name: 'mark-used-partials',
            log: () => {},
            source: 'x',
            partials: [],
            helpers: []
        });
        rule.scanner = {context: {partials: []}};

        rule._markUsedPartials({
            type: 'PartialStatement',
            name: {original: 'partials/hero'},
            params: [],
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 15}}
        });

        rule._markUsedPartials({
            type: 'PartialStatement',
            name: {original: 'partials/footer'},
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 17}}
        });

        rule._markUsedPartials({
            type: 'PartialStatement',
            name: {original: ''},
            params: [],
            loc: {start: {line: 2, column: 0}, end: {line: 2, column: 4}}
        });

        rule.scanner.context.partials.should.have.length(2);
        rule.visitor().should.have.properties(['PartialStatement', 'PartialBlockStatement']);
    });

    it('handles invalid template content in assets check', function () {
        const result = checkAssets({
            files: [{
                file: 'index.hbs',
                ext: '.hbs',
                content: Symbol('invalid')
            }],
            results: {
                pass: [],
                fail: {}
            }
        }, {checkVersion: 'v6'});

        result.results.pass.should.containEql('GS030-ASSET-REQ');
    });

    it('handles invalid file content in custom-font CSS checks', function () {
        const result = checkCustomFontsCssProperties({
            files: [{
                file: 'assets/bad.css',
                ext: '.css',
                content: Symbol('invalid')
            }],
            results: {
                pass: [],
                fail: {}
            }
        }, {checkVersion: 'v6'});

        Object.keys(result.results.fail).length.should.be.above(0);
    });

    it('handles invalid file content in JS API usage check', function () {
        const result = checkGhostUrlAPI({
            files: [{
                file: 'assets/bad.js',
                ext: '.js',
                content: Symbol('invalid')
            }],
            results: {
                pass: [],
                fail: {}
            }
        }, {checkVersion: 'v6'});

        result.results.pass.should.containEql('GS060-JS-GUA');
    });
});
