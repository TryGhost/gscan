const should = require('should'); // eslint-disable-line no-unused-vars

const fakeData = require('../lib/faker');

describe('faker', function () {
    it('returns post context for post and page templates', function () {
        fakeData({
            file: 'post.hbs'
        }).should.have.property('post');

        fakeData({
            file: 'page-about.hbs'
        }).should.have.property('post');
    });

    it('returns tag and author contexts for archive templates', function () {
        fakeData({
            file: 'tag.hbs'
        }).should.have.property('tag');

        fakeData({
            file: 'author.hbs'
        }).should.have.property('author');
    });

    it('returns posts pagination data by default', function () {
        const data = fakeData({
            file: 'index.hbs'
        });

        data.should.have.property('posts');
        data.should.have.property('pagination');
        data.posts.should.have.length(1);
        data.posts[0].should.have.property('author');
        data.posts[0].should.have.property('tags');
    });
});
