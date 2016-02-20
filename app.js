var express    = require('express'),
    hbs        = require('express-hbs'),
    multer     = require('multer'),
    gscan      = require('./lib'),
    pfs        = require('./lib/promised-fs'),
    server     = require('./lib/server'),
    pkgJson    = require('./package.json'),

    upload     = multer({ dest: 'uploads/' }),
    app        = express(),
    scanHbs    = hbs.create();

// Configure express
app.set('x-powered-by', false);
app.set('query parser', false);

app.engine('hbs', scanHbs.express4({
    partialsDir: __dirname + '/tpl/partials',
    templateOptions: {data: {version: pkgJson.version}}
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/tpl');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/example/', function (req, res) {
    pfs.readJSON('./test/fixtures/example-output.json').then(function (theme) {
        res.render('example', gscan.format(theme));
    });
});

app.post('/', upload.single('theme'), gscan.middleware, function doRender(req, res) {
    scanHbs.handlebars.logger.level = 0;
    res.render('result', gscan.format(res.theme));
});

server.start(app);