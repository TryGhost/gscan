/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/005-template-compile');

describe('Template compile', function () {
    it('should output empty array for a theme with no templates', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.empty();
            done();
        }).catch(done);
    });

    it('should output empty array for a theme with valid templates', function (done) {
        utils.testCheck(thisCheck, 'example-f').then(function (output) {
            output.should.be.empty();
            done();
        }).catch(done);
    });

    it('should output errors for a theme with invalid templates', function (done) {
        utils.testCheck(thisCheck, 'example-d').then(function (output) {
            output.should.be.an.Array().with.lengthOf(3);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('error');
            output[0].ref.should.eql('index.hbs');
            output[0].message.should.match(/^The partial/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('error');
            output[1].ref.should.eql('page.hbs');
            output[1].message.should.match(/^Parse error/);

            output[2].should.be.a.ValidCheckObject();
            output[2].type.should.eql('error');
            output[2].ref.should.eql('post.hbs');
            output[2].message.should.match(/^Missing helper/);

            done();
        }).catch(done);
    });
});
