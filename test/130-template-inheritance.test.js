var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/130-template-inheritance');

const ruleCode = 'GS130-NO-RECURSIVE-LAYOUT';

describe('130 Template inheritance', function () {
    it('detects default.hbs inheriting from default.hbs in v6', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/recursive-default', {checkVersion: 'v6'});

        output.should.be.a.ValidThemeObject();
        Object.keys(output.results.fail).should.eql([ruleCode]);

        const failure = output.results.fail[ruleCode].failures[0];
        failure.ref.should.eql('default.hbs');
        failure.message.should.containEql('default.hbs -> default.hbs');
    });

    it('does not run for v5', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/recursive-default', {checkVersion: 'v5'});

        output.should.be.a.ValidThemeObject();
        output.results.fail.should.be.an.Object().which.is.empty();
        output.results.pass.should.not.containEql(ruleCode);
    });

    it('allows a template to inherit from default.hbs in v6', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/valid-default', {checkVersion: 'v6'});

        output.should.be.a.ValidThemeObject();
        output.results.fail.should.be.an.Object().which.is.empty();
        output.results.pass.should.containEql(ruleCode);
    });

    it('detects indirect recursive layout inheritance in v6', async function () {
        const output = await utils.testCheck(thisCheck, '130-template-inheritance/indirect-cycle', {checkVersion: 'v6'});

        output.should.be.a.ValidThemeObject();
        Object.keys(output.results.fail).should.eql([ruleCode]);

        const failure = output.results.fail[ruleCode].failures[0];
        failure.message.should.containEql('default.hbs');
        failure.message.should.containEql('layouts/base.hbs');
    });
});
