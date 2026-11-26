const resolveKnownHelpers = require('../../lib/utils/resolve-known-helpers');
const labsEnabledHelpers = require('../../lib/utils/labs-enabled-helpers');

describe('resolveKnownHelpers', function () {
    afterEach(function () {
        delete labsEnabledHelpers.testHelper;
    });

    it('returns the original array when no labs helpers apply', function () {
        const known = ['a', 'b'];
        expect(resolveKnownHelpers(known, {})).toBe(known);
        expect(resolveKnownHelpers(known)).toBe(known);
    });

    it('merges truthy labs helpers without mutating the base list', function () {
        labsEnabledHelpers.testHelper = 'testFlag';
        const known = ['a', 'b'];
        const result = resolveKnownHelpers(known, {testFlag: true});

        expect(result).toEqual(['a', 'b', 'testHelper']);
        expect(known).toEqual(['a', 'b']);
    });

    it('ignores labs flags that are present but falsy', function () {
        labsEnabledHelpers.testHelper = 'testFlag';
        const known = ['a'];

        expect(resolveKnownHelpers(known, {testFlag: false})).toBe(known);
        expect(resolveKnownHelpers(known, {testFlag: 0})).toBe(known);
        expect(resolveKnownHelpers(known, {testFlag: ''})).toBe(known);
    });
});
