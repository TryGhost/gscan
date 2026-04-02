const {check} = require('../lib/checker');
const format = require('../lib/format');
const calcScore = require('../lib/utils/score-calculator');
const getPackageJSON = require('../lib/utils/package-json');
const BaseRule = require('../lib/ast-linter/rules/base');
const NoLimitAllInGetHelper = require('../lib/ast-linter/rules/lint-no-limit-all-in-get-helper');
const NoLimitOver100InGetHelper = require('../lib/ast-linter/rules/lint-no-limit-over-100-in-get-helper');
const NoMultiParamConditionals = require('../lib/ast-linter/rules/lint-no-multi-param-conditionals');

describe('Coverage gaps', function () {
    it('wraps read-theme failures when checking a directory', async function () {
        try {
            await check('/tmp/gscan-this-path-does-not-exist', {checkVersion: 'v6'});
            throw new Error('Expected check() to throw for a missing theme path');
        } catch (err) {
            expect(err.errorType).toEqual('ValidationError');
            expect(err.message).toEqual('Failed theme files check');
            expect(err.help).toEqual('Your theme file structure is corrupted or contains errors');
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

        expect(result.results.recommendation.all).toHaveLength(1);
        expect(result.results.recommendation.byFiles).toEqual({});
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

        expect(result.results.error.all).toHaveLength(1);
        expect(result.results.warning.all).toHaveLength(1);
        expect(result.results.error.byFiles).toEqual({});
        expect(result.results.warning.byFiles).toEqual({});
    });

    it('calculates score levels for error, warning, and passing states', function () {
        expect(calcScore({
            error: [{code: 'A'}],
            warning: [],
            recommendation: []
        }, {
            error: 1,
            warning: 0,
            recommendation: 0
        }).level).toEqual('error');

        expect(calcScore({
            error: [],
            warning: [{code: 'A'}, {code: 'B'}, {code: 'C'}],
            recommendation: [{code: 'D'}, {code: 'E'}]
        }, {
            error: 0,
            warning: 3,
            recommendation: 2
        }).level).toEqual('warning');

        expect(calcScore({
            error: [],
            warning: [],
            recommendation: []
        }, {
            error: 0,
            warning: 1,
            recommendation: 1
        }).level).toEqual('passing');
    });

    it('parses package.json safely and falls back to defaults on invalid JSON', function () {
        expect(getPackageJSON({
            files: [{
                file: 'package.json',
                content: '{"name":"my-theme","config":{"posts_per_page":10}}'
            }]
        }, {posts_per_page: 5, card_assets: true})).toEqual({
            name: 'my-theme',
            config: {
                posts_per_page: 10,
                card_assets: true
            }
        });

        expect(getPackageJSON({
            files: [{
                file: 'package.json',
                content: '{invalid'
            }]
        }, {posts_per_page: 5})).toEqual({
            config: {
                posts_per_page: 5
            }
        });

        expect(getPackageJSON({
            files: []
        }, {posts_per_page: 5})).toEqual({
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

        expect(baseRule.visitor()).toBeUndefined();
        expect(baseRule.sourceForNode({})).toBeUndefined();
    });

    it('exercises the program frame path in BaseRule visitor generation', function () {
        const baseRule = new BaseRule({
            name: 'base-test',
            log: () => {},
            source: 'x'
        });

        const visitor = baseRule.getVisitor({fileName: 'index.hbs'});
        expect(() => visitor.Program({
            loc: {
                start: {line: 1},
                column: 0
            }
        }, {parents: []})).toThrow();
    });

    it('supports unquoted limit values in get-helper limit-all and limit-over-100 checks', function () {
        const limitAllLogMock = vi.fn();
        const limitAllRule = new NoLimitAllInGetHelper({
            name: 'GS090-NO-LIMIT-ALL-IN-GET-HELPER',
            log: limitAllLogMock,
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
        expect(limitAllLogMock).toHaveBeenCalledTimes(1);

        const limitOver100LogMock = vi.fn();
        const limitOver100Rule = new NoLimitOver100InGetHelper({
            name: 'GS090-NO-LIMIT-OVER-100-IN-GET-HELPER',
            log: limitOver100LogMock,
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
        expect(limitOver100LogMock).toHaveBeenCalledTimes(1);
    });

    it('reports multi-param unless conditionals', function () {
        const logMock = vi.fn();
        const rule = new NoMultiParamConditionals({
            name: 'no-multi-param-conditionals',
            log: logMock,
            source: 'x',
            partials: [],
            helpers: []
        });

        rule._checkForMultipleParams({
            path: {original: 'unless'},
            params: [{original: 'a'}, {original: 'b'}],
            loc: {start: {line: 1, column: 0}, end: {line: 1, column: 1}}
        });

        expect(logMock).toHaveBeenCalledTimes(1);
    });
});
