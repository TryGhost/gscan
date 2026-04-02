const utils = require('./utils');
const thisCheck = require('../lib/checks/070-theme-translations');

const {check} = require('../lib/checker');
const format = require('../lib/format');

describe('070 Theme Translations', function () {
    it('should not run check for v1', function () {
        const options = {checkVersion: 'v1'};
        return utils.testCheck(thisCheck, '070-theme-translations/invalid', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toEqual([]);
            expect(output.results.fail).toEqual({});

        });
    });

    it('should not run check for v2', function () {
        const options = {checkVersion: 'v2'};
        return utils.testCheck(thisCheck, '070-theme-translations/invalid', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toEqual([]);
            expect(output.results.fail).toEqual({});

        });
    });

    it('should fail when a theme has invalid locales', function () {
        const options = {checkVersion: 'v5'};
        return check(utils.themePath('070-theme-translations/invalid'), options).then((theme) => {
            utils.assertValidThemeObject(theme);

            expect(theme.results.pass).not.toContain('GS070-VALID-TRANSLATIONS');
            utils.assertObjectKeys(theme.results.fail, 'GS070-VALID-TRANSLATIONS');

            utils.assertValidFailObject(theme.results.fail['GS070-VALID-TRANSLATIONS']);
            expect(theme.results.fail['GS070-VALID-TRANSLATIONS'].failures).toHaveLength(2);

            utils.assertObjectKeys(theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[0], 'ref', 'message');
            expect(theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[0].ref).toEqual('locales/en.json');

            utils.assertObjectKeys(theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[1], 'ref', 'message');
            expect(theme.results.fail['GS070-VALID-TRANSLATIONS'].failures[1].ref).toEqual('locales/es.json');

            theme = format(theme, options);

            const error = theme.results.error.find(e => e.code === 'GS070-VALID-TRANSLATIONS');

            expect(error).toEqual(expect.any(Object));
            expect(error.fatal).toBe(true);

        });
    });

    it('should pass when a theme has valid locales', function () {
        const options = {};
        return utils.testCheck(thisCheck, '070-theme-translations/valid', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toHaveLength(1);
            utils.assertContains(output.results.pass, 'GS070-VALID-TRANSLATIONS');

        });
    });
});
