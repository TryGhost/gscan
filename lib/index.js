var _       = require('lodash'),
    pfs     = require('./promised-fs'),
    checker = require('./checker'),
    readZip = require('./read-zip'),

    middleware,
    checkZip;

checkZip = function checkZip(themePath) {
    var zip;

    if (_.isString(themePath)) {
        zip = {
            path: themePath,
            name: themePath.match(/(.*\/)?(.*).zip$/)[2]
        };
    } else {
        zip = themePath;
    }

    return readZip(zip).then(function thenCheckTheme(resultZip) {
        return checker(resultZip.path);
    }).then(function cleanup(theme) {
        return pfs.removeDir(zip.origPath).then(function returnResult() {
            return theme;
        });
    });
};

middleware = function middleware(req, res, next) {
    var zip = {
        path: req.file.path,
        name: req.file.originalname
    };

    checkZip(zip).then(function processResult(theme) {
        pfs.removeDir(req.file.path).then(function () {
            res.theme = theme;
            next();
        });
    });
};

module.exports = {
    check: checker,
    checkZip: checkZip,
    middleware: middleware
};
