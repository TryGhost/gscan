const debug = require('ghost-ignition').debug('ghost-spec');

module.exports = {
    get: function get(key) {
        let [version] = key;

        if (version === 'latest') {
            version = 'v2';
        } else if (version === 'v3') {
            version = 'canary';
        }

        debug('Checking against version: ', version);

        return require(`./${[version]}`);
    }
};
