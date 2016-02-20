var debug      = require('debug')('gscan:zip'),
    path       = require('path'),
    Promise    = require('bluebird'),
    extract    = require('extract-zip'),
    uuid       = require('node-uuid'),
    _          = require('lodash'),
    pfs        = require('./promised-fs'),

    readZip,
    resolveBaseDir;

resolveBaseDir = function readDir(zipPath, zip) {
    zip.path = zipPath;
    zip.origPath = zipPath;
    zip.origName = zip.name.replace(/\.zip$/, '');

    debug('Resolving base dir', zip.name);

    return pfs.readDir(zip.path).then(function (files) {
        var newZipPath;

        _.each(files, function (file) {
            if (file === zip.origName) {
                newZipPath = path.join(zipPath, file);
            }
        });

        if (newZipPath) {
            return pfs.statFile(newZipPath).then(function (fileStat) {
                zip.path = fileStat.isDirectory() ? newZipPath : zip.path;
                return zip;
            });
        }

        return zip;
    });
};

readZip = function readZip(zip) {
    var tempUuid = uuid.v4(),
        tempPath = (process.env.NODE_ENV === 'testing' ? './test/tmp/' : './tmp/') + tempUuid;

    debug('Reading Zip', zip.path, 'into', tempPath);
    return new Promise(function (resolve, reject) {
        extract(zip.path, {dir: tempPath}, function (err) {
            if (err) {
                debug('Zip extraction error', err);
                return reject(err);
            }

            resolveBaseDir(tempPath, zip).then(function resolveResult(result) {
                return resolve(result);
            });
        });
    });
};

module.exports = readZip;
