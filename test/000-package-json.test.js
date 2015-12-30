/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/000-package-json');

describe('package.json', function () {
    it('should output error for missing package.json (theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.an.Array().with.lengthOf(1);
            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('warning');
            output[0].message.should.match(/file not present/);
            done();
        });
    });

    it('should output error for invalid package.json (theme example b)', function (done) {
        utils.testCheck(thisCheck, 'example-b').then(function (output) {
            output.should.be.an.Array().with.lengthOf(1);
            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('error');
            output[0].message.should.match(/file is invalid/);
            done();
        });
    });

    it('should output warnings for missing author (theme example c)', function (done) {
        utils.testCheck(thisCheck, 'example-c').then(function (output) {
            output.should.be.an.Array().which.is.empty();
            done();
        });
    });
});