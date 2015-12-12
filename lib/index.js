var path    = require('path'),
    GTC     = require('./ghost-theme-checker'),
    readZip = require('./read-zip');

module.exports = function (req, res, next) {
    console.log(req.file.originalname);
    readZip({path: req.file.path, name: req.file.originalname}, function (filePath) {
        filePath = path.join(filePath);
        GTC.check(filePath).then(function (result) {
            res.path = filePath;
            res.result = result;
            next();
        });
    });
};