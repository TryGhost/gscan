#!/usr/bin/env node

const pkgJson = require('../package.json');
const program = require('commander');
const _ = require('lodash');
const chalk = require('chalk');
const gscan = require('../lib');

const options = {};
let themePath = '';
let levels;

program
    .version(pkgJson.version)
    .usage('[options] <themePath>')
    .arguments('cmd <themePath>')
    .option('-p, --pre', 'Run a pre-check only')
    .option('-z, --zip', 'Theme path points to a zip file')
    .option('-1, --v1', 'Check theme for Ghost 1.0 compatibility, instead of 2.0')
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

/* eslint-disable no-console */
function outputResult(result) {
    console.log('-', levels[result.level](result.level), result.rule);

    if (result.failures && result.failures.length) {
        console.log(`    Files: ${_.map(result.failures, 'ref')}`);
    }
}

function outputResults(theme, options) {
    theme = gscan.format(theme, options);
    let errorCount = theme.results.error.length;
    let warnCount = theme.results.warning.length;

    console.log(chalk.bold.underline(`\nRule Report for v${theme.checkedVersion}:`));

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

    if (errorCount > 0 || warnCount > 0) {
        let errorString = 'Checks failed with ';
        // This is a failure case
        if (errorCount > 0 && warnCount > 0) {
            errorString += `${errorCount} errors and ${warnCount} warnings.`;
        } else if (errorCount > 0) {
            errorString += `${errorCount} errors.`;
        } else if (warnCount > 0) {
            errorString += `${warnCount} warnings.`;
        }

        console.error(errorString);
        process.exit(1);
    } else {
        console.log('\nChecks completed without errors.');
        process.exit(0);
    }
}

if (!program.args.length) {
    program.help();
} else {
    if (program.v1) {
        options.checkVersion = 'v1';
    } else {
        // CASE: set default value
        options.checkVersion = 'latest';
    }

    if (program.zip) {
        console.log('Checking zip file...');
        gscan.checkZip(themePath, options)
            .then(theme => outputResults(theme, options))
            .catch((error) => {
                console.error(error);
            });
    } else {
        console.log('Checking directory...');
        gscan.check(themePath, options)
            .then(theme => outputResults(theme, options))
            .catch(function ENOTDIRPredicate(err) {
                return err.code === 'ENOTDIR';
            }, function (err) {
                console.error(err.message);
                console.error('Did you mean to add the -z flag to read a zip file?');
            /* eslint-enable no-console */
            });
    }
}
