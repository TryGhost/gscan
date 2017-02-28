var config = require('ghost-ignition').config();

// see defaults in GhostLogger
var logging = require('ghost-ignition').logging({
    path: config.get('logging:path'),
    domain: config.get('logging:domain'),
    mode: config.get('logging:mode'),
    level: config.get('logging:level'),
    transports: config.get('logging:transports')
});

module.exports = logging;