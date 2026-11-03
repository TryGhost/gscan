// Init Sentry middleware
require('./middlewares/sentry');
const sentry = require('@sentry/node');

// Require rest of the modules
const express = require('express');
const debug = require('@tryghost/debug')('app');
const {create} = require('express-handlebars');
const multer = require('multer');
const server = require('@tryghost/server');
const config = require('@tryghost/config');
const errors = require('@tryghost/errors');
const gscan = require('gscan');
const fs = require('fs/promises');
const path = require('path');
const logRequest = require('./middlewares/log-request');
const uploadValidation = require('./middlewares/upload-validation');
const ghostVer = require('./ghost-version');
const ghostVersions = require('gscan/lib/utils').versions;
const uploadDir = path.resolve(__dirname, 'uploads');
const upload = multer({dest: uploadDir});
const app = express();

// multer generates the stored filename itself, but only ever touch the
// filesystem with a path we've confirmed sits inside uploadDir - never pass
// req.file.path straight through. Returns null for anything else.
function resolveUploadPath(file) {
    if (!file || !file.path) {
        return null;
    }

    const uploadPath = path.resolve(file.path);
    if (!uploadPath.startsWith(uploadDir + path.sep)) {
        return null;
    }

    return uploadPath;
}

// Best-effort removal of a multer temp file
async function removeUpload(file) {
    const uploadPath = resolveUploadPath(file);
    if (!uploadPath) {
        return;
    }

    debug('attempting to remove: ' + uploadPath);
    try {
        await fs.rm(uploadPath, {recursive: true, force: true});
    } catch (removeError) {
        debug('failed to remove uploaded file', removeError);
    }
}

const viewsDir = path.join(__dirname, 'tpl');
const scanHbs = create({
    extname: '.hbs',
    partialsDir: path.join(viewsDir, 'partials'),
    layoutsDir: path.join(viewsDir, 'layouts'),
    defaultLayout: 'default',
    helpers: {
        block(name, options) {
            const root = options.data && options.data.root;

            if (!root) {
                return typeof options.fn === 'function' ? options.fn(this) : '';
            }

            const blockCache = root.blockCache || {};
            let val = blockCache[name];

            if (val === undefined && typeof options.fn === 'function') {
                val = options.fn(this);
            }

            if (Array.isArray(val)) {
                val = val.join('\n');
            }

            return val;
        },
        contentFor(name, options) {
            const root = options.data && options.data.root;

            if (!root) {
                return '';
            }

            const blockCache = root.blockCache || (root.blockCache = {});
            const block = blockCache[name] || (blockCache[name] = []);
            block.push(options.fn(this));
            return '';
        }
    }
});

// Configure express
app.set('x-powered-by', false);
app.set('query parser', false);

app.engine('hbs', scanHbs.engine);

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(logRequest);
app.use(express.static(__dirname + '/public'));
app.use(ghostVer);

app.get('/', function (req, res) {
    res.render('index', {ghostVersions});
});

app.post('/',
    upload.single('theme'),
    uploadValidation,
    async function (req, res, next) {
        const uploadPath = resolveUploadPath(req.file);
        if (!uploadPath) {
            return next(new errors.BadRequestError({
                message: 'Invalid upload path.'
            }));
        }

        const zip = {
            path: uploadPath,
            name: req.file.originalname
        };
        const options = {
            checkVersion: req.body.version || ghostVersions.default
        };

        debug('Uploaded: ' + zip.name + ' to ' + zip.path);
        debug('Version to check: ' + options.checkVersion);

        try {
            res.theme = await gscan.checkZip(zip, options);
            debug('Checked: ' + zip.name);
        } finally {
            await removeUpload(req.file);
        }

        debug('Calling next');
        next();
    },
    function doRender(req, res) {
        const options = {
            checkVersion: req.body.version || ghostVersions.default
        };
        debug('Formatting result');
        const result = gscan.format(res.theme, options);
        debug('Rendering result');
        scanHbs.handlebars.logger.level = 0;
        res.render('result', result);
    },
    // CASE: uploadValidation (or anything after multer) rejected the request,
    // so the success path above never removed the temp file
    async function cleanupUpload(err, req, res, next) {
        await removeUpload(req.file);
        next(err);
    }
);

app.use(function (req, res, next) {
    next(new errors.NotFoundError({message: 'Page not found'}));
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    let template = 'error';
    req.err = err;

    let statusCode = err.statusCode || 500;
    res.status(statusCode);

    if (res.statusCode === 404) {
        template = 'error-404';
    }

    res.render(template, {message: err.message, stack: err.stack, details: err.errorDetails, context: err.context});
});

sentry.setupExpressErrorHandler(app);

server.start(app, config.get('port'));
