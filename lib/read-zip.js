var fs         = require('fs-extra'),
    path       = require('path'),
    Promise    = require('bluebird'),
    unzip      = require('unzip2'),
    uuid       = require('node-uuid'),
    _          = require('lodash'),

    readdir    = Promise.promisify(fs.readdir),
    stat       = Promise.promisify(fs.stat),
    removedir  = Promise.promisify(fs.remove),
    readZip,
    resolveBaseDir;

resolveBaseDir = function readDir(zipPath, zip) {
    zip.path = zipPath;
    zip.origPath = zipPath;
    zip.origName = zip.name.replace(/\.zip$/, '');

    return readdir(zip.path).then(function (files) {
        var newZipPath;
        _.each(files, function (file) {
            if (file === zip.origName) {
                newZipPath = path.join(zipPath, file);
            }
        });

        if (newZipPath) {
            return stat(newZipPath).then(function (fileStat) {
                if (fileStat.isDirectory()) {
                    zip.path = newZipPath;
                    return zip;
                }
                return zip;
            });
        }

        return zip;
    });
};

readZip = function readZip(zip) {
    var tempUuid = uuid.v4(),
        tempPath;

    tempPath = (process.env.NODE_ENV === 'testing' ? './test/tmp/' : './tmp/') + tempUuid;

    return new Promise(function (resolve, reject) {
        fs.createReadStream(zip.path)
            .pipe(unzip.Extract({path: tempPath}))
            .on('error', reject)
            .on('close', function () {
                resolveBaseDir(tempPath, zip).then(function resolveResult(result) {
                    resolve(result);
                });
            });
    });
};

cleanZip = function cleanZip(zip) {
    return removedir(zip)
};

module.exports = readZip;
module.exports.clean = cleanZip;
