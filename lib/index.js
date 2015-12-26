var _       = require('lodash'),
    GTC     = require('./ghost-theme-checker'),
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
        return GTC.check(resultZip.path);
    }).then(function cleanup(result) {
        return readZip.clean(zip.origPath).then(function returnResult() {
            return result;
        });
    });
};

middleware = function middleware(req, res, next) {
    var zip = {
        path: req.file.path,
        name: req.file.originalname
    };

    checkZip(zip).then(function processResult(result) {
        res.result = result;
        next();
    });
};

module.exports = {
    check: GTC.check,
    checkZip: checkZip,
    middleware: middleware
};
