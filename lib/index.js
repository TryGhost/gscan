const _ = require('lodash'),
    pfs = require('./promised-fs'),
    check = require('./checker'),
    format = require('./format'),
    readZip = require('./read-zip'),
    {errors} = require('ghost-ignition');

const checkZip = function checkZip(path, options) {
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

    return readZip(zip)
        .then(({path}) => check(path, options))
        .then((theme) => {
            if (options.keepExtractedDir) {
                return theme;
            } else {
                return pfs.removeDir(zip.origPath).then(() => theme);
            }
        })
        .catch(function ({message}) {
            throw new errors.ValidationError({
                message: 'Failed to read zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: message,
                context: zip.name
            });
        });
};

module.exports = {
    check,
    checkZip,
    format
};
