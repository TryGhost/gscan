/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/030-assets');

describe('Assets', function () {
    it('should show an error for missing asset helper when an asset is detected (theme example e)', function (done) {
        utils.testCheck(thisCheck, 'example-e').then(function (output) {
            output.should.be.an.Array().with.lengthOf(1);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('error');
            output[0].message.should.match(/asset should be served with the asset helper/);
            output[0].ref.should.match(/asset/);


            done();
        }).catch(done);
    });

    it('should output nothing when asset helper is present (theme example f)', function (done) {
        utils.testCheck(thisCheck, 'example-f').then(function (output) {
            output.should.be.empty();
            done();
        }).catch(done);
    });
});
