const should = require('should'); // eslint-disable-line no-unused-vars
const utils = require('./utils');
const thisCheck = require('../lib/checks/081-helper-presence');

describe('081 Presence tests', function () {
    describe('canary', function () {
        const options = {checkVersion: 'canary'};

        it('[success] should show no error if helpers are present', async function () {
            const output = await utils.testCheck(thisCheck, '081-helper-presence/canary/valid', options);

            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().which.is.empty();
            output.results.pass.should.be.an.Array().with.lengthOf(2);
        });

        it('[failure] should show error if helpers are not present', async function () {
            const output = await utils.testCheck(thisCheck, '081-helper-presence/canary/invalid', options);

            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().with.keys(
                'GS081-FIMG-CAPTION',
                'GS081-FIMG-ALT'
            );

            output.results.fail['GS081-FIMG-CAPTION'].should.be.a.ValidFailObject();
            output.results.fail['GS081-FIMG-ALT'].should.be.a.ValidFailObject();

            output.results.pass.should.be.an.Array().with.lengthOf(0);
        });
    });
});
