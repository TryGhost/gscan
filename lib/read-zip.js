var debug = require('ghost-ignition').debug('zip'),
    path = require('path'),
    Promise = require('bluebird'),
    os = require('os'),
    glob = require('glob'),
    extract = require('@tryghost/extract-zip'),
    uuid = require('uuid'),
    _ = require('lodash'),
    readZip,
    resolveBaseDir;

resolveBaseDir = function resolveBaseDir(zipPath, cb) {
    glob('**/index.hbs', {cwd: zipPath}, function (err, matches) {
        var matchedPath;

        if (!err && !_.isEmpty(matches)) {
            debug('Found matches', matches);
            matchedPath = matches[0].replace(/index.hbs$/, '');
            zipPath = path.join(zipPath, matchedPath).replace(/\/$/, '');
        }

        return cb(zipPath);
    });
};

readZip = function readZip(zip) {
    var tempUuid = uuid.v4(),
        tempPath = os.tmpdir() + '/' + tempUuid;

    debug('Reading Zip', zip.path, 'into', tempPath);
    return new Promise(function (resolve, reject) {
        extract(zip.path, {dir: tempPath}, function (err) {
            if (err) {
                debug('Zip extraction error', err);
                return reject(err);
            }

            return resolveBaseDir(tempPath, function (resolvedPath) {
                zip.origPath = tempPath;
                zip.origName = zip.name.replace(/\.zip$/, '');
                zip.path = resolvedPath;

                return resolve(zip);
            });
        });
    });
};

module.exports = readZip;
