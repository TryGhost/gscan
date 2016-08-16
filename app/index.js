var express = require('express'),
    hbs = require('express-hbs'),
    multer = require('multer'),
    ignition = require('ghost-ignition'),
    gscan = require('./../lib'),
    pfs = require('./../lib/promised-fs'),
    ghostVer = require('./ghost-version'),
    pkgJson = require('./../package.json'),
    upload = multer({dest: __dirname + '/uploads/'}),
    app = express(),
    scanHbs = hbs.create();


// Configure express
app.set('x-powered-by', false);
app.set('query parser', false);

app.engine('hbs', scanHbs.express4({
    partialsDir: __dirname + '/tpl/partials',
    templateOptions: {data: {version: pkgJson.version}}
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/tpl');

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
        
        gscan.checkZip(zip).then(function processResult(theme) {
            pfs.removeDir(req.file.path).then(function () {
                res.theme = theme;
                next();
            });
        });
    },
    function doRender(req, res) {
        scanHbs.handlebars.logger.level = 0;
        res.render('result', gscan.format(res.theme));
    }
);

ignition.server.start(app);