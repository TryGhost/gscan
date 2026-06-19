// Filesystem-free entry point for non-Node runtimes (e.g. Cloudflare Workers).
//
// Unlike the main entry (lib/index.js), this module never pulls in the on-disk
// readers (read-theme.js / read-zip.js) or their Node-only dependencies (fs,
// glob, @tryghost/zip), so it bundles cleanly for the browser/Workers.
//
// Use checkBuffer(zipArrayBuffer) or checkFiles([{file, content}]) to validate
// a theme entirely in memory, then format() to render the results.
const {checkFiles, checkBuffer} = require('./run-checks');
const format = require('./format');
const {versions} = require('./utils');

module.exports = {
    checkFiles,
    checkBuffer,
    format,
    versions
};
