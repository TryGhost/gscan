const path = require('path');

/**
 * True if `targetPath` resolves to somewhere outside of `rootPath` - i.e.
 * the relative path from root to target is exactly `..`, starts with a
 * `../` segment, or is itself absolute (a different root entirely, e.g. a
 * separate drive on Windows).
 *
 * Both arguments must already be resolved, absolute paths (`path.resolve()`)
 * - this only compares them, it doesn't resolve anything itself.
 *
 * @param {string} rootPath - resolved absolute directory
 * @param {string} targetPath - resolved absolute path to check
 * @returns {boolean}
 */
function pathEscapesRoot(rootPath, targetPath) {
    const relative = path.relative(rootPath, targetPath);
    return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
}

module.exports = pathEscapesRoot;
