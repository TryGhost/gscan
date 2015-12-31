/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/004-template-usage');

describe('Templates', function () {
    it('should be empty for theme with no optional templates (theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.empty();
            done();
        }).catch(done);
    });

    it('should add features for optional template page.hbs (theme example d)', function (done) {
        utils.testCheck(thisCheck, 'example-d').then(function (output) {
            output.should.be.an.Array().with.lengthOf(1);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('feature');
            output[0].message.should.match(/template is provided/);
            output[0].ref.should.match(/Page template/);
            done();
        }).catch(done);
    });

    it('should add features for optional template tag & author (theme example e)', function (done) {
        utils.testCheck(thisCheck, 'example-e').then(function (output) {
            output.should.be.an.Array().with.lengthOf(2);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('feature');
            output[0].message.should.match(/template is provided/);
            output[0].ref.should.match(/Tag template/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('feature');
            output[1].message.should.match(/template is provided/);
            output[1].ref.should.match(/Author template/);
            done();
        }).catch(done);
    });

    it('should add features for optional template page-about-me.hbs (theme example f)', function (done) {
        utils.testCheck(thisCheck, 'example-f').then(function (output) {
            output.should.be.an.Array().with.lengthOf(2);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('feature');
            output[0].message.should.match(/template is provided/);
            output[0].ref.should.match(/Page template/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('feature');
            output[1].message.should.match(/template is provided/);
            output[1].ref.should.match(/Custom page template/);
            done();
        }).catch(done);
    });
});