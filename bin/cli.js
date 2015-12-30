#!/usr/bin/env node

var pkgJson = require('../package.json'),
    program = require('commander'),
    _       = require('lodash'),
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

function outputResult(result) {
    console.log('\nResults:');
    if (_.isEmpty(result)) {
        console.log('No issues detected.');
    } else {
        console.log(result);
    }
}

if (!program.args.length) {
    program.help();
} else {
    if (program.zip) {
        console.log('Checking zip file...');
        GTC.checkZip(themePath).then(outputResult);
    } else {
        console.log('Checking directory...');
        GTC.check(themePath).then(outputResult).catch(function ENOTDIRPredicate(err) {
            return err.code === 'ENOTDIR';
        }, function (err) {
            console.error(err.message);
            console.error('Did you mean to add the -z flag to read a zip file?')
        });
    }
}


