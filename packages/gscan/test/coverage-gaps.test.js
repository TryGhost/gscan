const should = require('should');
const {check} = require('../lib/checker');
const format = require('../lib/format');
const calcScore = require('../lib/utils/score-calculator');
const getPackageJSON = require('../lib/utils/package-json');
const BaseRule = require('../lib/ast-linter/rules/base');
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
});
