var _       = require('lodash'),
    pfs     = require('./promised-fs'),
    checker = require('./checker'),
    format   = require('./format'),
    readZip = require('./read-zip'),
    middleware,
    checkZip;

checkZip = function checkZip(themePath, options) {
    options = options || {
        keepExtractedDir: false
    };

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
        return checker(resultZip.path);
    }).then(function cleanup(theme) {
        if (options.keepExtractedDir) {
            return theme;
        }

        return pfs.removeDir(zip.origPath).then(function returnResult() {
            return theme;
        });
    });
};

module.exports = {
    check: checker,
    checkZip: checkZip,
    format: format
};
