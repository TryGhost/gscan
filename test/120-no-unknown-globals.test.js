const utils = require('./utils');
const thisCheck = require('../lib/checks/120-no-unknown-globals');

describe('120 No unknown globals', function () {
    describe('v5', function () {
        const options = {checkVersion: 'v5'};

        it('should detect unknown globals', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                // should be a warning about unused globals
                utils.assertObjectKeys(output.results.fail, 'GS120-NO-UNKNOWN-GLOBALS');
                utils.assertValidFailObject(output.results.fail['GS120-NO-UNKNOWN-GLOBALS']);
                expect(output.results.fail['GS120-NO-UNKNOWN-GLOBALS'].failures).toHaveLength(4);

            });
        });

        it('should pass known globals', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/valid-with-globals', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);
                utils.assertContains(output.results.pass, 'GS120-NO-UNKNOWN-GLOBALS');

            });
        });

        it('should pass specific data variables like {{@first}}', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/valid-with-locals', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);
                utils.assertContains(output.results.pass, 'GS120-NO-UNKNOWN-GLOBALS');

            });
        });

        it('should flag the @gift global (only available from v6)', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/with-gift', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS120-NO-UNKNOWN-GLOBALS');
                utils.assertValidFailObject(output.results.fail['GS120-NO-UNKNOWN-GLOBALS']);
                expect(output.results.fail['GS120-NO-UNKNOWN-GLOBALS'].failures).toHaveLength(2);

            });
        });
    });

    describe('v6', function () {
        const options = {checkVersion: 'v6'};

        it('should detect unknown globals', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                // should be a warning about unused globals
                utils.assertObjectKeys(output.results.fail, 'GS120-NO-UNKNOWN-GLOBALS');
                utils.assertValidFailObject(output.results.fail['GS120-NO-UNKNOWN-GLOBALS']);
                expect(output.results.fail['GS120-NO-UNKNOWN-GLOBALS'].failures).toHaveLength(4);

            });
        });

        it('should pass known globals', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/valid-with-globals', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);
                utils.assertContains(output.results.pass, 'GS120-NO-UNKNOWN-GLOBALS');

            });
        });

        it('should pass specific data variables like {{@first}}', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/valid-with-locals', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);
                utils.assertContains(output.results.pass, 'GS120-NO-UNKNOWN-GLOBALS');

            });
        });

        it('should pass the @gift global', function () {
            return utils.testCheck(thisCheck, '120-no-unknown-globals/v5/with-gift', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.pass).toHaveLength(1);
                utils.assertContains(output.results.pass, 'GS120-NO-UNKNOWN-GLOBALS');

            });
        });
    });
});
