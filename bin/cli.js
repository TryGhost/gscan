#!/usr/bin/env node

var pkgJson = require('../package.json'),
    program = require('commander'),
    GTC     = require('../lib'),

    themePath = '';

program
    .version(pkgJson.version)
    .usage('[options] <themePath>')
    .arguments('cmd <themePath>')
    .option('-p, --pre', 'Run a pre-check only')
    .option('-z, --zip', 'Theme path points to a zip file')
    .action(function (theme) {
        themePath = theme;
    })
    .parse(process.argv);


if (!program.args.length) {
    program.help();
} else {
    if (program.zip) {
        GTC.checkZip(themePath).then(function (result) {
            console.log('checkZip', result);
        });
    } else {
        GTC.check(themePath).then(function (result) {
            console.log('check', result);
        });
    }
}


