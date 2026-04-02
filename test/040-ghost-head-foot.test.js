const utils = require('./utils');
const thisCheck = require('../lib/checks/040-ghost-head-foot');

describe('040 Ghost head & foot', function () {
    const options = {checkVersion: 'v3'};

    it('should show warnings for missing ghost head & foot helpers when no .hbs files are present', function () {
        return utils.testCheck(thisCheck, 'is-empty', options).then((output) => {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toEqual([]);

            utils.assertObjectKeys(output.results.fail, 'GS040-GH-REQ', 'GS040-GF-REQ');

            utils.assertValidFailObject(output.results.fail['GS040-GH-REQ']);
            utils.assertValidFailObject(output.results.fail['GS040-GF-REQ']);

            expect(output.results.fail['GS040-GH-REQ'].failures[0].ref).toEqual('default.hbs');
            expect(output.results.fail['GS040-GF-REQ'].failures[0].ref).toEqual('default.hbs');

        });
    });

    it('should show warnings for missing ghost head & foot helpers when they are not in any .hbs file', function () {
        return utils.testCheck(thisCheck, '040-head-foot/missing', options).then((output) => {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toEqual([]);

            utils.assertObjectKeys(output.results.fail, 'GS040-GH-REQ', 'GS040-GF-REQ');

            utils.assertValidFailObject(output.results.fail['GS040-GH-REQ']);
            utils.assertValidFailObject(output.results.fail['GS040-GF-REQ']);

        });
    });

    it('should output nothing when ghost head & foot helpers are present', function () {
        return utils.testCheck(thisCheck, '040-head-foot/valid', options).then((output) => {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toHaveLength(2);
            utils.assertContains(output.results.pass, 'GS040-GH-REQ', 'GS040-GF-REQ');

            expect(output.results.fail).toEqual({});

        });
    });
});
