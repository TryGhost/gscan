/*globals describe, it */
var should  = require('should'),
    fs = require('fs-extra'),
    themePath = require('./utils').themePath,
    readZip   = require('../lib/read-zip');

process.env.NODE_ENV = 'testing';

/**
 * Response object from .check is:
 * {
 *   errors: [], // anything that will cause the theme to break
 *   warnings: [], // anything that is deprecated and will cause the theme to break in future
 *   recommendations: [] // enhancements
 * }
 */

describe('Zip file handler can read a zip file', function () {
    after(function (done) {
        fs.remove('./test/tmp', function (err) {
            done(err);
        });
    });

    it('should unzip and callback with a path', function (done) {
        readZip({path: themePath('example.zip'), name: 'example.zip'}).then(function (path) {
            path.should.be.a.String();
            path.should.match(/example$/);
            done();
        });
    });
});