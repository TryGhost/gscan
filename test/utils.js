var path = require('path');

module.exports.themePath = function themePath(id) {
    return path.resolve(path.join('test/fixtures/themes/', id));
};