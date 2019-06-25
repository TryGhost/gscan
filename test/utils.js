var path = require('path'),
    should = require('should'),
    readTheme = require('../lib/read-theme'),
    testThemePath = 'test/fixtures/themes',
    getThemePath,
    testCheck;

should.Assertion.add('ValidResultObject', function () {
    this.params = {operator: 'to be valid result object'};

    should.exist(this.obj);

    this.obj.should.be.an.Object().with.properties(['pass', 'fail']);
    this.obj.pass.should.be.an.Array();
    this.obj.fail.should.be.an.Object();
});

should.Assertion.add('ValidThemeObject', function () {
    this.params = {operator: 'to be valid theme object'};

    should.exist(this.obj);
    this.obj.should.be.an.Object().with.properties(['path', 'files', 'results']);
    this.obj.path.should.be.a.String();
    this.obj.files.should.be.an.Array();
    this.obj.results.should.be.a.ValidResultObject();
});

should.Assertion.add('ValidFailObject', function () {
    //this.obj.should.be.an.Object().with.properties(['level', 'message', 'ref']);
    //this.obj.should.have.property('level').which.is.a.String().and.be.oneOf(levels);
    //this.obj.should.have.property('message').which.is.a.String();
    //this.obj.should.have.property('ref').which.is.a.String();

    Object.keys(this.obj).forEach(function (key) {
        key.should.be.oneOf('message', 'failures');
    });

    if (Object.prototype.hasOwnProperty.call(this.obj, 'message')) {
        this.obj.message.should.be.a.String();
    }

    if (Object.prototype.hasOwnProperty.call(this.obj, 'failures')) {
        this.obj.failures.should.be.an.Array();
    }
});

should.Assertion.add('ValidRule', function () {
    var levels = ['error', 'warning', 'recommendation', 'feature']; // eslint-disable-line no-unused-vars
});

getThemePath = function (themeId) {
    return path.resolve(path.join(testThemePath, themeId));
};

testCheck = function testCheck(checkLib, themeId, options) {
    var themePath = getThemePath(themeId);

    return readTheme(themePath).then(function runCheck(theme) {
        return checkLib.call(this, theme, options, themePath);
    });
};

module.exports = {
    testCheck: testCheck,
    themePath: getThemePath
};
