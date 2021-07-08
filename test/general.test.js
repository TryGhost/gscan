const path = require('path');
const fs = require('fs-extra');
const checkZip = require('../lib').checkZip;
const themePath = require('./utils').themePath;

const checker = require('../lib/checker');

process.env.NODE_ENV = 'testing';

describe('Check zip', function () {
    describe('ensure ignored assets are getting ignored', function () {
        it('default', function () {
            return checkZip(themePath('030-assets/ignored.zip'), {keepExtractedDir: true, checkVersion: 'v1'})
                .then((theme) => {
                    theme.files.length.should.eql(1);
                    theme.files[0].file.should.match(/default\.hbs/);

                    return fs.readdir(path.join(theme.path, 'ignored', 'assets'));
                })
                .then(function (assetFiles) {
                    assetFiles.should.eql(['default.hbs']);
                });
        });

        it('Don\'t remove files if theme not in tmp directory', function () {
            return checker(themePath('030-assets/ignored'), {checkVersion: 'v1'})
                .then((theme) => {
                    theme.files.length.should.eql(1);
                    theme.files[0].file.should.match(/default\.hbs/);

                    return fs.readdir(path.join(theme.path, 'assets'));
                })
                .then(function (assetFiles) {
                    assetFiles.should.eql(['Thumbs.db', 'default.hbs']);
                });
        });
    });

    describe('throws errors', function () {
        it('non existing file', async function () {
            try {
                await checkZip(themePath('030-assets/do_not_exist.zip'));
                should.fail(checkZip, 'Should have errored');
            } catch (err) {
                should.exist(err);

                should.exist(err.errorType);
                should.equal(err.errorType, 'ValidationError');

                should.exist(err.message);
                should.equal(err.message, 'Failed to read zip file');

                should.exist(err.help);
                should.equal(err.help, 'Your zip file might be corrupted, try unzipping and zipping again.');
            }
        });
    });
});

