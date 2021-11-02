/**
 * Extracts the package.json JSON content. Note that this function never throws,
 * even when there is a JSON parsing error.
 * @param {Object} theme The theme to extract package.json from.
 * @returns {Object} The content of the package.json file, or `null` if
 * something happened (no file, JSON parsing error...).
 */
function getJSON(theme) {
    let packageJSON = theme.files.find(item => item.file === 'package.json');
    if (packageJSON && packageJSON.content) {
        try {
            return JSON.parse(packageJSON.content);
        } catch (e) {
            // Do nothing here
        }
    }
    return null;
}

module.exports = getJSON;
