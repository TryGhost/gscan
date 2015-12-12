var fs         = require('fs-extra'),
    path       = require('path'),
    Promise    = require('bluebird'),
    unzip      = require('unzip2'),
    uuid       = require('node-uuid'),
    _          = require('lodash'),

    readdir    = Promise.promisify(fs.readdir),
    stat       = Promise.promisify(fs.stat),
    readZip,
    resolveBaseDir;

resolveBaseDir = function readDir(zipPath, zipName) {
    var origZipPath = zipPath,
        origZipName = zipName.replace(/\.zip$/, '');

    return readdir(zipPath).then(function (files) {
        var newZipPath;
        _.each(files, function (file) {
            if (file === origZipName) {
                newZipPath = path.resolve(zipPath, file);
            }
        });

        if (newZipPath) {
            return stat(newZipPath).then(function (fileStat) {
                if (fileStat.isDirectory()) {
                    return newZipPath;
                }
                return origZipPath;
            });
        }

        return origZipPath;
    });
};

readZip = function readZip(zip, cb) {
    var tempUuid = uuid.v4(),
        tempPath;

    tempPath = (process.env.NODE_ENV === 'testing' ? './test/tmp/' : './tmp/') + tempUuid;

    fs.createReadStream(zip.path)
        .pipe(unzip.Extract({ path: tempPath }))
        .on('close', function () {
            resolveBaseDir(tempPath, zip.name).then(function (resultPath) {
                cb(resultPath);
            });
        });
};

module.exports = readZip;
