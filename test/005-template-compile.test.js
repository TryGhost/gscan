var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/005-template-compile');

describe('005 Template compile', function () {
    describe('v1', function () {
        const options = {checkVersion: 'v1'};

        it('should output empty array for a theme with no templates', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with valid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v1/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output errors for a theme with invalid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v1/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                var failures = output.results.fail['GS005-TPL-ERR'].failures;

                failures.length.should.eql(4);

                failures[0].ref.should.eql('author.hbs');
                failures[0].message.should.match(/^Missing helper: "bla"/);

                failures[1].ref.should.eql('index.hbs');
                failures[1].message.should.match(/^The partial my-partial could not be found/);

                failures[2].ref.should.eql('page.hbs');
                failures[2].message.should.match(/^Parse error on line 2/);

                failures[3].ref.should.eql('post.hbs');
                failures[3].message.should.match(/^Missing helper: "my-helper"/);

                done();
            }).catch(done);
        });

        it('theme with partials and unknown helper', function (done) {
            utils.testCheck(thisCheck, '005-compile/v1/invalid-with-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('theme with block partials', function (done) {
            utils.testCheck(thisCheck, 'theme-with-block-partials').then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.empty();
                done();
            }).catch(done);
        });
    });

    describe('v2', function () {
        const options = {checkVersion: 'v2'};

        it('should output empty array for a theme with no templates', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with valid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v2/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output errors for a theme with invalid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v2/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                var failures = output.results.fail['GS005-TPL-ERR'].failures;

                failures.length.should.eql(4);

                failures[0].ref.should.eql('author.hbs');
                failures[0].message.should.match(/^Missing helper: "bla"/);

                failures[1].ref.should.eql('index.hbs');
                failures[1].message.should.match(/^The partial my-partial could not be found/);

                failures[2].ref.should.eql('page.hbs');
                failures[2].message.should.match(/^Parse error on line 2/);

                failures[3].ref.should.eql('post.hbs');
                failures[3].message.should.match(/^Missing helper: "my-helper"/);

                done();
            }).catch(done);
        });

        it('theme with partials and unknown helper', function (done) {
            utils.testCheck(thisCheck, '005-compile/v2/invalid-with-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('theme with block partials', function (done) {
            utils.testCheck(thisCheck, 'theme-with-block-partials').then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.empty();
                done();
            }).catch(done);
        });
    });

    describe('v3', function () {
        const options = {checkVersion: 'v3'};

        it('should output empty array for a theme with no templates', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with valid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v3/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output errors for a theme with invalid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/v3/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                var failures = output.results.fail['GS005-TPL-ERR'].failures;

                failures.length.should.eql(4);

                failures[0].ref.should.eql('author.hbs');
                failures[0].message.should.match(/^Missing helper: "bla"/);

                failures[1].ref.should.eql('index.hbs');
                failures[1].message.should.match(/^The partial my-partial could not be found/);

                failures[2].ref.should.eql('page.hbs');
                failures[2].message.should.match(/^Parse error on line 2/);

                failures[3].ref.should.eql('post.hbs');
                failures[3].message.should.match(/^Missing helper: "my-helper"/);

                done();
            }).catch(done);
        });

        it('theme with partials and unknown helper', function (done) {
            utils.testCheck(thisCheck, '005-compile/v3/invalid-with-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('theme with partials and known helper', function (done) {
            utils.testCheck(thisCheck, '005-compile/v3/valid-with-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('theme with block partials', function (done) {
            utils.testCheck(thisCheck, 'theme-with-block-partials').then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.empty();
                done();
            }).catch(done);
        });
    });

    describe('canary', function () {
        const options = {checkVersion: 'canary'};

        it('should output empty array for a theme with no templates', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output empty array for a theme with valid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('should output errors for a theme with invalid templates', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/invalid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                var failures = output.results.fail['GS005-TPL-ERR'].failures;

                failures.length.should.eql(4);

                failures[0].ref.should.eql('author.hbs');
                failures[0].message.should.match(/^Missing helper: "bla"/);

                failures[1].ref.should.eql('index.hbs');
                failures[1].message.should.match(/^The partial my-partial could not be found/);

                failures[2].ref.should.eql('page.hbs');
                failures[2].message.should.match(/^Parse error on line 2/);

                failures[3].ref.should.eql('post.hbs');
                failures[3].message.should.match(/^Missing helper: "my-helper"/);

                done();
            }).catch(done);
        });

        it('theme with partials and unknown helper', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/invalid-with-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('theme with partials and known helper', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/valid-with-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                done();
            }).catch(done);
        });

        it('theme with invalid block partials', function (done) {
            utils.testCheck(thisCheck, 'theme-with-block-partials').then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.empty();
                done();
            }).catch(done);
        });

        it('Detects missing partials in code flows', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/missing-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();
                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS005-TPL-ERR');
                output.results.fail['GS005-TPL-ERR'].should.be.a.ValidFailObject();

                var failures = output.results.fail['GS005-TPL-ERR'].failures;

                failures.length.should.eql(1);

                failures[0].ref.should.eql('index.hbs');
                failures[0].message.should.match(/^The partial missingpartial could not be found/);

                done();
            }).catch(done);
        });

        it('Lists but not wastes time on processing unused partials', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/unused-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                output.partials.should.be.an.Array().with.lengthOf(1);
                output.partials.should.containEql('mypartial');

                done();
            }).catch(done);
        });

        it('Ignores self referencing partials', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/recursive-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                output.results.pass.should.be.an.Array().with.lengthOf(1);
                output.results.pass.should.containEql('GS005-TPL-ERR');

                output.partials.should.be.an.Array().with.lengthOf(1);
                output.partials.should.containEql('recursive');

                done();
            }).catch(done);
        });

        it('lists used helpers', function (done) {
            utils.testCheck(thisCheck, '005-compile/canary/unused-partials', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.fail.should.be.an.Object().which.is.empty();

                let helperList = Object.keys(output.helpers);
                helperList.should.be.an.Array().with.lengthOf(1);
                helperList.should.containEql('cancel_link');

                done();
            }).catch(done);
        });
    });
});
