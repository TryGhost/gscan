/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/002-ghost-head-foot');

describe('Ghost head & foot', function () {
    it('should show errors for missing ghost head & foot helpers when no .hbs files are present(theme example a)', function (done) {
        utils.testCheck(thisCheck, 'example-a').then(function (output) {
            output.should.be.an.Array().with.lengthOf(2);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('warning');
            output[0].message.should.match(/helper not present/);
            output[0].ref.should.match(/ghost_head/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('warning');
            output[1].message.should.match(/helper not present/);
            output[1].ref.should.match(/ghost_foot/);

            done();
        }).catch(done);
    });

    it('should show errors for missing ghost head & foot helpers when they are not in any .hbs file (theme example d)', function (done) {
        utils.testCheck(thisCheck, 'example-d').then(function (output) {
            output.should.be.an.Array().with.lengthOf(2);

            output[0].should.be.a.ValidCheckObject();
            output[0].type.should.eql('warning');
            output[0].message.should.match(/helper not present/);
            output[0].ref.should.match(/ghost_head/);

            output[1].should.be.a.ValidCheckObject();
            output[1].type.should.eql('warning');
            output[1].message.should.match(/helper not present/);
            output[1].ref.should.match(/ghost_foot/);

            done();
        }).catch(done);
    });

    it('should output nothing when ghost head & foot helpers are present (theme example e)', function (done) {
        utils.testCheck(thisCheck, 'example-e').then(function (output) {
            output.should.be.empty();
            done();
        }).catch(done);
    });
});
