const should = require('should'); // eslint-disable-line no-unused-vars
const sinon = require('sinon');
const Handlebars = require('handlebars');

const Linter = require('../lib/ast-linter/linter');
const helpers = require('../lib/ast-linter/helpers');
const BaseRule = require('../lib/ast-linter/rules/base');
const ASTLinter = require('../lib/ast-linter');
const NoNestedAsyncHelpers = require('../lib/ast-linter/rules/lint-no-nested-async-helpers');
const NoPrevNextPostOutsidePostContext = require('../lib/ast-linter/rules/lint-no-prev-next-post-outside-post-context');
const customThemeSettingsUsage = require('../lib/checks/100-custom-template-settings-usage');
const pageBuilderUsage = require('../lib/checks/110-page-builder-usage');
const noUnknownGlobals = require('../lib/checks/120-no-unknown-globals');

describe('Branch coverage', function () {
    afterEach(function () {
        sinon.restore();
    });

    it('keeps linter state unchanged when scanner context collections are falsey', function () {
        const linter = new Linter();
        const acceptSpy = sinon.spy();

        sinon.stub(linter, 'buildScanner').returns({
            context: {
                partials: null,
                helpers: null,
                customThemeSettings: null,
                inlinePartials: null,
                usedPageProperties: null
            },
            accept: acceptSpy
        });

        const messages = linter.verify({
            parsed: {
                ast: Handlebars.parse('{{title}}')
            },
            moduleId: 'index.hbs',
            source: '{{title}}',
            rules: {}
        });

        messages.should.eql([]);
        acceptSpy.calledOnce.should.eql(true);
        linter.partials.should.eql([]);
        linter.helpers.should.eql([]);
        linter.customThemeSettings.should.eql([]);
        linter.inlinePartials.should.eql([]);
        linter.usedPageProperties.should.eql([]);
    });

    it('resolves helper node names from name.parts and name.original fallbacks', function () {
        helpers.getNodeName({
            type: 'PartialStatement',
            name: {
                parts: ['card']
            }
        }).should.eql('card');

        helpers.getNodeName({
            type: 'PartialStatement',
            name: {
                original: 'fallback-card'
            }
        }).should.eql('fallback-card');
    });

    it('treats inline partial declarations as accessible without explicit parents', function () {
        const rule = new BaseRule({
            name: 'base-test',
            log() {},
            source: '',
            partials: [],
            helpers: [],
            inlinePartials: [{
                node: 'card',
                parents: []
            }],
            customThemeSettings: {}
        });

        rule.isAccessibleInlinePartial({
            name: {
                original: 'card'
            }
        }).should.eql(true);
    });

    it('covers logger, applyRule, and parseWithAST branches for custom-theme-setting usage', function () {
        const {applyRule, getLogger, parseWithAST} = customThemeSettingsUsage._private;
        const verifyStub = sinon.stub(ASTLinter.prototype, 'verify');

        const theme = {
            files: [{
                file: 'index.hbs',
                normalizedFile: 'index.hbs',
                parsed: {
                    ast: {}
                },
                content: '{{title}}'
            }],
            results: {
                fail: {},
                pass: []
            }
        };

        const fileLogger = getLogger({
            theme,
            rule: {
                code: 'GS100-TEST'
            },
            file: {
                file: 'index.hbs'
            }
        });

        fileLogger.failure({message: 'first'});
        fileLogger.failure({message: 'second'});

        theme.results.fail['GS100-TEST'].failures.should.deepEqual([{
            message: 'first',
            rule: 'GS100-TEST',
            ref: 'index.hbs'
        }, {
            message: 'second',
            rule: 'GS100-TEST',
            ref: 'index.hbs'
        }]);

        const emptyTheme = {
            files: [],
            results: {
                fail: {},
                pass: []
            }
        };

        applyRule({
            code: 'GS100-BOOLEAN-FALSE',
            isEnabled: false
        }, emptyTheme);

        applyRule({
            code: 'GS100-BOOLEAN-TRUE',
            isEnabled: true
        }, emptyTheme);

        verifyStub.returns([{
            message: 'ast failure'
        }]);

        parseWithAST({
            theme,
            log: getLogger({
                theme,
                rule: {
                    code: 'GS100-PARSE'
                }
            }),
            file: theme.files[0],
            rules: {},
            partialVerificationCache: new Map()
        });

        theme.results.fail['GS100-PARSE'].failures.should.deepEqual([{
            message: 'ast failure',
            rule: 'GS100-PARSE'
        }]);
    });

    it('covers applyRule and parseWithAST branches for page-builder usage', function () {
        const {applyRule, getLogger, parseWithAST} = pageBuilderUsage._private;
        const verifyStub = sinon.stub(ASTLinter.prototype, 'verify');

        const theme = {
            files: [{
                file: 'partials/card.hbs',
                normalizedFile: 'partials/card.hbs',
                parsed: {
                    ast: {}
                },
                content: '{{title}}'
            }],
            results: {
                fail: {},
                pass: []
            }
        };

        applyRule({
            code: 'GS110-FUNCTION-DISABLED',
            isEnabled() {
                return false;
            }
        }, theme);

        applyRule({
            code: 'GS110-FUNCTION-ENABLED',
            isEnabled() {
                return true;
            }
        }, theme);

        verifyStub.returns([]);

        parseWithAST({
            theme,
            log: getLogger({
                theme,
                rule: {
                    code: 'GS110-PARSE'
                },
                file: theme.files[0]
            }),
            file: theme.files[0],
            rules: {
                'mark-used-partials': function DummyRule() {}
            },
            partialVerificationCache: new Map([
                ['partials/card.hbs', []]
            ])
        });

        should.equal(theme.results.fail['GS110-PARSE'], undefined);
        verifyStub.called.should.eql(false);
    });

    it('covers recursive partial processing branches for unknown-globals checks', function () {
        const {processFileFunction} = noUnknownGlobals._private;
        const failures = [];
        const partialsFound = {};
        const partialLoc = {
            source: 'index.hbs',
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 10
            }
        };
        const theme = {
            files: [{
                file: 'index.hbs',
                normalizedFile: 'index.hbs',
                parsed: {
                    ast: {}
                },
                content: '{{> card}}'
            }, {
                file: 'partials/card.hbs',
                normalizedFile: 'partials/card.hbs',
                parsed: {
                    ast: {}
                },
                content: '{{title}}'
            }]
        };
        const linter = {
            inlinePartials: [],
            options: {
                inlinePartials: []
            },
            helpers: [{
                name: 'asset'
            }],
            partials: [{
                node: 'card',
                normalizedName: 'card',
                type: 'PartialStatement',
                loc: partialLoc
            }],
            verify: sinon.stub()
        };

        linter.verify.onCall(0).callsFake(() => {
            linter.inlinePartials = [{
                node: 'local-card',
                parents: [{
                    type: 'PartialStatement',
                    loc: partialLoc
                }],
                type: 'DecoratorBlock',
                loc: partialLoc
            }];
            return [];
        });
        linter.verify.onCall(1).returns([{
            message: 'bad global'
        }]);
        linter.verify.onCall(2).callsFake(() => {
            linter.inlinePartials = [];
            linter.partials = [];
            return [];
        });
        linter.verify.onCall(3).callsFake(() => {
            linter.options.inlinePartials.should.containDeep([{
                node: 'local-card',
                parents: []
            }]);
            return [];
        });

        const processFile = processFileFunction(theme.files, failures, theme, partialsFound);

        processFile(linter, theme.files[0]);
        processFile(linter, theme.files[0]);

        failures.should.deepEqual([{
            ref: 'index.hbs',
            message: 'bad global'
        }]);
        theme.helpers.should.deepEqual({
            asset: ['index.hbs', 'partials/card.hbs']
        });
        partialsFound.card.should.eql(true);
        linter.verify.callCount.should.eql(4);
    });

    it('reports nested async helpers with source location details', function () {
        const logSpy = sinon.spy();
        const rule = new NoNestedAsyncHelpers({
            name: 'no-nested-async-helpers',
            log: logSpy,
            source: '{{#get "posts"}}{{get "authors"}}{{/get}}',
            partials: [],
            helpers: []
        });
        const parentNode = {
            type: 'BlockStatement',
            path: {
                data: false,
                parts: ['get']
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 17
                }
            }
        };

        rule.scope = {
            frames: [{
                nodeName: 'get',
                node: parentNode
            }]
        };

        rule._checkForInvalidNesting({
            type: 'MustacheStatement',
            path: {
                data: false,
                parts: ['next_post']
            },
            loc: {
                start: {
                    line: 1,
                    column: 18
                },
                end: {
                    line: 1,
                    column: 31
                }
            }
        });

        logSpy.calledOnce.should.eql(true);
        logSpy.firstCall.args[0].line.should.eql(1);
        logSpy.firstCall.args[0].column.should.eql(18);
        logSpy.firstCall.args[0].message.should.match(/cannot be used inside/);
    });

    it('reports prev_post and next_post helpers outside post context', function () {
        const logSpy = sinon.spy();
        const rule = new NoPrevNextPostOutsidePostContext({
            name: 'no-prev-next-post-outside-post-context',
            log: logSpy,
            source: '{{#prev_post}}{{/prev_post}}',
            partials: [],
            helpers: []
        });

        rule.scope = {
            isContext() {
                return false;
            }
        };

        rule._checkForHelperOutsidePostContext({
            type: 'BlockStatement',
            path: {
                data: false,
                parts: ['prev_post']
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 13
                }
            }
        });

        logSpy.calledOnce.should.eql(true);
        logSpy.firstCall.args[0].line.should.eql(1);
        logSpy.firstCall.args[0].column.should.eql(0);
        logSpy.firstCall.args[0].message.should.match(/post context/);
    });
});
