const path = require('path');

/**
 * Throws if `targetPath` resolves to somewhere outside of `rootPath` - i.e.
 * the relative path from root to target is exactly `..`, starts with a
 * `../` segment, or is itself absolute (a different root entirely, e.g. a
 * separate drive on Windows).
 *
 * Both `rootPath` and `targetPath` must already be resolved, absolute paths
 * (`path.resolve()`) - this only compares them, it doesn't resolve anything
 * itself.
 *
 * @param {string} rootPath - resolved absolute directory
 * @param {string} targetPath - resolved absolute path to check
 * @param {string} label - identifies the offending entry in the thrown error
 */
function assertPathWithinRoot(rootPath, targetPath, label) {
    const relative = path.relative(rootPath, targetPath);
    const escapesRoot = relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);

    if (escapesRoot) {
        throw new Error(`Refusing to access path outside of theme directory: ${label}`);
    }
}

module.exports = assertPathWithinRoot;
