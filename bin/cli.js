#!/usr/bin/env node
const prettyCLI = require('@tryghost/pretty-cli');
const ui = require('@tryghost/pretty-cli').ui;
const _ = require('lodash');
const chalk = require('chalk');
const gscan = require('../lib');

const options = {
    format: 'cli'
};

let levels;

prettyCLI
    .configure({
        name: 'gscan'
    })
    .groupOrder([
        'Sources:',
        'Utilities:',
        'Commands:',
        'Arguments:',
        'Required Options:',
        'Options:',
        'Global Options:'
    ])
    .positional('<themePath>', {
        paramsDesc: 'Theme folder or .zip file path',
        mustExist: true
    })
    .boolean('-p, --pre', {
        desc: 'Run a pre-check only'
    })
    .boolean('-z, --zip', {
        desc: 'Theme path points to a zip file'
    })
    .boolean('-1, --v1', {
        desc: 'Check theme for Ghost 1.0 compatibility, instead of 2.0'
    })
    .parseAndExit()
    .then((argv) => {
        if (argv.v1) {
            options.checkVersion = 'v1';
        } else {
            // CASE: set default value
            options.checkVersion = 'latest';
        }

        if (argv.zip) {
            ui.log('Checking zip file...');
            gscan.checkZip(argv.themePath, options)
                .then(theme => outputResults(theme, options))
                .catch((error) => {
                    ui.log(error);
                });
        } else {
            ui.log('Checking directory...');
            gscan.check(argv.themePath, options)
                .then(theme => outputResults(theme, options))
                .catch(function ENOTDIRPredicate(err) {
                    return err.code === 'ENOTDIR';
                }, function (err) {
                    ui.log(err.message);
                    ui.log('Did you mean to add the -z flag to read a zip file?');
                });
        }
    });

levels = {
    error: chalk.red,
    warning: chalk.yellow,
    recommendation: chalk.yellow,
    feature: chalk.green
};

function outputResult(result) {
    ui.log('-', levels[result.level](result.level), result.rule);

    if (result.failures && result.failures.length) {
        ui.log(`    Files: ${_.map(result.failures, 'ref')}`);
    }
}

function outputResults(theme, options) {
    theme = gscan.format(theme, options);
    let errorCount = theme.results.error.length;
    let warnCount = theme.results.warning.length;

    ui.log(chalk.bold.underline(`\nRule Report for v${theme.checkedVersion}:`));

    if (!_.isEmpty(theme.results.error)) {
        ui.log(chalk.red.bold.underline('\n! Must fix:'));
        _.each(theme.results.error, outputResult);
    }

    if (!_.isEmpty(theme.results.warning)) {
        ui.log(chalk.yellow.bold.underline('\n! Should fix:'));
        _.each(theme.results.warning, outputResult);
    }

    if (!_.isEmpty(theme.results.recommendation)) {
        ui.log(chalk.red.yellow.underline('\n? Consider fixing:'));
        _.each(theme.results.recommendation, outputResult);
    }

    if (!_.isEmpty(theme.results.pass)) {
        ui.log(chalk.green.bold.underline('\n\u2713', theme.results.pass.length, 'Passed Rules'));
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

        ui.log(errorString);
        process.exit(1);
    } else {
        ui.log('\nChecks completed without errors.');
        process.exit(0);
    }
}
