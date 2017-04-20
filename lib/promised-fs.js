var fs      = require('fs-extra'),
    Promise = require('bluebird');


module.exports = fs;
module.exports.readDir = Promise.promisify(fs.readdir);
module.exports.remove = Promise.promisify(fs.remove);
module.exports.removeDir = Promise.promisify(fs.remove);
module.exports.removeFile = Promise.promisify(fs.unlink);
module.exports.readFile = Promise.promisify(fs.readFile);
module.exports.readJSON = Promise.promisify(fs.readJSON);
module.exports.statFile = Promise.promisify(fs.stat);
module.exports.lstatFile = Promise.promisify(fs.lstat);
