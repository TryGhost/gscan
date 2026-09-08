const utils = require('./utils');

const thisCheck = require('../lib/checks/020-theme-structure');

describe('020 Theme structure', function () {
    const options = {checkVersion: 'v3'};

    it('should fail all rules if no files present', function () {
        return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
            utils.assertValidThemeObject(output);

            // Should not pass any rules
            expect(output.results.pass).toEqual([]);

            utils.assertObjectKeys(output.results.fail, 'GS020-INDEX-REQ', 'GS020-POST-REQ', 'GS020-DEF-REC');
            utils.assertValidFailObject(output.results.fail['GS020-INDEX-REQ']);
            utils.assertValidFailObject(output.results.fail['GS020-POST-REQ']);
            utils.assertValidFailObject(output.results.fail['GS020-DEF-REC']);

            expect(output.results.fail['GS020-INDEX-REQ'].failures[0].ref).toEqual('index.hbs');
            expect(output.results.fail['GS020-POST-REQ'].failures[0].ref).toEqual('post.hbs');
            expect(output.results.fail['GS020-DEF-REC'].failures[0].ref).toEqual('default.hbs');

        });
    });

    it('should pass and fail when some rules pass and others fail', function () {
        return utils.testCheck(thisCheck, '020-structure/mixed', options).then(function (output) {
            utils.assertValidThemeObject(output);

            // Should pass the index rule
            expect(output.results.pass).toHaveLength(1);
            utils.assertContains(output.results.pass, 'GS020-INDEX-REQ');

            utils.assertObjectKeys(output.results.fail, 'GS020-POST-REQ', 'GS020-DEF-REC');

            utils.assertValidFailObject(output.results.fail['GS020-POST-REQ']);
            utils.assertValidFailObject(output.results.fail['GS020-DEF-REC']);

        });
    });

    it('should still fail with just a recommendation', function () {
        return utils.testCheck(thisCheck, '020-structure/recommendation', options).then(function (output) {
            utils.assertValidThemeObject(output);

            // Should not pass any rules
            expect(output.results.pass).toHaveLength(2);
            utils.assertContains(output.results.pass, 'GS020-INDEX-REQ', 'GS020-POST-REQ');

            utils.assertObjectKeys(output.results.fail, 'GS020-DEF-REC');

            utils.assertValidFailObject(output.results.fail['GS020-DEF-REC']);

        });
    });
});
