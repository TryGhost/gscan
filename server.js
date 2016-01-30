var express    = require('express'),
    hbs        = require('express-hbs'),
    multer     = require('multer'),
    gscan      = require('./lib'),
    pfs        = require('./lib/promised-fs'),
    upload     = multer({ dest: 'uploads/' }),
    app        = express(),
    scanHbs    = hbs.create(),
    server;

app.engine('hbs', scanHbs.express4({
    partialsDir: __dirname + '/tpl/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/tpl');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/example/', function (req, res) {
    pfs.readJSON('./test/fixtures/example-output.json').then(function (theme) {
        res.render('example', gscan.format.example(theme));
    });
});

app.post('/', upload.single('theme'), gscan.middleware, function doRender(req, res) {
    scanHbs.handlebars.logger.level = 0;
    var renderObject = gscan.format(res.theme);
    res.render('result', renderObject);
});

server = app.listen(2369, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});