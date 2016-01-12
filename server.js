var express    = require('express'),
    hbs        = require('express-hbs'),
    multer     = require('multer'),
    gscan      = require('./lib'),
    upload     = multer({ dest: 'uploads/' }),
    app        = express(),
    scanHbs    = hbs.create(),
    server;

app.engine('hbs', scanHbs.express4());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/tpl');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
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