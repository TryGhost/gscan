const utils = require('./utils');
const thisCheck = require('../lib/checks/051-custom-fonts-css-properties');

describe('051 custom fonts CSS properties', function () {
    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('should show warnings for missing custom heading and body font CSS properties when they are not in any .hbs or .css file', function () {
            return utils.testCheck(thisCheck, '051-custom-fonts-css-properties/missing', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS051-CUSTOM-FONTS');

                utils.assertValidFailObject(output.results.fail['GS051-CUSTOM-FONTS']);

            });
        });

        it('should output nothing when custom heading and body font CSS properties are present', function () {
            return utils.testCheck(thisCheck, '051-custom-fonts-css-properties/valid', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);
                utils.assertContains(output.results.pass, 'GS051-CUSTOM-FONTS');

                expect(output.results.fail).toEqual({});

            });
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('should show warnings for missing custom heading and body font CSS properties when they are not in any .hbs or .css file', function () {
            return utils.testCheck(thisCheck, '051-custom-fonts-css-properties/missing', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toEqual([]);

                utils.assertObjectKeys(output.results.fail, 'GS051-CUSTOM-FONTS');

                utils.assertValidFailObject(output.results.fail['GS051-CUSTOM-FONTS']);

            });
        });

        it('should output nothing when custom heading and body font CSS properties are present', function () {
            return utils.testCheck(thisCheck, '051-custom-fonts-css-properties/valid', options).then((output) => {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);
                utils.assertContains(output.results.pass, 'GS051-CUSTOM-FONTS');

                expect(output.results.fail).toEqual({});

            });
        });
    });
});
