const debug = require('@tryghost/debug')('zip');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const {randomUUID} = require('crypto');
const {extract} = require('@tryghost/zip');
const errors = require('@tryghost/errors');
const _ = require('lodash');

const isKnownZipError = (err) => {
    return errors.utils.isGhostError(err);
};

const resolveBaseDir = async (zipPath) => {
    let matches = [];

    try {
        matches = await Array.fromAsync(fs.glob('**/index.hbs', {cwd: zipPath}));
    } catch (err) {
        debug('Glob match error while resolving zip base dir', err);
    }

    if (!_.isEmpty(matches)) {
        // CASE: fs.glob() makes no ordering guarantee (the old `glob` package
        // call used `nosort: true` here too, so this was already unordered) -
        // sort by path depth so the shallowest index.hbs wins deterministically
        // for a malformed zip with more than one match, rather than whichever
        // the filesystem happened to enumerate first.
        matches.sort((a, b) => {
            const depthDiff = a.split('/').length - b.split('/').length;
            return depthDiff !== 0 ? depthDiff : a.localeCompare(b);
        });

        debug('Found matches', matches);
        const matchedPath = matches[0].replace(/index\.hbs$/, '');
        zipPath = path.join(zipPath, matchedPath).replace(/\/$/, '');
    }

    return zipPath;
};

const readZip = (zip, options = {}) => {
    const tempUuid = randomUUID();
    const tempPath = os.tmpdir() + '/' + tempUuid;
    const extractOptions = {
        ensureOwnerPermissions: true
    };

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
module.exports._private = {resolveBaseDir};
