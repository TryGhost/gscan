const utils = require('./utils');
const thisCheck = require('../lib/checks/100-custom-template-settings-usage');

describe('100 custom template settings usage', function () {
    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('should output nothing when all custom theme settings are used', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/valid', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should show errors when custom theme settings are not used', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/unused', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/color_scheme/);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/show_logo/);

            });
        });

        it('should show errors for partially unused custom theme settings', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/partial', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/unused_setting/);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).not.toMatch(/color_scheme/);

            });
        });

        it('should detect custom settings used in partials', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/with-partials', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should not run check when theme has no custom settings', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/no-custom-settings', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should detect custom settings used in filter attributes', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should not detect uppercase @CUSTOM in filter attributes (case-sensitive)', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute-uppercase', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/authors_list/);

            });
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('should output nothing when all custom theme settings are used', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/valid', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should show errors when custom theme settings are not used', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/unused', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/color_scheme/);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/show_logo/);

            });
        });

        it('should show errors for partially unused custom theme settings', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/partial', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/unused_setting/);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).not.toMatch(/color_scheme/);

            });
        });

        it('should detect custom settings used in partials', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/with-partials', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should not run check when theme has no custom settings', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/no-custom-settings', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should detect custom settings used in filter attributes', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should not detect uppercase @CUSTOM in filter attributes (case-sensitive)', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute-uppercase', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/authors_list/);

            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('should output nothing when all custom theme settings are used', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/valid', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should show errors when custom theme settings are not used', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/unused', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/color_scheme/);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/show_logo/);

            });
        });

        it('should show errors for partially unused custom theme settings', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/partial', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/unused_setting/);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).not.toMatch(/color_scheme/);

            });
        });

        it('should detect custom settings used in partials', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/with-partials', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should not run check when theme has no custom settings', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/no-custom-settings', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should detect custom settings used in filter attributes', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual([]);

            });
        });

        it('should not detect uppercase @CUSTOM in filter attributes (case-sensitive)', function () {
            return utils.testCheck(thisCheck, '100-custom-template-settings-usage/filter-attribute-uppercase', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(Object.keys(output.results.fail)).toEqual(['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);

                utils.assertValidFailObject(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING']);
                expect(output.results.fail['GS100-NO-UNUSED-CUSTOM-THEME-SETTING'].failures[0].message).toMatch(/authors_list/);

            });
        });
    });
});
