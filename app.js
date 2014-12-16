var express = require('express'),
    path    = require('path'),
    GTC     = require('./lib/ghost-theme-checker'),
    readZip = require('./lib/read-zip'),
    multer  = require('multer'),
    upload = multer({ dest: 'uploads/' }),
    app = express(),
    server;

app.use('/', express.static(__dirname + '/public'));

app.post('/', upload.single('theme'), function (req, res, next) {
    readZip(req.file.path, function (filePath) {
        filePath = path.join(filePath);
        res.status(200).json({
            path: path.resolve(filePath),
            result: GTC.check(filePath)
        });
    });
});

server = app.listen(2369, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});