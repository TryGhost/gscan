const should = require('should'); // eslint-disable-line no-unused-vars
const sinon = require('sinon');

const cli = require('../bin/cli');
const {versions: ghostVersions} = require('../lib/utils');

describe('CLI', function () {
    let sandbox;
    let logSpy;
    let logErrorSpy;
    let outputResultsSpy;
    let exitSpy;
    let formatStub;
    let checkStub;
    let checkZipStub;
    let deps;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        logSpy = sandbox.spy();
        logErrorSpy = sandbox.spy();
        logSpy.error = logErrorSpy;
        outputResultsSpy = sandbox.spy();
        exitSpy = sandbox.spy();
        formatStub = sandbox.stub();
        checkStub = sandbox.stub();
        checkZipStub = sandbox.stub();

        deps = {
            _: require('lodash'),
            chalk: {
                bold(value) {
                    return value;
                },
                red: Object.assign(value => value, {
                    bold(value) {
                        return value;
                    }
                }),
                yellow: Object.assign(value => value, {
                    bold(value) {
                        return value;
                    }
                }),
                green(value) {
                    return value;
                },
                cyan: {
                    underline(value) {
                        return value;
                    }
                }
            },
            gscan: {
                check: checkStub,
                checkZip: checkZipStub,
                format: formatStub
            },
            levels: {
                error(value) {
                    return value;
                },
                warning(value) {
                    return value;
                },
                recommendation(value) {
                    return value;
                },
                feature(value) {
                    return value;
                }
            },
            outputResults: outputResultsSpy,
            process: {
                exit: exitSpy
            },
            ui: {
                log: logSpy
            }
        };
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('builds CLI options for version flags, defaults, and labs flags', function () {
        cli.buildCliOptions({v1: true}).should.containDeep({
            format: 'cli',
            checkVersion: 'v1'
        });

        cli.buildCliOptions({v2: true}).checkVersion.should.eql('v2');
        cli.buildCliOptions({v3: true}).checkVersion.should.eql('v3');
        cli.buildCliOptions({v4: true}).checkVersion.should.eql('v4');
        cli.buildCliOptions({v5: true}).checkVersion.should.eql('v5');
        cli.buildCliOptions({v6: true}).checkVersion.should.eql('v6');
        cli.buildCliOptions({canary: true}).checkVersion.should.eql(ghostVersions.canary);
        cli.buildCliOptions({}).checkVersion.should.eql(ghostVersions.default);

        cli.buildCliOptions({
            verbose: true,
            fatal: true,
            labs: ['members', 'editor']
        }).should.deepEqual({
            format: 'cli',
            verbose: true,
            onlyFatalErrors: true,
            checkVersion: ghostVersions.default,
            labs: {
                members: true,
                editor: true
            }
        });
    });

    it('configures the pretty-cli parser chain', function () {
        const calls = [];
        const fakeCLI = {
            configure(options) {
                calls.push(['configure', options]);
                return this;
            },
            groupOrder(order) {
                calls.push(['groupOrder', order]);
                return this;
            },
            positional(name, options) {
                calls.push(['positional', name, options]);
                return this;
            },
            boolean(name, options) {
                calls.push(['boolean', name, options]);
                return this;
            },
            array(name, options) {
                calls.push(['array', name, options]);
                return this;
            }
        };

        cli.configureCLI(fakeCLI).should.eql(fakeCLI);

        calls[0].should.eql(['configure', {name: 'gscan'}]);
        calls[1][0].should.eql('groupOrder');
        calls[2].should.eql(['positional', '<themePath>', {
            paramsDesc: 'Theme folder or .zip file path',
            mustExist: true
        }]);
        calls.some(call => call[0] === 'boolean' && call[1] === '-z, --zip').should.eql(true);
        calls.some(call => call[0] === 'array' && call[1] === '--labs').should.eql(true);
    });

    it('handles zip scans and fatal-only output', async function () {
        checkZipStub.resolves({results: {}});

        await cli.handleCli({
            zip: true,
            themePath: '/tmp/theme.zip',
            fatal: true,
            canary: true,
            labs: ['members']
        }, deps);

        checkZipStub.calledOnce.should.eql(true);
        checkZipStub.firstCall.args[0].should.eql('/tmp/theme.zip');
        checkZipStub.firstCall.args[1].should.deepEqual({
            format: 'cli',
            verbose: undefined,
            onlyFatalErrors: true,
            checkVersion: ghostVersions.canary,
            labs: {
                members: true
            }
        });
        logSpy.firstCall.args[0].should.match(/fatal issues only/);
        outputResultsSpy.calledOnce.should.eql(true);
    });

    it('handles directory scans and suggests zip mode for ENOTDIR failures', async function () {
        checkStub.rejects({
            message: 'bad path',
            code: 'ENOTDIR'
        });

        await cli.handleCli({
            zip: false,
            themePath: '/tmp/theme'
        }, deps);

        checkStub.calledOnce.should.eql(true);
        logSpy.calledWith('bad path').should.eql(true);
        logSpy.calledWith('Did you mean to add the -z flag to read a zip file?').should.eql(true);
    });

    it('logs zip scan failures without rethrowing', async function () {
        const zipError = new Error('zip failed');
        checkZipStub.rejects(zipError);

        await cli.handleCli({
            zip: true,
            themePath: '/tmp/theme.zip'
        }, deps);

        logSpy.calledWith(zipError).should.eql(true);
    });

    it('formats singular and plural counts and summaries', function () {
        cli.formatCount('error', 1).should.eql('1 error');
        cli.formatCount('warning', 2).should.eql('2 warnings');

        cli.getSummary({
            checkedVersion: '6.0',
            results: {
                error: [],
                warning: []
            }
        }, {
            onlyFatalErrors: false
        }, deps).should.match(/compatible with Ghost 6\.0/);

        cli.getSummary({
            checkedVersion: '6.0',
            results: {
                error: [],
                warning: []
            }
        }, {
            onlyFatalErrors: true
        }, deps).should.match(/no fatal compatibility issues/);

        cli.getSummary({
            results: {
                error: [{code: 'A'}],
                warning: [{code: 'B'}]
            }
        }, {}, deps).should.match(/1 error.*1 warning/s);

        cli.getSummary({
            results: {
                error: [],
                warning: [{code: 'B'}]
            }
        }, {}, deps).should.match(/1 warning/);
    });

    it('outputs verbose and compact rule details', function () {
        cli.outputResult({
            level: 'error',
            rule: 'Broken helper',
            details: 'Something went wrong',
            failures: [{
                ref: 'index.hbs',
                message: 'bad helper'
            }, {
                ref: 'post.hbs'
            }]
        }, {
            verbose: true
        }, deps);

        logSpy.calledWithMatch(/Affected Files:/).should.eql(true);
        logSpy.calledWith('index.hbs - bad helper').should.eql(true);
        logSpy.calledWith('post.hbs').should.eql(true);

        logSpy.resetHistory();

        cli.outputResult({
            level: 'warning',
            rule: 'Duplicate refs',
            failures: [{
                ref: 'index.hbs'
            }, {
                ref: 'index.hbs'
            }, {
                ref: 'post.hbs'
            }]
        }, {
            verbose: false
        }, deps);

        logSpy.calledWithMatch(/Affected Files:.*index\.hbs, post\.hbs/).should.eql(true);
    });

    it('formats output and exits with the right code', function () {
        formatStub.returns({
            results: {
                error: [{
                    level: 'error',
                    rule: 'Error rule'
                }],
                warning: [{
                    level: 'warning',
                    rule: 'Warning rule'
                }],
                recommendation: [{
                    level: 'recommendation',
                    rule: 'Recommendation rule'
                }]
            }
        });

        cli.outputResults({
            checkedVersion: 'v6',
            results: {
                error: [],
                warning: [],
                recommendation: []
            }
        }, {
            verbose: false
        }, deps);

        formatStub.calledOnce.should.eql(true);
        exitSpy.calledWith(1).should.eql(true);
        logSpy.calledWithMatch(/Get more help at/).should.eql(true);
    });

    it('logs formatting errors and exits cleanly when there are no errors', function () {
        formatStub.onFirstCall().throws(new Error('bad format'));
        formatStub.onSecondCall().returns({
            results: {
                error: [],
                warning: [],
                recommendation: []
            }
        });

        cli.outputResults({
            checkedVersion: 'v6',
            results: {
                error: [],
                warning: [],
                recommendation: []
            }
        }, {}, deps);

        logErrorSpy.calledWith('Error formating result, some results may be missing.').should.eql(true);

        cli.outputResults({
            checkedVersion: 'v6',
            results: {
                error: [],
                warning: [],
                recommendation: []
            }
        }, {}, deps);

        exitSpy.calledWith(0).should.eql(true);
    });

    it('runs main by parsing arguments from the configured CLI', async function () {
        checkStub.resolves({
            checkedVersion: 'v6',
            results: {
                error: [],
                warning: [],
                recommendation: []
            }
        });

        await cli.main({
            configure() {
                return this;
            },
            groupOrder() {
                return this;
            },
            positional() {
                return this;
            },
            boolean() {
                return this;
            },
            array() {
                return this;
            },
            parseAndExit() {
                return Promise.resolve({
                    themePath: '/tmp/theme'
                });
            }
        }, deps);

        checkStub.calledOnce.should.eql(true);
        checkStub.firstCall.args[0].should.eql('/tmp/theme');
    });
});
