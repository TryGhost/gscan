var _ = require('lodash'),
    pfs = require('./promised-fs'),
    checker = require('./checker'),
    format = require('./format'),
    readZip = require('./read-zip'),
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
    });
};

module.exports = {
    check: checker,
    checkZip: checkZip,
    format: format
};
