var debug = require('ghost-ignition').debug('ghost-version'),
    exec = require('child_process').exec,
    config = require('ghost-ignition').config,
    fetchGhostVersion,
    middleware,
    ghostVersion,
    ttl;

fetchGhostVersion = function fetchGhostVersion(cb) {
    if (!ghostVersion || ttl && ttl < Date.now()) {
        debug('Ghost version not set or ttl expired');
        exec('npm show ghost version', function (err, stdout, stderr) {
            if (err) {
                debug('fetchGhostVersion err', err);
                cb(err, null);
            }

            if (stderr) {
                debug('fetchGhostVersion stderr', stderr);
                cb(stderr, null);
            }

            if (stdout) {
                debug('fetchGhostVersion stdout', stdout);
                ghostVersion = stdout;
                ttl = new Date(Date.now() + config.get('ghostVersionTTL')).valueOf();
                cb(null, ghostVersion);
            }
        });
    }

    debug('Returning cached version', ghostVersion);
    cb(null, ghostVersion);
};

middleware = function middleware(req, res, next) {
    fetchGhostVersion(function (err, version) {
        if (err) {
            // No need to prevent rendering
            next();
        }

        res.locals.ghostVersion = version;
        next();
    });
};

module.exports = middleware;
