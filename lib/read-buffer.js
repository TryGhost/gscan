const {unzipSync, strFromU8} = require('fflate');
const {isContentFile} = require('./build-theme');

// Determine the extension the same way build-theme does, so we know which
// entries to decode to UTF-8 strings (only content-bearing files are needed).
const getExt = function getExt(file) {
    const extMatch = file.match(/.*?(\.[0-9a-z]+$)/i);
    return extMatch !== null ? extMatch[1] : undefined;
};

const shouldDecode = function shouldDecode(file) {
    return isContentFile({file, ext: getExt(file)});
};

/**
 * Finds the theme root inside a zip. Themes are commonly nested in a single
 * top-level folder; the directory containing the shallowest index.hbs is taken
 * as the theme root. Returns '' when there is no index.hbs (paths used as-is).
 *
 * Mirrors resolveBaseDir in read-zip.js, but operates on in-memory paths.
 *
 * @param {string[]} paths - forward-slash zip entry paths
 * @returns {string} prefix to strip (with trailing slash) or ''
 */
const resolveBasePrefix = function resolveBasePrefix(paths) {
    const indexFiles = paths.filter(p => /(^|\/)index\.hbs$/.test(p));

    if (!indexFiles.length) {
        return '';
    }

    indexFiles.sort((a, b) => a.split('/').length - b.split('/').length);

    return indexFiles[0].replace(/index\.hbs$/, '');
};

/**
 * Reads a theme from an in-memory zip buffer without touching the filesystem.
 * Returns a list of `{file, content?}` entries suitable for buildTheme, where
 * `content` is only attached to content-bearing files (.hbs, .css, .js,
 * package.json).
 *
 * @param {ArrayBuffer|Uint8Array} buffer
 * @returns {Array<{file: string, content?: string}>}
 */
module.exports = function readBuffer(buffer) {
    const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const entries = unzipSync(data);

    // Drop directory entries (zip directories end with a trailing slash)
    const allPaths = Object.keys(entries).filter(p => !p.endsWith('/'));
    const prefix = resolveBasePrefix(allPaths);

    const files = [];

    for (const fullPath of allPaths) {
        // Skip anything outside the resolved theme root
        if (prefix && !fullPath.startsWith(prefix)) {
            continue;
        }

        const file = prefix ? fullPath.slice(prefix.length) : fullPath;
        if (!file) {
            continue;
        }

        const entry = {file};

        if (shouldDecode(file)) {
            entry.content = strFromU8(entries[fullPath]);
        }

        files.push(entry);
    }

    return files;
};
