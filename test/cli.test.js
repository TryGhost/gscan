const path = require('path');
const {execFileSync} = require('child_process');
const prettyCli = require('@tryghost/pretty-cli');
const gscan = require('../lib');

const mockLog = vi.fn();
mockLog.error = vi.fn();

// Save original and override ui.log on the shared module object
// so bin/cli.js (which holds a reference to the same ui object) sees the mock
const originalLog = prettyCli.ui.log;
prettyCli.ui.log = mockLog;

const {formatCount, getSummary, outputResult, outputResults, resolveOptions, runCheck} = require('../bin/cli');
const ghostVersions = require('../lib/utils').versions;

// Formatted fixtures for functions that consume post-format data (getSummary, outputResult)
const cleanFormatted = {
    checkedVersion: '6.x',
    results: {error: [], warning: [], recommendation: []}
};

const errorFormatted = {
    checkedVersion: '6.x',
    results: {
        error: [{level: 'error', rule: 'Missing index.hbs', details: 'Need index', failures: [{ref: 'index.hbs'}]}],
        warning: [],
        recommendation: []
    }
};

const mixedFormatted = {
    checkedVersion: '6.x',
    results: {
        error: [{level: 'error', rule: 'Error rule', details: 'Error details', failures: [{ref: 'a.hbs'}]}],
        warning: [{level: 'warning', rule: 'Warning rule', details: 'Warning details', failures: [{ref: 'b.hbs'}]}],
        recommendation: [{level: 'recommendation', rule: 'Rec rule', details: 'Rec details', failures: [{ref: 'c.hbs'}]}]
    }
};

const warningOnlyFormatted = {
    checkedVersion: '6.x',
    results: {
        error: [],
        warning: [{level: 'warning', rule: 'Warning rule', details: 'Warning details', failures: [{ref: 'b.hbs'}]}],
        recommendation: []
    }
};

// Raw (pre-format) fixtures for outputResults, which calls gscan.format internally.
// format() mutates the theme, so these must be deep-cloned before each use.
const rawClean = {
    results: {
        pass: ['GS020-INDEX-REQ', 'GS020-POST-REQ'],
        fail: {}
    }
};

const rawWithErrors = {
    results: {
        pass: [],
        fail: {
            'GS020-INDEX-REQ': {failures: [{ref: 'index.hbs'}]},
            'GS020-POST-REQ': {failures: [{ref: 'post.hbs'}]}
        }
    }
};

const rawWithWarnings = {
    results: {
        pass: [],
        fail: {
            'GS030-ASSET-REQ': {failures: [{ref: 'assets/'}]}
        }
    }
};

const rawWithRecommendations = {
    results: {
        pass: [],
        fail: {
            'GS010-PJ-CONF-PPP': {failures: [{ref: 'package.json'}]}
        }
    }
};

const rawMixed = {
    results: {
        pass: [],
        fail: {
            'GS020-INDEX-REQ': {failures: [{ref: 'index.hbs'}]},
            'GS030-ASSET-REQ': {failures: [{ref: 'assets/'}]},
            'GS010-PJ-CONF-PPP': {failures: [{ref: 'package.json'}]}
        }
    }
};

function allLogOutput() {
    return mockLog.mock.calls.map(c => c.join(' ')).join('\n');
}

