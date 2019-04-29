var fs = require('fs-extra'),
    Promise = require('bluebird');

module.exports = fs;
module.exports.readJSON = Promise.promisify(fs.readJSON);
module.exports.statFile = Promise.promisify(fs.stat);
module.exports.lstatFile = Promise.promisify(fs.lstat);
