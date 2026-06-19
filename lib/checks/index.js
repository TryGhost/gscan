// Static manifest of all checks.
//
// Previously checks were discovered at runtime via fs.readdirSync + dynamic
// require in lib/checker.js. That approach cannot survive bundling for
// non-Node runtimes (e.g. Cloudflare Workers) and relies on the filesystem.
//
// Listing the checks explicitly here keeps the checker filesystem-free while
// preserving the original alphabetical execution order. When adding a new
// check, add it to this manifest.
module.exports = {
    '001-deprecations': require('./001-deprecations'),
    '002-comment-id': require('./002-comment-id'),
    '005-template-compile': require('./005-template-compile'),
    '010-package-json': require('./010-package-json'),
    '020-theme-structure': require('./020-theme-structure'),
    '030-assets': require('./030-assets'),
    '040-ghost-head-foot': require('./040-ghost-head-foot'),
    '050-koenig-css-classes': require('./050-koenig-css-classes'),
    '051-custom-fonts-css-properties': require('./051-custom-fonts-css-properties'),
    '060-js-api-usage': require('./060-js-api-usage'),
    '070-theme-translations': require('./070-theme-translations'),
    '080-helper-usage': require('./080-helper-usage'),
    '090-template-syntax': require('./090-template-syntax'),
    '100-custom-template-settings-usage': require('./100-custom-template-settings-usage'),
    '110-page-builder-usage': require('./110-page-builder-usage'),
    '120-no-unknown-globals': require('./120-no-unknown-globals'),
    '130-template-inheritance': require('./130-template-inheritance')
};
