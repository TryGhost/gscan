const path = require('path');
const readTheme = require('../lib/read-theme');
const testThemePath = 'test/fixtures/themes';

const assertValidResultObject = function (result) {
    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining({
        pass: expect.any(Array),
        fail: expect.any(Object)
    }));
};

const assertValidThemeObject = function (theme) {
    expect(theme).toBeDefined();
    expect(theme).toEqual(expect.objectContaining({
        path: expect.any(String),
        files: expect.any(Array),
        results: expect.any(Object)
    }));

    assertValidResultObject(theme.results);
};

const assertValidFailObject = function (failObject) {
    expect(failObject).toBeDefined();
    expect(failObject).toEqual(expect.any(Object));

    Object.keys(failObject).forEach(function (key) {
        expect(['message', 'failures']).toContain(key);
    });

    if (Object.prototype.hasOwnProperty.call(failObject, 'message')) {
        expect(failObject.message).toEqual(expect.any(String));
    }

    if (Object.prototype.hasOwnProperty.call(failObject, 'failures')) {
        expect(failObject.failures).toEqual(expect.any(Array));
    }
};

const assertObjectKeys = function (value, ...keys) {
    const dedupedKeys = [...new Set(keys)];

    dedupedKeys.forEach((key) => {
        expect(value).toHaveProperty(key);
    });
};

const assertContains = function (value, ...items) {
    if (typeof value === 'string') {
        items.forEach((item) => {
            expect(value).toContain(item);
        });
        return;
    }

    items.forEach((item) => {
        expect(value).toContainEqual(item);
    });
};

const getThemePath = function (themeId) {
    return path.resolve(path.join(testThemePath, themeId));
};

const testCheck = function testCheck(checkLib, themeId, options) {
    const themePath = getThemePath(themeId);

    return readTheme(themePath).then(function runCheck(theme) {
        return checkLib.call(this, theme, options, themePath);
    });
};

module.exports = {
    assertContains,
    assertObjectKeys,
    assertValidFailObject,
    assertValidResultObject,
    assertValidThemeObject,
    testCheck,
    themePath: getThemePath
};
