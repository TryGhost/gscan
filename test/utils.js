var path          = require('path'),
    readTheme     = require('../lib/read-theme'),
    testThemePath = 'test/fixtures/themes/',
    getThemePath,
    testCheck;


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
