const should = require('should');
const {testCheck, themePath} = require('./utils');

const checkPackageJSON = require('../lib/checks/010-package-json');
const checkAssets = require('../lib/checks/030-assets');
const checkCustomFontsCssProperties = require('../lib/checks/051-custom-fonts-css-properties');
const checkGhostUrlAPI = require('../lib/checks/060-js-api-usage');

describe('Coverage gaps check mappings', function () {
    const options = {checkVersion: 'v6'};

    it('maps package.json check for empty card_assets object', async function () {
        const fixtureId = 'coverage-gaps/packagejson-card-assets-empty-object';
        const output = await testCheck(checkPackageJSON, fixtureId, options);

        output.path.should.eql(themePath(fixtureId));
        should.exist(output.results.fail['GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT']);
    });

    it('maps package.json check for non-empty card_assets object', async function () {
        const fixtureId = 'coverage-gaps/packagejson-card-assets-non-empty-object';
        const output = await testCheck(checkPackageJSON, fixtureId, options);

        output.path.should.eql(themePath(fixtureId));
        should.not.exist(output.results.fail['GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT']);
    });

    it('maps assets check through test utilities', async function () {
        const fixtureId = '030-assets/missing';
        const output = await testCheck(checkAssets, fixtureId, options);

        output.path.should.eql(themePath(fixtureId));
        should.exist(output.results.fail['GS030-ASSET-REQ']);
    });

    it('maps custom fonts CSS check through test utilities', async function () {
        const fixtureId = '051-custom-fonts-css-properties/missing';
        const output = await testCheck(checkCustomFontsCssProperties, fixtureId, options);

        output.path.should.eql(themePath(fixtureId));
        should.exist(output.results.fail['GS051-CUSTOM-FONTS']);
    });

    it('maps JS API usage check through test utilities', async function () {
        const fixtureId = '060-js-api-usage/invalid';
        const output = await testCheck(checkGhostUrlAPI, fixtureId, options);

        output.path.should.eql(themePath(fixtureId));
        should.exist(output.results.fail['GS060-JS-GUA']);
    });
});
