var path          = require('path'),
    should        = require('should'),
    readTheme     = require('../lib/read-theme'),
    testThemePath = 'test/fixtures/themes/',
    getThemePath,
    testCheck;

should.Assertion.add('ValidCheckObject', function () {
    var types = ['error', 'warning', 'recommendation', 'feature'];
    this.params = { operator: 'to be valid check object' };

    should.exist(this.obj);
    this.obj.should.be.an.Object().with.properties(['type', 'message', 'ref']);
    this.obj.should.have.property('type').which.is.a.String().and.be.oneOf(types);
    this.obj.should.have.property('message').which.is.a.String();
    this.obj.should.have.property('ref').which.is.a.String();
});

getThemePath = function (themeId) {
    return path.resolve(path.join(testThemePath, themeId));
};

testCheck = function testCheck(checkLib, themeId) {
    var themePath = getThemePath(themeId);

    return readTheme(themePath).then(function runCheck(theme) {
        return checkLib.check.call(this, theme);
    });
};

module.exports = {
    testCheck: testCheck,
    themePath: getThemePath
};
