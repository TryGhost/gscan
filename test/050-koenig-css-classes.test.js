var should = require('should'), // eslint-disable-line no-unused-vars
    utils = require('./utils'),
    thisCheck = require('../lib/checks/050-koenig-css-classes');

describe('050 Koenig CSS classes', function () {
    describe('v1:', function () {
        const options = {checkVersion: 'v1'};

        it('[success] should not test for v1', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();
                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v2:', function () {
        const options = {checkVersion: 'v2'};

        it('[failure] should invalidate theme when .css file is missing', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGR'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                output.results.fail['GS050-CSS-KGWF'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGWW'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGC'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGR'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGI'].failures.length.should.eql(1);

                output.results.fail['GS050-CSS-KGWF'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGWW'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGC'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGR'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGI'].failures[0].ref.should.eql('styles');

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when CSS classes are missing', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGR'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(15);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v3:', function () {
        const options = {checkVersion: 'v3'};

        it('[failure] should invalidate theme when .css file is missing', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGR'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                output.results.fail['GS050-CSS-KGWF'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGWW'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGC'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGR'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGI'].failures.length.should.eql(1);

                output.results.fail['GS050-CSS-KGWF'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGWW'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGC'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGR'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGI'].failures[0].ref.should.eql('styles');

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when CSS classes are missing', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGR'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(15);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v4:', function () {
        const options = {checkVersion: 'v4'};

        it('[failure] should invalidate theme when .css file is missing', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGR'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                output.results.fail['GS050-CSS-KGWF'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGWW'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGC'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGR'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGGI'].failures.length.should.eql(1);

                output.results.fail['GS050-CSS-KGWF'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGWW'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGC'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGR'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGGI'].failures[0].ref.should.eql('styles');

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when CSS classes are missing', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGR', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGR'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWF', 'GS050-CSS-KGGC', 'GS050-CSS-KGGI');

                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGC'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGGI'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(15);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset is true', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses include', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-include', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(96);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses exclude', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(5);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v5:', function () {
        const options = {checkVersion: 'v5'};

        it('[failure] should invalidate theme when .css file is missing', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();

                output.results.fail['GS050-CSS-KGWF'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGWW'].failures.length.should.eql(1);

                output.results.fail['GS050-CSS-KGWF'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGWW'].failures[0].ref.should.eql('styles');

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when CSS classes are missing', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(1);

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWF');

                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset is true', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses include', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-include', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(96);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses exclude', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(5);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });

    describe('v6:', function () {
        const options = {checkVersion: 'v6'};

        it('[failure] should invalidate theme when .css file is missing', function (done) {
            utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();

                output.results.fail['GS050-CSS-KGWF'].failures.length.should.eql(1);
                output.results.fail['GS050-CSS-KGWW'].failures.length.should.eql(1);

                output.results.fail['GS050-CSS-KGWF'].failures[0].ref.should.eql('styles');
                output.results.fail['GS050-CSS-KGWW'].failures[0].ref.should.eql('styles');

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when CSS classes are missing', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/missing', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().which.is.empty();

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWW', 'GS050-CSS-KGWF');

                output.results.fail['GS050-CSS-KGWW'].should.be.a.ValidFailObject();
                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[failure] should invalidate theme when three CSS classes are missing (classes are spread in hbs and css files)', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/mixed', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(1);

                output.results.fail.should.be.an.Object().with.keys('GS050-CSS-KGWF');

                output.results.fail['GS050-CSS-KGWF'].should.be.a.ValidFailObject();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset is true', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(2);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses include', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-include', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(96);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });

        it('[success] should pass theme when CSS classes are present and card-asset uses exclude', function (done) {
            utils.testCheck(thisCheck, '050-koenig-css-classes/valid-card-assets-exclude', options).then(function (output) {
                output.should.be.a.ValidThemeObject();

                output.results.pass.should.be.an.Array().with.lengthOf(5);

                output.results.fail.should.be.an.Object().which.is.empty();

                done();
            }).catch(done);
        });
    });
});
