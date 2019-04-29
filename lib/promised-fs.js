var fs = require('fs-extra'),
    Promise = require('bluebird');

module.exports = fs;
module.exports.statFile = Promise.promisify(fs.stat);
module.exports.lstatFile = Promise.promisify(fs.lstat);
