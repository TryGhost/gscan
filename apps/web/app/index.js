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
const gscan = require('../lib');
const fs = require('fs-extra');
const path = require('path');
const logRequest = require('./middlewares/log-request');
const uploadValidation = require('./middlewares/upload-validation');
const ghostVer = require('./ghost-version');
const ghostVersions = require('../lib/utils').versions;
const upload = multer({dest: __dirname + '/uploads/'});
const app = express();
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
    function (req, res, next) {
        const zip = {
            path: req.file.path,
            name: req.file.originalname
        };
        const options = {
            checkVersion: req.body.version || ghostVersions.default
        };

        debug('Uploaded: ' + zip.name + ' to ' + zip.path);
        debug('Version to check: ' + options.checkVersion);

        let checkError;

        gscan.checkZip(zip, options)
            .then(function processResult(theme) {
                debug('Checked: ' + zip.name);
                res.theme = theme;
            }).catch(function (error) {
                checkError = error;
            }).finally(function () {
                debug('attempting to remove: ' + req.file.path);
                fs.remove(req.file.path)
                    .catch(function (removeError) {
                        debug('failed to remove uploaded file', removeError);
                    })
                    .then(function () {
                        if (checkError) {
                            debug('Calling next with error');
                            return next(checkError);
                        }

                        debug('Calling next');
                        return next();
                    });
            });
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
