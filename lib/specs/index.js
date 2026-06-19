const debug = require('@tryghost/debug')('ghost-spec');

// Statically required so the specs can be bundled for non-Node runtimes
// (e.g. Cloudflare Workers). A dynamic require(`./${version}`) is not
// statically analysable by bundlers and fails at runtime.
const specs = {
    v1: require('./v1'),
    v2: require('./v2'),
    v3: require('./v3'),
    v4: require('./v4'),
    v5: require('./v5'),
    v6: require('./v6')
};

module.exports = {
    get: function get(key) {
        let [version] = key;

        debug('Checking against version:', version);

        return specs[version];
    }
};
