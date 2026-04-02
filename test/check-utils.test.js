const {getLogger, applyRule, parseWithAST} = require('../lib/utils/check-utils');

describe('check-utils', function () {
    describe('getLogger', function () {
        it('should create failure without ref when no file is provided', function () {
            const theme = {results: {pass: [], fail: {}}};
            const rule = {code: 'TEST-001'};
            const log = getLogger({theme, rule});

            log.failure({message: 'test error'});

            expect(theme.results.fail['TEST-001']).toBeDefined();
            expect(theme.results.fail['TEST-001'].failures).toHaveLength(1);
            expect(theme.results.fail['TEST-001'].failures[0].message).toEqual('test error');
            expect(theme.results.fail['TEST-001'].failures[0].ref).toBeUndefined();
        });

        it('should set failure ref when file is provided', function () {
            const theme = {results: {pass: [], fail: {}}};
            const rule = {code: 'TEST-001'};
            const file = {file: 'index.hbs'};
            const log = getLogger({theme, rule, file});

            log.failure({message: 'test error'});

            expect(theme.results.fail['TEST-001'].failures[0].ref).toEqual('index.hbs');
        });

        it('should append multiple failures for the same rule', function () {
            const theme = {results: {pass: [], fail: {}}};
            const rule = {code: 'TEST-001'};
            const log = getLogger({theme, rule});

            log.failure({message: 'error 1'});
            log.failure({message: 'error 2'});

            expect(theme.results.fail['TEST-001'].failures).toHaveLength(2);
        });
    });

    describe('applyRule', function () {
        it('should not execute when isEnabled is false (boolean)', function () {
            const theme = {files: [], results: {pass: [], fail: {}}};
            let initCalled = false;

            applyRule({
                code: 'TEST-001',
                isEnabled: false,
                init: () => {
                    initCalled = true; 
                }
            }, theme);

            expect(initCalled).toBe(false);
        });

        it('should not execute when isEnabled function returns false', function () {
            const theme = {files: [], results: {pass: [], fail: {}}};
            let initCalled = false;

            applyRule({
                code: 'TEST-001',
                isEnabled: () => false,
                init: () => {
                    initCalled = true; 
                }
            }, theme);

            expect(initCalled).toBe(false);
        });

        it('should execute when isEnabled function returns true', function () {
            const theme = {files: [], results: {pass: [], fail: {}}};
            let initCalled = false;

            applyRule({
                code: 'TEST-001',
                isEnabled: () => true,
                init: () => {
                    initCalled = true; 
                }
            }, theme);

            expect(initCalled).toBe(true);
        });

        it('should work without init function', function () {
            const theme = {files: [{file: 'test.hbs'}], results: {pass: [], fail: {}}};
            let eachFileCalled = false;

            applyRule({
                code: 'TEST-001',
                eachFile: () => {
                    eachFileCalled = true; 
                }
            }, theme);

            expect(eachFileCalled).toBe(true);
        });

        it('should work without eachFile function', function () {
            const theme = {files: [], results: {pass: [], fail: {}}};
            let initCalled = false;
            let doneCalled = false;

            applyRule({
                code: 'TEST-001',
                init: () => {
                    initCalled = true; 
                },
                done: () => {
                    doneCalled = true; 
                }
            }, theme);

            expect(initCalled).toBe(true);
            expect(doneCalled).toBe(true);
        });

        it('should work without done function', function () {
            const theme = {files: [], results: {pass: [], fail: {}}};
            let initCalled = false;

            applyRule({
                code: 'TEST-001',
                init: () => {
                    initCalled = true; 
                }
            }, theme);

            expect(initCalled).toBe(true);
        });

        it('should call eachFile for every theme file', function () {
            const theme = {
                files: [{file: 'a.hbs'}, {file: 'b.hbs'}, {file: 'c.hbs'}],
                results: {pass: [], fail: {}}
            };
            const seen = [];

            applyRule({
                code: 'TEST-001',
                eachFile: ({file}) => {
                    seen.push(file.file); 
                }
            }, theme);

            expect(seen).toEqual(['a.hbs', 'b.hbs', 'c.hbs']);
        });
    });

    describe('parseWithAST', function () {
        it('should not error when callback is omitted', function () {
            const theme = {files: [], results: {pass: [], fail: {}}};
            const log = getLogger({theme, rule: {code: 'TEST-001'}});
            const file = {
                file: 'test.hbs',
                content: '<p>hello</p>',
                parsed: {error: null, ast: {type: 'Program', body: [], strip: {}}}
            };

            // Should not throw
            parseWithAST({
                theme,
                log,
                file,
                rules: {},
                partialVerificationCache: new Map()
            });
        });

        it('should return early when file has a parse error', function () {
            const theme = {files: [], results: {pass: [], fail: {}}};
            const log = getLogger({theme, rule: {code: 'TEST-001'}});
            let callbackCalled = false;
            const file = {
                file: 'test.hbs',
                content: '',
                parsed: {error: {message: 'parse error', column: 1, lineNumber: 1}}
            };

            parseWithAST({
                theme,
                log,
                file,
                rules: {},
                callback: () => {
                    callbackCalled = true; 
                },
                partialVerificationCache: new Map()
            });

            expect(callbackCalled).toBe(false);
        });
    });
});
