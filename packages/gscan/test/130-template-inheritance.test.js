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
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/indirect-root-cycle', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(Object.keys(output.results.fail)).toEqual([ruleCode]);

        const failure = output.results.fail[ruleCode].failures[0];
        expect(failure.message).toContain('default.hbs');
        expect(failure.message).toContain('base.hbs');
    });

    it('resolves bare layout names relative to the declaring template directory', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/nested-cycle', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(Object.keys(output.results.fail)).toEqual([ruleCode]);

        const failure = output.results.fail[ruleCode].failures[0];
        expect(failure.message).toContain('layouts/default.hbs');
        expect(failure.message).toContain('layouts/base.hbs');
    });

    it('does not treat nested bare layout names as relative to the theme root', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/nested-default-target', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('does not treat nested bare layout aliases as relative to the theme root', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/nested-shell-target', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('ignores leading slash layout references', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/absolute-default', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('allows multiple templates to share the same layout target', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/shared-layout-target', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('supports relative layout paths and explicit hbs extensions', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/relative-explicit-extension', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });

    it('ignores missing layout targets and templates without content', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/missing-and-empty', {checkVersion: 'v6'});

        utils.assertValidThemeObject(output);

        expect(output.results.fail).toEqual({});
        expect(output.results.pass).toContain(ruleCode);
    });
});
