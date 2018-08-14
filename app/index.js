const express = require('express');
const debug = require('ghost-ignition').debug('app');
const hbs = require('express-hbs');
const multer = require('multer');
const server = require('ghost-ignition').server;
const errors = require('ghost-ignition').errors;
const gscan = require('../lib');
const pfs = require('../lib/promised-fs');
const logRequest = require('./middlewares/log-request');
const ghostVer = require('./ghost-version');
const pkgJson = require('../package.json');
const ghostVersions = require('../lib/utils').versions;
const upload = multer({dest: __dirname + '/uploads/'});
const app = express();
const scanHbs = hbs.create();

// Configure express
app.set('x-powered-by', false);
app.set('query parser', false);

app.engine('hbs', scanHbs.express4({
    partialsDir: __dirname + '/tpl/partials',
    layoutsDir: __dirname + '/tpl/layouts',
    defaultLayout: __dirname + '/tpl/layouts/default',
    templateOptions: {data: {version: pkgJson.version}}
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/tpl');

app.use(logRequest);
app.use(express.static(__dirname + '/public'));
app.use(ghostVer);

app.get('/', function (req, res) {
    res.render('index', {ghostVersions});
});

app.get('/example/', function (req, res) {
    pfs.readJSON('./test/fixtures/example-output.json').then(function (theme) {
        res.render('example', gscan.format(theme));
    });
});

app.post('/',
    upload.single('theme'),
    function (req, res, next) {
        const zip = {
            path: req.file.path,
            name: req.file.originalname
        };
        const options = {
            checkVersion: req.body.version || 'latest'
        };

        debug('Uploaded: ' + zip.name + ' to ' + zip.path);
        debug('Version to check: ' + options.checkVersion);

        gscan.checkZip(zip, options)
            .then(function processResult(theme) {
                debug('Checked: ' + zip.name);
                res.theme = theme;

                debug('attempting to remove: ' + req.file.path);
                pfs.removeDir(req.file.path)
                    .finally(function () {
                        debug('Calling next');
                        return next();
                    });
            }).catch(function (error) {
                debug('Calling next with error');
                return next(error);
            });
    },
    function doRender(req, res) {
        const options = {
            checkVersion: req.body.version || 'latest'
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
    req.err = err;
    res.render('error', {message: err.message, stack: err.stack, details: err.errorDetails, context: err.context});
});

server.start(app);