describe('CLI', function () {
    afterAll(function () {
        prettyCli.ui.log = originalLog;
    });

    beforeEach(function () {
        mockLog.mockClear();
        mockLog.error.mockClear();
    });

    describe('formatCount', function () {
        it('should use singular for count of 1', function () {
            expect(formatCount('error', 1)).toBe('1 error');
        });

        it('should use plural for count of 2', function () {
            expect(formatCount('error', 2)).toBe('2 errors');
        });

        it('should use plural for count of 0', function () {
            expect(formatCount('warning', 0)).toBe('0 warnings');
        });
    });

    describe('getSummary', function () {
        it('should show compatible message for clean theme', function () {
            expect(getSummary(cleanFormatted, {})).toContain('Your theme is compatible with Ghost 6.x');
        });

        it('should show no fatal issues message when onlyFatalErrors is true', function () {
            expect(getSummary(cleanFormatted, {onlyFatalErrors: true})).toContain('no fatal compatibility issues');
        });

        it('should show error count for theme with errors', function () {
            const summary = getSummary(errorFormatted, {});
            expect(summary).toContain('Your theme has');
            expect(summary).toContain('error');
        });

        it('should show errors and warnings for mixed theme', function () {
            const summary = getSummary(mixedFormatted, {});
            expect(summary).toContain('error');
            expect(summary).toContain('and');
            expect(summary).toContain('warning');
        });

        it('should show only warnings when no errors', function () {
            const summary = getSummary(warningOnlyFormatted, {});
            expect(summary).toContain('warning');
            expect(summary).toContain('Your theme has');
        });

        it('should include separator line when issues present', function () {
            const summary = getSummary(errorFormatted, {});
            // Summary adds \n + dashes after the issue text
            // Dashes may be empty when chalk doesn't output ANSI codes (test env)
            expect(summary).toContain('!\n');
        });
    });

    describe('outputResult', function () {
        it('should log level and rule in non-verbose mode', function () {
            const result = {level: 'error', rule: 'Missing index.hbs', details: 'Need index', failures: [{ref: 'index.hbs'}]};
            outputResult(result, {});

            expect(allLogOutput()).toContain('Error:');
            expect(allLogOutput()).toContain('Missing index.hbs');
        });

        it('should log affected files with comma-joined refs in non-verbose mode', function () {
            const result = {level: 'warning', rule: 'Some rule', details: 'Details', failures: [{ref: 'a.hbs'}, {ref: 'b.hbs'}]};
            outputResult(result, {});

            expect(allLogOutput()).toContain('Affected Files:');
            expect(allLogOutput()).toContain('a.hbs, b.hbs');
        });

        it('should log details in verbose mode', function () {
            const result = {level: 'error', rule: 'Some rule', details: 'Detailed explanation', failures: [{ref: 'a.hbs'}]};
            outputResult(result, {verbose: true});

            expect(allLogOutput()).toContain('Details:');
            expect(allLogOutput()).toContain('Detailed explanation');
        });

        it('should log individual refs in verbose mode', function () {
            const result = {level: 'error', rule: 'Some rule', details: 'Details', failures: [{ref: 'a.hbs'}, {ref: 'b.hbs'}]};
            outputResult(result, {verbose: true});

            expect(allLogOutput()).toContain('Affected Files:');
            expect(allLogOutput()).toContain('a.hbs');
            expect(allLogOutput()).toContain('b.hbs');
        });

        it('should append failure message to ref in verbose mode', function () {
            const result = {level: 'error', rule: 'Some rule', details: 'Details', failures: [{ref: 'a.hbs', message: 'custom message'}]};
            outputResult(result, {verbose: true});

            expect(allLogOutput()).toContain('a.hbs - custom message');
        });

        it('should not log affected files when there are no failures', function () {
            const result = {level: 'error', rule: 'Some rule', details: 'Details', failures: []};
            outputResult(result, {});

            expect(allLogOutput()).not.toContain('Affected Files:');
        });

        it('should deduplicate refs in non-verbose mode', function () {
            const result = {level: 'error', rule: 'Some rule', details: 'Details', failures: [{ref: 'a.hbs'}, {ref: 'a.hbs'}]};
            outputResult(result, {});

            const affectedLine = mockLog.mock.calls.find(c => c.join(' ').includes('Affected Files:'));
            expect(affectedLine).toBeDefined();
            const lineText = affectedLine.join(' ');
            expect(lineText).toContain('a.hbs');
            expect(lineText).not.toContain('a.hbs, a.hbs');
        });
    });

    describe('outputResults', function () {
        const formatOptions = {checkVersion: 'v6', format: 'cli'};
        let exitSpy;

        beforeEach(function () {
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
        });

        afterEach(function () {
            exitSpy.mockRestore();
        });

        it('should exit with code 1 when errors are present', function () {
            outputResults(structuredClone(rawWithErrors), formatOptions);

            expect(exitSpy).toHaveBeenCalledWith(1);
        });

        it('should exit with code 0 when no errors', function () {
            outputResults(structuredClone(rawClean), formatOptions);

            expect(exitSpy).toHaveBeenCalledWith(0);
        });

        it('should log Errors section header when errors present', function () {
            outputResults(structuredClone(rawWithErrors), formatOptions);

            expect(allLogOutput()).toContain('Errors');
        });

        it('should log Warnings section header when warnings present', function () {
            outputResults(structuredClone(rawWithWarnings), formatOptions);

            expect(allLogOutput()).toContain('Warnings');
        });

        it('should log Recommendations section header when recommendations present', function () {
            outputResults(structuredClone(rawWithRecommendations), formatOptions);

            expect(allLogOutput()).toContain('Recommendations');
        });

        it('should log help links', function () {
            outputResults(structuredClone(rawClean), formatOptions);

            expect(allLogOutput()).toContain('docs.ghost.org/themes/');
            expect(allLogOutput()).toContain('gscan.ghost.org');
        });

        it('should log all section headers for mixed results', function () {
            outputResults(structuredClone(rawMixed), formatOptions);

            const output = allLogOutput();
            expect(output).toContain('Errors');
            expect(output).toContain('Warnings');
            expect(output).toContain('Recommendations');
        });

        it('should handle gscan.format throwing an error', function () {
            // A nonexistent rule code causes format to throw after setting up result arrays
            outputResults({results: {pass: [], fail: {'NONEXISTENT-CODE': {failures: []}}}}, formatOptions);

            expect(mockLog.error).toHaveBeenCalled();
            const errorOutput = mockLog.error.mock.calls.map(c => c.join(' ')).join('\n');
            expect(errorOutput).toContain('Error formating result');
        });
    });

    describe('resolveOptions', function () {
        Object.keys(ghostVersions).filter(k => k.startsWith('v')).forEach(function (version) {
            it(`should resolve ${version} flag`, function () {
                expect(resolveOptions({[version]: true}).checkVersion).toBe(version);
            });
        });

        it('should resolve canary flag', function () {
            expect(resolveOptions({canary: true}).checkVersion).toBe(ghostVersions.canary);
        });

        it('should use default version when no flag set', function () {
            expect(resolveOptions({}).checkVersion).toBe(ghostVersions.default);
        });

        it('should set verbose from argv', function () {
            expect(resolveOptions({verbose: true}).verbose).toBe(true);
        });

        it('should set onlyFatalErrors from argv.fatal', function () {
            expect(resolveOptions({fatal: true}).onlyFatalErrors).toBe(true);
        });

        it('should parse labs flags', function () {
            const options = resolveOptions({labs: ['portalFlag', 'anotherFlag']});
            expect(options.labs).toEqual({portalFlag: true, anotherFlag: true});
        });

        it('should not set labs when not provided', function () {
            expect(resolveOptions({}).labs).toBeUndefined();
        });

        it('should always include format: cli', function () {
            expect(resolveOptions({}).format).toBe('cli');
        });
    });

    describe('runCheck', function () {
        let originalCheck;
        let originalCheckZip;

        beforeEach(function () {
            originalCheck = gscan.check;
            originalCheckZip = gscan.checkZip;
        });

        afterEach(function () {
            gscan.check = originalCheck;
            gscan.checkZip = originalCheckZip;
        });

        it('should log fatal-only message when onlyFatalErrors is true', function () {
            gscan.check = vi.fn(() => new Promise(() => {}));
            runCheck({themePath: '/tmp/theme'}, {onlyFatalErrors: true});

            expect(allLogOutput()).toContain('fatal issues only');
        });

        it('should log standard message when onlyFatalErrors is false', function () {
            gscan.check = vi.fn(() => new Promise(() => {}));
            runCheck({themePath: '/tmp/theme'}, {});

            expect(allLogOutput()).toContain('Checking theme compatibility...');
            expect(allLogOutput()).not.toContain('fatal');
        });

        it('should call checkZip when zip flag is set', function () {
            gscan.checkZip = vi.fn(() => new Promise(() => {}));
            runCheck({zip: true, themePath: '/tmp/theme.zip'}, {});

            expect(gscan.checkZip).toHaveBeenCalledWith('/tmp/theme.zip', {});
        });

        it('should call check when zip flag is not set', function () {
            gscan.check = vi.fn(() => new Promise(() => {}));
            runCheck({themePath: '/tmp/theme'}, {});

            expect(gscan.check).toHaveBeenCalledWith('/tmp/theme', {});
        });

        it('should handle check errors', async function () {
            gscan.check = vi.fn(() => Promise.reject(new Error('check failed')));
            await runCheck({themePath: '/tmp/theme'}, {});

            expect(allLogOutput()).toContain('check failed');
        });

        it('should suggest zip flag on ENOTDIR error', async function () {
            const err = new Error('not a directory');
            err.code = 'ENOTDIR';
            gscan.check = vi.fn(() => Promise.reject(err));
            await runCheck({themePath: '/tmp/theme.zip'}, {});

            expect(allLogOutput()).toContain('Did you mean to add the -z flag');
        });

        it('should handle checkZip errors', async function () {
            const zipError = new Error('zip failed');
            gscan.checkZip = vi.fn(() => Promise.reject(zipError));
            await runCheck({zip: true, themePath: '/tmp/theme.zip'}, {});

            // checkZip catch logs the error object directly, not err.message
            expect(mockLog).toHaveBeenCalledWith(zipError);
        });
    });

    describe('CLI binary (smoke test)', function () {
        it('should boot, parse args, check a theme, and exit', function () {
            const cliBin = path.resolve(__dirname, '../bin/cli.js');
            const fixture = path.resolve(__dirname, 'fixtures/themes/020-structure/mixed');
            let result;
            try {
                const stdout = execFileSync(process.execPath, [cliBin, fixture, '--v6'], {
                    encoding: 'utf8',
                    timeout: 10000,
                    env: {...process.env, NO_COLOR: '1'}
                });
                result = {exitCode: 0, stdout};
            } catch (err) {
                result = {exitCode: err.status, stdout: err.stdout || ''};
            }

            expect(result.exitCode).toBe(1); // fixture has errors
            // Strip ANSI codes (from chalk and format.js) and normalize dash separators
            // so the snapshot is deterministic across environments
            const normalized = result.stdout
                .replace(new RegExp(String.fromCharCode(27) + '\\[\\d+m', 'g'), '')
                .replace(/-{2,}/g, '---');
            expect(normalized).toMatchSnapshot();
        });
    });
});
