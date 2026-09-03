const path = require('path');
const assertPathWithinRoot = require('../lib/utils/assert-path-within-root');

describe('assertPathWithinRoot', function () {
    const root = path.resolve('/theme');

    it('does not throw for the root itself', function () {
        expect(() => assertPathWithinRoot(root, root, 'label')).not.toThrow();
    });

    it('does not throw for a normal child path', function () {
        expect(() => assertPathWithinRoot(root, path.join(root, 'index.hbs'), 'index.hbs')).not.toThrow();
        expect(() => assertPathWithinRoot(root, path.join(root, 'partials', 'foo.hbs'), 'partials/foo.hbs')).not.toThrow();
    });

    it('does not throw for a valid file/directory name that merely starts with two dots', function () {
        expect(() => assertPathWithinRoot(root, path.join(root, '..backup.hbs'), '..backup.hbs')).not.toThrow();
        expect(() => assertPathWithinRoot(root, path.join(root, '..hidden', 'file.hbs'), '..hidden/file.hbs')).not.toThrow();
    });

    it('throws for the parent directory', function () {
        expect(() => assertPathWithinRoot(root, path.dirname(root), '..')).toThrow(/outside of theme directory/);
    });

    it('throws for a path that escapes via ../ segments', function () {
        const target = path.resolve(root, '..', '..', 'etc', 'passwd');
        expect(() => assertPathWithinRoot(root, target, '../../etc/passwd')).toThrow(/outside of theme directory/);
    });

    it('throws for an unrelated absolute path', function () {
        expect(() => assertPathWithinRoot(root, path.resolve('/etc/passwd'), '/etc/passwd')).toThrow(/outside of theme directory/);
    });

    it('includes the given label in the thrown error', function () {
        const target = path.resolve(root, '..', 'evil.hbs');
        expect(() => assertPathWithinRoot(root, target, 'evil.hbs')).toThrow('Refusing to access path outside of theme directory: evil.hbs');
    });
});
