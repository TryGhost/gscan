const utils = require('./utils');
const thisCheck = require('../lib/checks/005-template-compile');

describe('005 Template compile', function () {
    describe('v1', function () {
        const options = {checkVersion: 'v1'};

        it('should output empty array for a theme with no templates', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output empty array for a theme with valid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v1/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output errors for a theme with invalid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v1/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(4);

                expect(failures[0].ref).toEqual('author.hbs');
                expect(failures[0].message).toMatch(/^Missing helper: "bla"/);

                expect(failures[1].ref).toEqual('index.hbs');
                expect(failures[1].message).toMatch(/^The partial my-partial could not be found/);

                expect(failures[2].ref).toEqual('page.hbs');
                expect(failures[2].message).toMatch(/^Parse error on line 2/);

                expect(failures[3].ref).toEqual('post.hbs');
                expect(failures[3].message).toMatch(/^Missing helper: "my-helper"/);

            });
        });

        it('theme with partials and unknown helper', function () {
            return utils.testCheck(thisCheck, '005-compile/v1/invalid-with-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

            });
        });

        it('theme with block partials', function () {
            return utils.testCheck(thisCheck, 'theme-with-block-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
            });
        });
    });

    describe('v2', function () {
        const options = {checkVersion: 'v2'};

        it('should output empty array for a theme with no templates', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output empty array for a theme with valid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v2/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output errors for a theme with invalid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v2/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(4);

                expect(failures[0].ref).toEqual('author.hbs');
                expect(failures[0].message).toMatch(/^Missing helper: "bla"/);

                expect(failures[1].ref).toEqual('index.hbs');
                expect(failures[1].message).toMatch(/^The partial my-partial could not be found/);

                expect(failures[2].ref).toEqual('page.hbs');
                expect(failures[2].message).toMatch(/^Parse error on line 2/);

                expect(failures[3].ref).toEqual('post.hbs');
                expect(failures[3].message).toMatch(/^Missing helper: "my-helper"/);

            });
        });

        it('theme with partials and unknown helper', function () {
            return utils.testCheck(thisCheck, '005-compile/v2/invalid-with-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

            });
        });

        it('theme with block partials', function () {
            return utils.testCheck(thisCheck, 'theme-with-block-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
            });
        });
    });

    describe('v3', function () {
        const options = {checkVersion: 'v3'};

        it('should output empty array for a theme with no templates', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output empty array for a theme with valid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v3/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output errors for a theme with invalid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v3/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(4);

                expect(failures[0].ref).toEqual('author.hbs');
                expect(failures[0].message).toMatch(/^Missing helper: "bla"/);

                expect(failures[1].ref).toEqual('index.hbs');
                expect(failures[1].message).toMatch(/^The partial my-partial could not be found/);

                expect(failures[2].ref).toEqual('page.hbs');
                expect(failures[2].message).toMatch(/^Parse error on line 2/);

                expect(failures[3].ref).toEqual('post.hbs');
                expect(failures[3].message).toMatch(/^Missing helper: "my-helper"/);

            });
        });

        it('theme with partials and unknown helper', function () {
            return utils.testCheck(thisCheck, '005-compile/v3/invalid-with-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

            });
        });

        it('theme with partials and known helper', function () {
            return utils.testCheck(thisCheck, '005-compile/v3/valid-with-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('theme with block partials', function () {
            return utils.testCheck(thisCheck, 'theme-with-block-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
            });
        });
    });

    describe('v4', function () {
        const options = {checkVersion: 'v4'};

        it('should output empty array for a theme with no templates', function () {
            return utils.testCheck(thisCheck, 'is-empty', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output empty array for a theme with valid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/valid', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('should output errors for a theme with invalid templates', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(4);

                expect(failures[0].ref).toEqual('author.hbs');
                expect(failures[0].message).toMatch(/^Missing helper: "bla"/);

                expect(failures[1].ref).toEqual('index.hbs');
                expect(failures[1].message).toMatch(/^The partial my-partial could not be found/);

                expect(failures[2].ref).toEqual('page.hbs');
                expect(failures[2].message).toMatch(/^Parse error on line 2/);

                expect(failures[3].ref).toEqual('post.hbs');
                expect(failures[3].message).toMatch(/^Missing helper: "my-helper"/);

            });
        });

        it('should output errors for a theme with invalid partials', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid-partial', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(1);

                expect(failures[0].ref).toEqual('partials/invalid-partial.hbs');
                expect(failures[0].message).toMatch(/^Missing helper: "my-helper"/);

            });
        });

        it('should output errors for a theme with invalid folder partials', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid-partial-folder', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(1);

                expect(failures[0].ref).toEqual('partials/folder/invalid-partial.hbs');
                expect(failures[0].message).toMatch(/^Missing helper: "my-helper"/);

            });
        });

        it('should output errors for a theme in subfolders', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid-folder', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(1);

                expect(failures[0].ref).toEqual('folder/invalid-template.hbs');
                expect(failures[0].message).toMatch(/^Missing helper: "my-helper"/);

            });
        });

        it('theme with partials and unknown helper', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid-with-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

            });
        });

        it('theme with invalid inline partials', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid-with-inline-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);
                expect(output.results.fail['GS005-TPL-ERR'].failures.length).toEqual(1);
                expect(output.results.fail['GS005-TPL-ERR'].failures[0].ref).toEqual('index.hbs');
                utils.assertContains(output.results.fail['GS005-TPL-ERR'].failures[0].message, 'myInlinePartial');

            });
        });

        it('theme with invalid inline partial', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid-with-inline-partials-2', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

            });
        });

        it('theme with inlined dynamic partial', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/invalid-with-dynamic-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                utils.assertObjectKeys(output.results.fail, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');
                utils.assertValidFailObject(output.results.fail['GS005-NO-INLINE-DYNAMIC-PARTIAL']);
                expect(output.results.fail['GS005-NO-INLINE-DYNAMIC-PARTIAL'].failures.length).toEqual(1);
                expect(output.results.fail['GS005-NO-INLINE-DYNAMIC-PARTIAL'].failures[0].ref).toEqual('post.hbs');
                utils.assertContains(output.results.fail['GS005-NO-INLINE-DYNAMIC-PARTIAL'].failures[0].message, 'Inline dynamic partial used');

                // The GS005-TPL-ERR rule still passes for this fixture — the
                // template compiles fine; the inline dynamic partial is a lint
                // warning, not a parse error.
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
            });
        });

        it('theme with bloc dynamic partial', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/valid-with-dynamic-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('theme with partials and known helper', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/valid-with-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

            });
        });

        it('theme with invalid block partials', function () {
            return utils.testCheck(thisCheck, 'theme-with-block-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});
            });
        });

        it('Detects missing partials in code flows', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/missing-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);
                expect(output.results.pass).toEqual(['GS005-NO-INLINE-DYNAMIC-PARTIAL']);

                utils.assertObjectKeys(output.results.fail, 'GS005-TPL-ERR');
                utils.assertValidFailObject(output.results.fail['GS005-TPL-ERR']);

                const failures = output.results.fail['GS005-TPL-ERR'].failures;

                expect(failures.length).toEqual(1);

                expect(failures[0].ref).toEqual('index.hbs');
                expect(failures[0].message).toMatch(/^The partial missingpartial could not be found/);

            });
        });

        it('Lists but not wastes time on processing unused partials', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/unused-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

                expect(output.partials).toHaveLength(1);
                utils.assertContains(output.partials, 'mypartial');

            });
        });

        it('Ignores self referencing partials', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/recursive-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                expect(output.results.pass).toHaveLength(2);
                utils.assertContains(output.results.pass, 'GS005-TPL-ERR');
                utils.assertContains(output.results.pass, 'GS005-NO-INLINE-DYNAMIC-PARTIAL');

                expect(output.partials).toHaveLength(1);
                utils.assertContains(output.partials, 'recursive');

            });
        });

        it('lists used helpers', function () {
            return utils.testCheck(thisCheck, '005-compile/v4/unused-partials', options).then(function (output) {
                utils.assertValidThemeObject(output);

                expect(output.results.fail).toEqual({});

                const helperList = Object.keys(output.helpers);
                expect(helperList).toHaveLength(1);
                utils.assertContains(helperList, 'cancel_link');

            });
        });
    });
});