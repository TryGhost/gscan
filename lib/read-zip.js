var fs         = require('fs-extra'),
    path       = require('path'),
    Promise    = require('bluebird'),
    unzip      = require('unzip'),
    uuid       = require('node-uuid'),

    readdir    = Promise.promisify(fs.readdir),
    stat       = Promise.promisify(fs.stat),
    readZip,
    resolveBaseDir;



resolveBaseDir = function readDir(zipPath) {
    var origZipPath = zipPath;
    return readdir(zipPath).then(function (files) {
        if (files.length !== 1) {
            return origZipPath;
        }

        zipPath = path.resolve(zipPath, files[0]);

        return stat(zipPath).then(function (fileStat) {
            if (fileStat.isDirectory()) {
                return zipPath;
            }
            return origZipPath;
        });
    });
};

readZip = function readZip(zipPath, cb) {
    var tempUuid = uuid.v4(),
        tempPath;

    tempPath = (process.env.NODE_ENV === 'testing' ? './test/tmp/' : './tmp/') + tempUuid;

    fs.createReadStream(zipPath)
        .pipe(unzip.Extract({ path: tempPath }))
        .on('close', function () {
            resolveBaseDir(tempPath).then(function (resultPath) {
                cb(resultPath);
            });
        });
};

module.exports = readZip;
