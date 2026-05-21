const utils = require('./utils');
const thisCheck = require('../lib/checks/130-template-inheritance');

const ruleCode = 'GS130-NO-RECURSIVE-LAYOUT';

describe('130 Template inheritance', function () {
    it('detects default.hbs inheriting from default.hbs in v6', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/recursive-default', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);
        expect(Object.keys(output.results.fail)).toEqual([ruleCode]);

        const failure = output.results.fail[ruleCode].failures[0];
        expect(failure.ref).toEqual('default.hbs');
        expect(failure.message).toContain('default.hbs -> default.hbs');
    });

    it('does not run for v5', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/recursive-default', {checkVersion: 'v5'});

        utils.assertValidThemeObject(output);
        expect(output.results.fail).toEqual({});
        expect(output.results.pass).not.toContain(ruleCode);
    });

    it('allows a template to inherit from default.hbs in v6', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/valid-default', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);
        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('ignores secondary layout directives in v6', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/secondary-directive', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);
        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('detects indirect recursive layout inheritance in v6', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/indirect-cycle', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);
        expect(Object.keys(output.results.fail)).toEqual([ruleCode]);

        const failure = output.results.fail[ruleCode].failures[0];
        expect(failure.message).toContain('default.hbs');
        expect(failure.message).toContain('layouts/base.hbs');
    });

    it('supports relative layout paths and explicit hbs extensions', function () {
        const output = thisCheck({
            files: [{
                file: 'index.hbs',
                ext: '.hbs',
                content: '{{!< ./layouts/default.hbs}}'
            }, {
                file: 'layouts/default.hbs',
                ext: '.hbs',
                content: '{{{body}}}'
            }],
            results: {
                pass: [],
                fail: {}
            }
        }, {checkVersion: 'v6'});

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('ignores missing layout targets and templates without content', function () {
        const output = thisCheck({
            files: [{
                file: 'index.hbs',
                ext: '.hbs',
                content: '{{!< missing}}'
            }, {
                file: 'empty.hbs',
                ext: '.hbs'
            }],
            results: {
                pass: [],
                fail: {}
            }
        }, {checkVersion: 'v6'});

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });
});
