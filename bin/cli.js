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
    recommendation: chalk.yellow,
    feature: chalk.green
};

function outputResult(result) {
    console.log('-', levels[result.level](result.level), result.rule);
}

function outputResults(theme) {
    theme = gscan.format(theme);

    console.log(chalk.bold.underline('\nRule Report:'));

    if (!_.isEmpty(theme.results.error)) {
        console.log(chalk.red.bold.underline('\n! Must fix:'));
        _.each(theme.results.error, outputResult);
    }

    if (!_.isEmpty(theme.results.warning)) {
        console.log(chalk.yellow.bold.underline('\n! Should fix:'));
        _.each(theme.results.warning, outputResult);
    }

    if (!_.isEmpty(theme.results.recommendation)) {
        console.log(chalk.red.yellow.underline('\n? Consider fixing:'));
        _.each(theme.results.recommendation, outputResult);
    }

    if (!_.isEmpty(theme.results.pass)) {
        console.log(chalk.green.bold.underline('\n\u2713', theme.results.pass.length, 'Passed Rules'));
    }

    console.log('\n...checks complete.');
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
