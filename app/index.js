var express = require('express'),
    debug = require('ghost-ignition').debug('app'),
    hbs = require('express-hbs'),
    multer = require('multer'),
    server = require('ghost-ignition').server,
    errors = require('ghost-ignition').errors,
    gscan = require('../lib'),
    pfs = require('../lib/promised-fs'),
    logRequest = require('./middlewares/log-request'),
    ghostVer = require('./ghost-version'),
    pkgJson = require('../package.json'),
    upload = multer({dest: __dirname + '/uploads/'}),
    app = express(),
    scanHbs = hbs.create();


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
    res.render('index');
});

app.get('/example/', function (req, res) {
    pfs.readJSON('./test/fixtures/example-output.json').then(function (theme) {
        res.render('example', gscan.format(theme));
    });
});

app.post('/', 
    upload.single('theme'), 
    function (req, res, next) {
        var zip = {
            path: req.file.path, 
            name: req.file.originalname
        };
        debug('Uploaded: ' + zip.name + ' to ' + zip.path);
        
        gscan.checkZip(zip).then(function processResult(theme) {
            debug('Checked: ' + zip.name);
            res.theme = theme;

            debug('attempting to remove: ' + req.file.path);
            pfs.removeDir(req.file.path)
                .finally(function () {
                    debug('Calling next');
                    return next();
                });
        });
    },
    function doRender(req, res) {
        debug('Formatting result');
        var result = gscan.format(res.theme);
        debug('Rendering result');
        scanHbs.handlebars.logger.level = 0;
        res.render('result', result);
    }
);

app.use(function (req, res, next) {
    next(new errors.NotFoundError({message: 'Page not found'}));
});

app.use(function (err, req, res, next) {
    req.err = err;
    res.render('error', {message: err.message, stack: err.stack});
});

server.start(app);