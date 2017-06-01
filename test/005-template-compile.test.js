/*globals describe, it */
var should = require('should'),
    utils = require('./utils'),
    thisCheck = require('../lib/checks/005-template-compile');

describe('Template compile', function () {
    it('should output empty array for a theme with no templates', function (done) {
        utils.testCheck(thisCheck, 'is-empty').then(function (output) {
            output.should.be.a.ValidThemeObject();
            output.results.fail.should.be.an.Object().which.is.empty();

            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS005-TPL-ERR');

            done();
        }).catch(done);
    });

    it('should output empty array for a theme with valid templates', function (done) {
        utils.testCheck(thisCheck, '005-compile/valid').then(function (output) {
            output.should.be.a.ValidThemeObject();

            output.results.fail.should.be.an.Object().which.is.empty();

            output.results.pass.should.be.an.Array().with.lengthOf(1);
            output.results.pass.should.containEql('GS005-TPL-ERR');

            done();
        }).catch(done);
    });

    it('should output errors for a theme with invalid templates', function (done) {
        utils.testCheck(thisCheck, '005-compile/invalid').then(function (output) {
            output.should.be.a.ValidThemeObject();
            output.results.pass.should.be.an.Array().which.is.empty();

            output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
            output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

            var failures = output.results.fail['GS005-TPL-ERR'].failures;
            failures[0].ref.should.eql('index.hbs');
            failures[0].message.should.match(/^The partial/);

            failures[1].ref.should.eql('page.hbs');
            failures[1].message.should.match(/^Parse error/);

            failures[2].ref.should.eql('post.hbs');
            failures[2].message.should.match(/^Missing helper/);

            done();
        }).catch(done);
    });
});
