/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/030-assets');

describe('Assets', function () {
    it('should show warning for missing asset helper when no .hbs files are present(theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.an.Array().with.lengthOf(1);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('warning');
            output[0].message.should.match(/helper not present/);
            output[0].ref.should.match(/asset/);

            done();
        }).catch(done);
    });

    it('should show warning for missing asset helper when they are not in any .hbs file (theme example d)', function (done) {
        utils.testCheck(thisCheck, 'example-d').then(function (output) {
            output.should.be.an.Array().with.lengthOf(1);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('warning');
            output[0].message.should.match(/helper not present/);
            output[0].ref.should.match(/asset/);

            done();
        }).catch(done);
    });

    it('should show warning & error for missing asset helper when an asset is detected (theme example e)', function (done) {
        utils.testCheck(thisCheck, 'example-e').then(function (output) {
            output.should.be.an.Array().with.lengthOf(2);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('warning');
            output[0].message.should.match(/helper not present/);
            output[0].ref.should.match(/asset/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('error');
            output[1].message.should.match(/asset should be served with the asset helper/);
            output[1].ref.should.match(/asset/);


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
