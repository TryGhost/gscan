var _       = require('lodash'),
    Promise = require('bluebird'),
    spec    = require('../../spec.js'),
    checkAssets;

checkAssets = function checkAssets(theme) {
    var out = [],
        assetMatch,
        defaultHbs = _.where(theme.files, {file: 'default.hbs'}),
        assetRegex = /(src|href)=['"](.*?\/assets\/.*?)['"]/gmi;

    if (!_.isEmpty(defaultHbs)) {
        defaultHbs = defaultHbs[0];
        while ((assetMatch = assetRegex.exec(defaultHbs.content)) !== null) {
            out.push(_.extend({}, spec.rules['asset-required'], {
                ref: assetMatch[2],
                message: 'asset should be served with the asset helper'
            }));
        }
    }

    return Promise.resolve(out);
};

module.exports = checkAssets;
