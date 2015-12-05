var express    = require('express'),
    hbs        = require('express-hbs'),
    multer     = require('multer'),
    themeCheck = require('./lib'),
    upload     = multer({ dest: 'uploads/' }),
    app        = express(),
    server;

app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/tpl');

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/', upload.single('theme'), themeCheck, function (req, res) {
    hbs.handlebars.logger.level = 0;
    console.log({results: res.result});
    res.render('result', {results: res.result});
});

server = app.listen(2369, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});