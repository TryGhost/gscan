const debug = require('@tryghost/debug')('ghost-spec');
const ghostVersions = require('../utils').versions;

module.exports = {
    get: function get(key) {
        let [version] = key;

        if (version === 'canary') {
            version = ghostVersions.canary;
        }

        debug('Checking against version:', version);

        return require(`./${[version]}`);
    }
};
