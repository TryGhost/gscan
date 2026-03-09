const should = require('should'); // eslint-disable-line no-unused-vars
const sinon = require('sinon');
const path = require('path');
const fs = require('fs-extra');

const format = require('../lib/format');
const {check, checkZip} = require('../lib/checker');
const {normalizePath, getPackageJSON, versions} = require('../lib/utils');
const themePath = require('./utils').themePath;
const errors = require('@tryghost/errors');
const ansiCyan = String.fromCharCode(27) + '[36m';
const ansiReset = String.fromCharCode(27) + '[39m';

describe('Core internals', function () {
    afterEach(function () {
        sinon.restore();
    });

    it('normalizes paths and exposes package-json helpers through lib/utils', function () {
        normalizePath('partials\\cards\\post.hbs').should.eql('partials/cards/post.hbs');
        should.equal(normalizePath(), undefined);

        getPackageJSON({
            files: [{
                file: 'package.json'
            }]
        }, {posts_per_page: 5}).should.deepEqual({
            config: {
                posts_per_page: 5
            }
        });
    });

    it('formats CLI output by rewriting code tags, links, and line breaks', function () {
        const theme = format({
            results: {
                pass: ['GS010-PJ-GHOST-API'],
                fail: {}
            }
        }, {
            checkVersion: 'v3',
            format: 'cli'
        });

        theme.results.pass.should.have.length(1);
        theme.results.pass[0].rule.should.containEql(`${ansiCyan}package.json${ansiReset}`);
        theme.results.pass[0].details.should.match(/\n/);
        theme.results.pass[0].details.should.match(/documentation \(https?:\/\/.*\)/);
    });

    it('filters non-fatal failures when only fatal errors are requested', function () {
        const theme = format({
            results: {
                pass: [],
                fail: {
                    'GS020-INDEX-REQ': {},
                    'GS040-GH-REQ': {}
                }
            }
        }, {
            checkVersion: 'v1',
            onlyFatalErrors: true
        });

        theme.results.error.should.have.length(1);
        theme.results.error[0].code.should.eql('GS020-INDEX-REQ');
        theme.results.hasFatalErrors.should.eql(true);
    });

    it('uses the canary version when checker is asked to skip checks', async function () {
        const theme = await check(themePath('is-empty'), {
            checkVersion: 'canary',
            skipChecks: true
        });

        theme.checkedVersion.should.eql(versions[versions.canary].major);
        theme.results.pass.should.eql([]);
    });

    it('rethrows ghost errors from zip checking unchanged', async function () {
        const isGhostErrorStub = sinon.stub(errors.utils, 'isGhostError').returns(true);

        try {
            await checkZip(themePath('030-assets/do_not_exist.zip'));
            should.fail('Expected zip check to throw');
        } catch (err) {
            should.exist(err);
            err.errorType.should.eql('ValidationError');
            err.message.should.eql('Failed to read zip file');
        } finally {
            isGhostErrorStub.restore();
        }
    });

    it('accepts theme objects when checking zip files', async function () {
        let theme;

        try {
            theme = await checkZip({
                path: themePath('030-assets/ignored.zip'),
                name: path.basename(themePath('030-assets/ignored.zip'))
            }, {
                keepExtractedDir: true,
                checkVersion: 'v1'
            });

            theme.files.should.have.length(1);
            theme.checkedVersion.should.eql('1.x');
        } finally {
            if (theme && theme.path) {
                await fs.remove(theme.path);
            }
        }
    });
});
