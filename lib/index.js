var path    = require('path'),
    GTC     = require('./ghost-theme-checker'),
    readZip = require('./read-zip');

module.exports = function (req, res, next) {
    readZip(req.file.path, function (filePath) {
        filePath = path.join(filePath);
        GTC.check(filePath).then(function (result) {
            res.path = filePath;
            res.result = result;
            next();
        });
    });
};