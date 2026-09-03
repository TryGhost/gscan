const path = require('path');
const pathEscapesRoot = require('../lib/utils/path-escapes-root');

describe('pathEscapesRoot', function () {
    const root = path.resolve('/theme');

    it('returns false for the root itself', function () {
        expect(pathEscapesRoot(root, root)).toBe(false);
    });

    it('returns false for a normal child path', function () {
        expect(pathEscapesRoot(root, path.join(root, 'index.hbs'))).toBe(false);
        expect(pathEscapesRoot(root, path.join(root, 'partials', 'foo.hbs'))).toBe(false);
    });

    it('returns false for a valid file/directory name that merely starts with two dots', function () {
        expect(pathEscapesRoot(root, path.join(root, '..backup.hbs'))).toBe(false);
        expect(pathEscapesRoot(root, path.join(root, '..hidden', 'file.hbs'))).toBe(false);
    });

    it('returns true for the parent directory', function () {
        expect(pathEscapesRoot(root, path.dirname(root))).toBe(true);
    });

    it('returns true for a path that escapes via ../ segments', function () {
        expect(pathEscapesRoot(root, path.resolve(root, '..', '..', 'etc', 'passwd'))).toBe(true);
    });

    it('returns true for an unrelated absolute path', function () {
        expect(pathEscapesRoot(root, path.resolve('/etc/passwd'))).toBe(true);
    });
});
