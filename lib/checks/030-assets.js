var _        = require('lodash'),
    Promise = require('bluebird'),
    checkAssets;

checkAssets = function checkAssets(theme) {
    var out = [],
        defaultHbs,
        assetMatch,
        assetRegex = /(src|href)=['"](.*?\/assets\/.*?)['"]/gmi;

    if (!theme.helpers || !theme.helpers.hasOwnProperty('asset')) {
        // There's no asset helper!
        defaultHbs = _.where(theme.files, {file: 'default.hbs'});

        out.push({
            type: 'warning',
            ref: 'asset',
            message: 'helper not present'
        });

        if (!_.isEmpty(defaultHbs)) {
            defaultHbs = defaultHbs[0];
            while ((assetMatch = assetRegex.exec(defaultHbs.content)) !== null) {
                out.push({
                    type: 'error',
                    ref: assetMatch[2],
                    message: 'asset should be served with the asset helper'
                });
            }
        }
    }

    return Promise.resolve(out);
};

module.exports = checkAssets;
