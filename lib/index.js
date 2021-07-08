const _ = require('lodash');
const fs = require('fs-extra');
const check = require('./checker');
const format = require('./format');
const readZip = require('./read-zip');
const {errors} = require('ghost-ignition');

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
        const theme = await check(extractedZipPath, options);

        if (options.keepExtractedDir) {
            return theme;
        } else {
            return fs.remove(zip.origPath).then(() => theme);
        }
    } catch (error) {
        throw new errors.ValidationError({
            message: 'Failed to read zip file',
            help: 'Your zip file might be corrupted, try unzipping and zipping again.',
            errorDetails: error.message,
            context: zip.name
        });
    }
};

module.exports = {
    check,
    checkZip,
    format
};
