const should = require('should'); // eslint-disable-line no-unused-vars
const sinon = require('sinon');
const path = require('path');
const errors = require('@tryghost/errors');

const checker = require('../lib/checker');
const {check, checkZip} = checker;

describe('Checker internals', function () {
    afterEach(function () {
        sinon.restore();
    });

    it('loads check modules from the checks directory', function () {
        const checks = checker._private.loadChecks();

        checks.should.have.property('001-deprecations');
        checks.should.have.property('120-no-unknown-globals');
    });

    it('adds enabled labs helpers to the spec when missing', async function () {
        const knownHelpers = [];

        const theme = await check('/tmp/theme', {
            checkVersion: 'v6',
            labs: {
                labsFlag: true
            }
        }, {
            labsEnabledHelpers: {
                special_helper: 'labsFlag'
            },
            loadChecks() {
                return {};
            },
            readTheme: async function () {
                return {
                    files: [],
                    results: {
                        pass: [],
                        fail: {}
                    }
                };
            },
            specs: {
                get() {
                    return {knownHelpers};
                }
            }
        });

        theme.checkedVersion.should.eql('6.x');
        knownHelpers.should.eql(['special_helper']);
    });

    it('does not duplicate enabled labs helpers already present in the spec', async function () {
        const knownHelpers = ['special_helper'];

        await check('/tmp/theme', {
            checkVersion: 'v6',
            labs: {
                labsFlag: true
            }
        }, {
            labsEnabledHelpers: {
                special_helper: 'labsFlag'
            },
            loadChecks() {
                return {};
            },
            readTheme: async function () {
                return {
                    files: [],
                    results: {
                        pass: [],
                        fail: {}
                    }
                };
            },
            specs: {
                get() {
                    return {knownHelpers};
                }
            }
        });

        knownHelpers.should.eql(['special_helper']);
    });

    it('wraps readTheme failures with the provided theme name context', async function () {
        try {
            await check('/tmp/theme', {
                themeName: 'my-theme'
            }, {
                loadChecks() {
                    return {};
                },
                readTheme: async function () {
                    throw new Error('boom');
                }
            });
            should.fail('Expected check() to throw');
        } catch (err) {
            err.errorType.should.eql('ValidationError');
            err.context.should.eql('my-theme');
            err.message.should.eql('Failed theme files check');
        }
    });

    it('checks string zip paths and cleans extracted directories in finally', async function () {
        const checkStub = sinon.stub().resolves({checkedVersion: '6.x'});
        const removeStub = sinon.stub().resolves();
        const isGhostErrorStub = sinon.stub(errors.utils, 'isGhostError').returns(true);
        const deps = {
            check: checkStub,
            errors,
            fs: {
                remove: removeStub
            },
            readZip: async function (zip) {
                zip.name.should.eql('theme');
                zip.origPath = '/tmp/extracted';

                return {
                    path: '/tmp/extracted/theme',
                    origPath: '/tmp/extracted'
                };
            }
        };

        const theme = await checkZip('/themes/theme.zip', {
            checkVersion: 'v6'
        }, deps);

        isGhostErrorStub.restore();

        theme.checkedVersion.should.eql('6.x');
        checkStub.calledOnce.should.eql(true);
        checkStub.firstCall.args[0].should.eql('/tmp/extracted/theme');
        checkStub.firstCall.args[1].should.deepEqual({
            themeName: 'theme',
            keepExtractedDir: false,
            checkVersion: 'v6'
        });
        checkStub.firstCall.args[2].should.eql(deps);
        removeStub.calledWith('/tmp/extracted').should.eql(true);
    });

    it('wraps non-ghost zip errors and skips cleanup when directories are kept', async function () {
        const checkStub = sinon.stub().rejects(new Error('zip exploded'));
        const removeStub = sinon.stub().resolves();
        const isGhostErrorStub = sinon.stub(errors.utils, 'isGhostError').returns(false);

        try {
            await checkZip({
                path: path.join('/themes', 'theme.zip'),
                name: 'theme.zip'
            }, {
                keepExtractedDir: true
            }, {
                check: checkStub,
                errors,
                fs: {
                    remove: removeStub
                },
                readZip: async function () {
                    return {
                        path: '/tmp/extracted/theme',
                        origPath: '/tmp/extracted',
                        name: 'theme.zip'
                    };
                }
            });
            should.fail('Expected checkZip() to throw');
        } catch (err) {
            err.errorType.should.eql('ValidationError');
            err.message.should.eql('Failed to check zip file');
            err.context.should.eql('theme.zip');
            removeStub.called.should.eql(false);
        } finally {
            isGhostErrorStub.restore();
        }
    });
});
