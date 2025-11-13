const should = require('should'); // eslint-disable-line no-unused-vars
const utils = require('./utils');
const thisCheck = require('../lib/checks/100-custom-template-settings-usage');

describe('100 custom template settings usage', function () {
    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('should output nothing when all custom theme settings are used', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/valid', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should show errors when custom theme settings are not used', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/unused', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/color_scheme/);
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/show_logo/);

                done();
            }).catch(done);
        });

        it('should show errors for partially unused custom theme settings', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/partial', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/unused_setting/);
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.not.match(/color_scheme/);

                done();
            }).catch(done);
        });

        it('should detect custom settings used in partials', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/with-partials', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should not run check when theme has no custom settings', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/no-custom-settings', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should detect custom settings used in filter attributes', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should not detect uppercase @CUSTOM in filter attributes (case-sensitive)', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute-uppercase', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/authors_list/);

                done();
            }).catch(done);
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('should output nothing when all custom theme settings are used', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/valid', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should show errors when custom theme settings are not used', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/unused', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/color_scheme/);
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/show_logo/);

                done();
            }).catch(done);
        });

        it('should show errors for partially unused custom theme settings', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/partial', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/unused_setting/);
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.not.match(/color_scheme/);

                done();
            }).catch(done);
        });

        it('should detect custom settings used in partials', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/with-partials', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should not run check when theme has no custom settings', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/no-custom-settings', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should detect custom settings used in filter attributes', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should not detect uppercase @CUSTOM in filter attributes (case-sensitive)', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute-uppercase', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/authors_list/);

                done();
            }).catch(done);
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('should output nothing when all custom theme settings are used', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/valid', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should show errors when custom theme settings are not used', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/unused', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/color_scheme/);
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/show_logo/);

                done();
            }).catch(done);
        });

        it('should show errors for partially unused custom theme settings', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/partial', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/unused_setting/);
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.not.match(/color_scheme/);

                done();
            }).catch(done);
        });

        it('should detect custom settings used in partials', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/with-partials', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should not run check when theme has no custom settings', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/no-custom-settings', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should detect custom settings used in filter attributes', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql([]);

                done();
            }).catch(done);
        });

        it('should not detect uppercase @CUSTOM in filter attributes (case-sensitive)', function (done) {
            utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute-uppercase', options).then((output) => {
                output.should.be.a.ValidThemeObject();

                Object.keys(output.results.fail).should.eql(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].should.be.a.ValidFailObject();
                output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message.should.match(/authors_list/);

                done();
            }).catch(done);
        });
    });
});
