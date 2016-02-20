var nconf = require('nconf'),
    path  = require('path'),
    defaults = require('../config.example');

nconf.argv()
    .env()
    .file({ file: path.join(process.cwd(), 'config.json')});

nconf.defaults(defaults);

module.exports = nconf;