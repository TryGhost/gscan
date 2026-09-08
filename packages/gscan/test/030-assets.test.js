const utils = require('./utils');
const thisCheck = require('../lib/checks/030-assets');

describe('030 Assets', function () {
    const options = {checkVersion: 'v3'};

    it('should show a warning for missing asset helper when an asset is detected', function () {
        return utils.testCheck(thisCheck, '030-assets/missing', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toHaveLength(1);
            utils.assertContains(output.results.pass, 'GS030-ASSET-SYM');

            utils.assertObjectKeys(output.results.fail, 'GS030-ASSET-REQ');

            utils.assertValidFailObject(output.results.fail['GS030-ASSET-REQ']);
            expect(output.results.fail['GS030-ASSET-REQ'].failures).toHaveLength(1);
            utils.assertObjectKeys(output.results.fail['GS030-ASSET-REQ'].failures[0], 'ref', 'message');
            expect(output.results.fail['GS030-ASSET-REQ'].failures[0].ref).toEqual('default.hbs');
            expect(output.results.fail['GS030-ASSET-REQ'].failures[0].message).toEqual('/assets/css/style.css');

        });
    });

    it('should show two warning for missing asset helper when an assets are detected in multiple files', function () {
        return utils.testCheck(thisCheck, '030-assets/twoDefectFiles', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toHaveLength(1);
            utils.assertContains(output.results.pass, 'GS030-ASSET-SYM');

            utils.assertObjectKeys(output.results.fail, 'GS030-ASSET-REQ');

            utils.assertValidFailObject(output.results.fail['GS030-ASSET-REQ']);
            expect(output.results.fail['GS030-ASSET-REQ'].failures).toHaveLength(2);
            utils.assertObjectKeys(output.results.fail['GS030-ASSET-REQ'].failures[0], 'ref');
            expect(output.results.fail['GS030-ASSET-REQ'].failures[0].ref).toEqual('default.hbs');
            utils.assertObjectKeys(output.results.fail['GS030-ASSET-REQ'].failures[0], 'message');
            expect(output.results.fail['GS030-ASSET-REQ'].failures[0].message).toEqual('/assets/css/style.css');
            utils.assertObjectKeys(output.results.fail['GS030-ASSET-REQ'].failures[1], 'ref');
            expect(output.results.fail['GS030-ASSET-REQ'].failures[1].ref).toEqual('partials/sidebar.hbs');
            utils.assertObjectKeys(output.results.fail['GS030-ASSET-REQ'].failures[1], 'message');
            expect(output.results.fail['GS030-ASSET-REQ'].failures[1].message).toEqual('/assets/images/JohnDo.jpg');

        });
    });

    it('should pass when asset helper is present', function () {
        return utils.testCheck(thisCheck, '030-assets/valid', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.fail).toEqual({});

            expect(output.results.pass).toHaveLength(2);
            utils.assertContains(output.results.pass, 'GS030-ASSET-REQ');
            utils.assertContains(output.results.pass, 'GS030-ASSET-SYM');

        });
    });

    it('should pass for external URLs containing /assets/', function () {
        return utils.testCheck(thisCheck, '030-assets/absolute-url', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.fail).toEqual({});

            expect(output.results.pass).toHaveLength(2);
            utils.assertContains(output.results.pass, 'GS030-ASSET-REQ');
            utils.assertContains(output.results.pass, 'GS030-ASSET-SYM');

        });
    });

    it('should show error when symlink is present', function () {
        return utils.testCheck(thisCheck, '030-assets/symlink', options).then(function (output) {
            utils.assertValidThemeObject(output);

            expect(output.results.pass).toHaveLength(1);
            utils.assertContains(output.results.pass, 'GS030-ASSET-REQ');

            utils.assertObjectKeys(output.results.fail, 'GS030-ASSET-SYM');

            utils.assertValidFailObject(output.results.fail['GS030-ASSET-SYM']);
            expect(output.results.fail['GS030-ASSET-SYM'].failures).toHaveLength(1);
            utils.assertObjectKeys(output.results.fail['GS030-ASSET-SYM'].failures[0], 'ref');
            expect(output.results.fail['GS030-ASSET-SYM'].failures[0].ref).toEqual('assets/mysymlink.png');

        });
    });
});
