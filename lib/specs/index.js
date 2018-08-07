module.exports = {
    get: function get(key) {
        return require(`./${key}`);
    }
};