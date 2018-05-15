var _ = require('lodash'),
    pfs = require('./promised-fs'),
    checker = require('./checker'),
    format = require('./format'),
    readZip = require('./read-zip'),
    errors = require('ghost-ignition').errors,
    checkZip;

checkZip = function checkZip(themePath, options) {
    options = _.extend({
        keepExtractedDir: false
    }, options || {});

    var zip;

    if (_.isString(themePath)) {
        zip = {
            path: themePath,
            name: themePath.match(/(.*\/)?(.*).zip$/)[2]
        };
    } else {
        zip = _.clone(themePath);
    }

    return readZip(zip).then(function thenCheckTheme(resultZip) {
        return checker(resultZip.path, options);
    }).then(function cleanup(theme) {
        if (options.keepExtractedDir) {
            return theme;
        }

        return pfs.removeDir(zip.origPath).then(function returnResult() {
            return theme;
        });
    }).catch(function (error) {
        throw new errors.ValidationError({
            message: 'Failed to read zip file',
            help: 'Your zip file might be corrupted, try unzipping and zipping again.',
            errorDetails: error.message,
            context: zip.name
        });
    });
};

module.exports = {
    check: checker,
    checkZip: checkZip,
    format: format
};
