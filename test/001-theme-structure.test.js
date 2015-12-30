/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),

    thisCheck = require('../lib/checks/001-theme-structure');

describe('Theme structure', function () {
    it('should output info about missing theme files (theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.an.Array().with.lengthOf(3);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('error');
            output[0].message.should.match(/file not present/);
            output[0].ref.should.match(/index.hbs/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('error');
            output[1].message.should.match(/file not present/);
            output[1].ref.should.match(/post.hbs/);

            output[2].should.be.a.ValidCheckObject();
            output[2].type.should.eql('recommendation');
            output[2].message.should.match(/file not present/);
            output[2].ref.should.match(/default.hbs/);
            done();
        });
    });

    it('should output error when a required theme file is missing (theme example b)', function (done) {
        utils.testCheck(thisCheck, 'example-b').then(function (output) {
            output.should.be.an.Array().with.lengthOf(2);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('error');
            output[0].message.should.match(/file not present/);
            output[0].ref.should.match(/post.hbs/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('recommendation');
            output[1].message.should.match(/file not present/);
            output[1].ref.should.match(/default.hbs/);
            done();
        });
    });

    it('should output recommendation when a suggested theme file is missing (theme example c)', function (done) {
        utils.testCheck(thisCheck, 'example-c').then(function (output) {
            output.should.be.an.Array().with.lengthOf(1);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('recommendation');
            output[0].message.should.match(/file not present/);
            output[0].ref.should.match(/default.hbs/);
            done();
        });
    });
});