#!/usr/bin/env node

var pkgJson = require('../package.json'),
    program = require('commander'),
    _ = require('lodash'),
    chalk = require('chalk'),
    gscan = require('../lib'),

    themePath = '',
    levels;

program
    .version(pkgJson.version)
    .description(pkgJson.description + '. Returns 0 on success, 1 on errors and 2 on warnings.')
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

/* eslint-disable no-console */
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

function setExitCode(theme) {
  process.exitCode = 0;

  if (!_.isEmpty(theme.results.warning)) {
      process.exitCode = 2;
  }

  if (!_.isEmpty(theme.results.error)) {
      process.exitCode = 1;
  }

  return theme;
}

function handleRejection(error) {
  process.exitCode = 1;
  console.error(chalk.red(error.toString()));

  if('ENOTDIR' === error.code) {
    console.error('Did you mean to add the -z flag to read a zip file?');
  }
}

if (!program.args.length) {
    program.help();
} else {
    if (program.zip) {
        console.log('Checking zip file...');
        gscan.checkZip(themePath)
          .then(setExitCode)
          .then(outputResults)
          .catch(handleRejection);
    } else {
        console.log('Checking directory...');
        gscan.check(themePath)
          .then(setExitCode)
          .then(outputResults)
          .catch(handleRejection);
    }
}

module.exports = {
  setExitCode: setExitCode
};
