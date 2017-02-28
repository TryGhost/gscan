var debug = require('ghost-ignition').debug('ghost-version'),
    exec = require('child_process').exec,
    config = require('ghost-ignition').config(),
    fetchGhostVersion,
    middleware,
    ghostVersion,
    ttl;

fetchGhostVersion = function fetchGhostVersion() {
    debug('Ghost version not set or ttl expired');
    exec('npm show ghost version', function (err, stdout, stderr) {
        if (err) {
            debug('fetchGhostVersion err', err);
        }

        if (stderr) {
            debug('fetchGhostVersion stderr', stderr);
        }

        if (stdout) {
            debug('fetchGhostVersion stdout', stdout);
            ghostVersion = stdout;
            ttl = new Date(Date.now() + config.get('ghostVersionTTL')).valueOf();
        }
    });
};

middleware = function middleware(req, res, next) {
    if (!ghostVersion || ttl && ttl < Date.now()) {
        fetchGhostVersion();
    }

    debug('res.locals.ghostVersion: ' + ghostVersion);
    res.locals.ghostVersion = ghostVersion;
    next();
};

fetchGhostVersion();

module.exports = middleware;
