var path      = require('path'),
    readTheme = require('../lib/read-theme'),
    themePath,
    testSetup;

themePath = function themePath(id) {
    return path.resolve(path.join('test/fixtures/themes/', id));
};

testCheck = function testCheck(checkLib, themeId) {
    var tPath = themePath(themeId);
    return readTheme(tPath).then(function runCheck(themeFiles) {
        return checkLib.check.call(this, tPath, themeFiles);
    });
};

module.exports = {
    themePath: themePath,
    testCheck: testCheck
};
