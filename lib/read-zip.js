const debug = require('@tryghost/debug')('zip');
const path = require('path');
const os = require('os');
const {randomUUID} = require('crypto');
const {glob} = require('glob');
const {extract} = require('@tryghost/zip');
const errors = require('@tryghost/errors');
const _ = require('lodash');

const isKnownZipError = (err) => {
    return errors.utils.isGhostError(err);
};

const resolveBaseDir = async (zipPath) => {
    let matches = [];

    try {
        matches = await glob('**/index.hbs', {cwd: zipPath, nosort: true});
    } catch (err) {
        debug('Glob match error while resolving zip base dir', err);
    }

    if (!_.isEmpty(matches)) {
        debug('Found matches', matches);
        const matchedPath = matches[0].replace(/index\.hbs$/, '');
        zipPath = path.join(zipPath, matchedPath).replace(/\/$/, '');
    }

    return zipPath;
};

const readZip = (zip, options = {}) => {
    const tempUuid = randomUUID();
    const tempPath = os.tmpdir() + '/' + tempUuid;
    const extractOptions = {};

    if (options.limits) {
        extractOptions.limits = options.limits;
    }

    debug('Reading Zip', zip.path, 'into', tempPath);
    return extract(zip.path, tempPath, extractOptions)
        .then(async () => {
            let resolvedPath = await resolveBaseDir(tempPath);
            zip.origPath = tempPath;
            zip.origName = zip.name.replace(/\.zip$/, '');
            zip.path = resolvedPath;

            return zip;
        }).catch((err) => {
            debug('Zip extraction error', err);

            if (isKnownZipError(err)) {
                throw err;
            }

            throw new errors.ValidationError({
                message: 'Failed to read zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: err.message,
                context: zip.name,
                err: err
            });
        });
};

module.exports = readZip;
