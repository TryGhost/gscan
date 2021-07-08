const _ = require('lodash');
const fs = require('fs-extra');
const check = require('./checker');
const format = require('./format');
const readZip = require('./read-zip');
const {errors} = require('ghost-ignition');

/**
 *
 * @param {string} path zip file path or a folder path containing a theme
 * @param {Object} options
 * @param {boolean} options.keepExtractedDir flag controling if the directory with extracted zip should stay after the check is complete
 * @param {string} options.checkVersion version to check the theme against
 * @returns {Promise<any>}
 */
const checkZip = async function checkZip(path, options) {
    options = Object.assign({}, {
        keepExtractedDir: false
    }, options);

    let zip;

    if (_.isString(path)) {
        zip = {
            path,
            name: path.match(/(.*\/)?(.*).zip$/)[2]
        };
    } else {
        zip = _.clone(path);
    }

    try {
        const {path: extractedZipPath} = await readZip(zip);
        const theme = await check(extractedZipPath, Object.assign({themeName: zip.name}, options));

        if (options.keepExtractedDir) {
            return theme;
        } else {
            await fs.remove(zip.origPath);
            return theme;
        }
    } catch (error) {
        if (!errors.utils.isIgnitionError(error)) {
            throw new errors.ValidationError({
                message: 'Failed to check zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: error.message,
                context: zip.name,
                err: error
            });
        }

        throw error;
    }
};

module.exports = {
    check,
    checkZip,
    format
};
