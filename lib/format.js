var _          = require('lodash'),
    format;

format = function format(theme) {
    theme.errors = _.where(theme.results, {type: 'error'});
    theme.features = _.where(theme.results, {type: 'feature'});
    theme.info = _.reject(theme.results, function (result) {
        return _.includes(['error', 'feature'], result.type);
    });

    return theme;
};


module.exports = format;
