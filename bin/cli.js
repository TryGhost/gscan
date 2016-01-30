#!/usr/bin/env node

var pkgJson = require('../package.json'),
    program = require('commander'),
    _       = require('lodash'),
    chalk   = require('chalk'),
    gscan   = require('../lib'),

    themePath = '',
    levels;

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

levels = {
    error: chalk.red,
    warning: chalk.yellow,
    recommendation: chalk.cyan,
    feature: chalk.green
};

function outputResult(result) {
    console.log('-', levels[result.level](result.level), result.ref, result.message);
}

function outputResults(theme) {
    console.log(chalk.bold.underline('\nResults:'));
    if (_.isEmpty(theme.results)) {
        console.log('No issues detected.');
    } else {
        // Call the formatter which separates out the results into logical groups
        theme = gscan.format(theme);

        if (!_.isEmpty(theme.errors)) {
            console.log(chalk.red.bold.underline('\nErrors:'));
            _.each(theme.errors, outputResult);
        }
        if (!_.isEmpty(theme.info)) {
            console.log(chalk.grey.bold.underline('\nInfo:'));
            _.each(theme.info, outputResult);
        }
        if (!_.isEmpty(theme.features)) {
            console.log(chalk.green.bold.underline('\nFeatures:'));
            _.each(theme.features, outputResult);
        }
    }
}

if (!program.args.length) {
    program.help();
} else {
    if (program.zip) {
        console.log('Checking zip file...');
        gscan.checkZip(themePath).then(outputResults);
    } else {
        console.log('Checking directory...');
        gscan.check(themePath).then(outputResults).catch(function ENOTDIRPredicate(err) {
            return err.code === 'ENOTDIR';
        }, function (err) {
            console.error(err.message);
            console.error('Did you mean to add the -z flag to read a zip file?')
        });
    }
}
