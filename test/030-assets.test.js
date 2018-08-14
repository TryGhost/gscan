var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/030-assets');

describe('030 Assets', function () {
    const options = {checkVersion: 'v1'};

    it('should show a warning for missing asset helper when an asset is detected', function (done) {
        utils.testCheck(thisCheck, '030-assets/missing', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS030-ASSET-SYM');

            output.results.fail.should.be.an.Object().with.keys('GS030-ASSET-REQ');

            output.results.fail['GS030-ASSET-REQ'].should.be.a.ValidFailObject();
            output.results.fail['GS030-ASSET-REQ'].failures.should.be.an.Array().with.lengthOf(1);
            output.results.fail['GS030-ASSET-REQ'].failures[0].should.have.keys('ref', 'message');
            output.results.fail['GS030-ASSET-REQ'].failures[0].ref.should.eql('default.hbs');
            output.results.fail['GS030-ASSET-REQ'].failures[0].message.should.eql('/assets/css/style.css');

            done();
        }).catch(done);
    });

    it('should pass when asset helper is present', function (done) {
        utils.testCheck(thisCheck, '030-assets/valid', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().which.is.empty();

            output.results.pass.should.be.an.Array().with.lengthOf(2);
            output.results.pass.should.containEql('GS030-ASSET-REQ');
            output.results.pass.should.containEql('GS030-ASSET-SYM');

            done();
        }).catch(done);
    });

    it('should show error when symlink is present', function (done) {
        utils.testCheck(thisCheck, '030-assets/symlink', options).then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS030-ASSET-REQ');

            output.results.fail.should.be.an.Object().with.keys('GS030-ASSET-SYM');

            output.results.fail['GS030-ASSET-SYM'].should.be.a.ValidFailObject();
            output.results.fail['GS030-ASSET-SYM'].failures.should.be.an.Array().with.lengthOf(1);
            output.results.fail['GS030-ASSET-SYM'].failures[0].should.have.keys('ref');
            output.results.fail['GS030-ASSET-SYM'].failures[0].ref.should.eql('assets/mysymlink.png');

            done();
        }).catch(done);
    });
});
