#!/usr/bin/env node

// Remove all Node warnings before doing anything else
process.removeAllListeners('warning');

const prettyCLI = require('@tryghost/pretty-cli');
const ui = require('@tryghost/pretty-cli').ui;
const _ = require('lodash');
const chalk = require('chalk');
const gscan = require('../lib');
const ghostVersions = require('../lib/utils').versions;

const levels = {
    error: chalk.red,
    warning: chalk.yellow,
    recommendation: chalk.yellow,
    feature: chalk.green
};

function configureCLI(cli = prettyCLI) {
    return cli
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
        .boolean('-z, --zip', {
            desc: 'Theme path points to a zip file'
        })
        .boolean('-1, --v1', {
            desc: 'Check theme for Ghost 1.0 compatibility'
        })
        .boolean('-2, --v2', {
            desc: 'Check theme for Ghost 2.0 compatibility'
        })
        .boolean('-3, --v3', {
            desc: 'Check theme for Ghost 3.0 compatibility'
        })
        .boolean('-4, --v4', {
            desc: 'Check theme for Ghost 4.0 compatibility'
        })
        .boolean('-5, --v5', {
            desc: 'Check theme for Ghost 5.0 compatibility'
        })
        .boolean('-6, --v6', {
            desc: 'Check theme for Ghost 6.0 compatibility'
        })
        .boolean('-c, --canary', {
            desc: 'Check theme for Ghost 6.0 compatibility (alias for --v6)'
        })
        .boolean('-f, --fatal', {
            desc: 'Only show fatal errors that prevent upgrading Ghost'
        })
        .boolean('--verbose', {
            desc: 'Output check details'
        })
        .array('--labs', {
            desc: 'a list of labs flags'
        });
}

function buildCliOptions(argv) {
    const cliOptions = {
        format: 'cli',
        verbose: argv.verbose,
        onlyFatalErrors: argv.fatal
    };

    if (argv.v1) {
        cliOptions.checkVersion = 'v1';
    } else if (argv.v2) {
        cliOptions.checkVersion = 'v2';
    } else if (argv.v3) {
        cliOptions.checkVersion = 'v3';
    } else if (argv.v4) {
        cliOptions.checkVersion = 'v4';
    } else if (argv.v5) {
        cliOptions.checkVersion = 'v5';
    } else if (argv.v6) {
        cliOptions.checkVersion = 'v6';
    } else if (argv.canary) {
        cliOptions.checkVersion = ghostVersions.canary;
    } else {
        cliOptions.checkVersion = ghostVersions.default;
    }

    if (argv.labs) {
        cliOptions.labs = {};

        argv.labs.forEach((flag) => {
            cliOptions.labs[flag] = true;
        });
    }

    return cliOptions;
}

function handleCli(argv, deps = {}) {
    const chalkImpl = deps.chalk || chalk;
    const gscanImpl = deps.gscan || gscan;
    const outputResultsFn = deps.outputResults || outputResults;
    const uiImpl = deps.ui || ui;
    const cliOptions = buildCliOptions(argv);

    if (cliOptions.onlyFatalErrors) {
        uiImpl.log(chalkImpl.bold('\nChecking theme compatibility (fatal issues only)...'));
    } else {
        uiImpl.log(chalkImpl.bold('\nChecking theme compatibility...'));
    }

    if (argv.zip) {
        return gscanImpl.checkZip(argv.themePath, cliOptions)
            .then(theme => outputResultsFn(theme, cliOptions, deps))
            .catch((error) => {
                uiImpl.log(error);
            });
    }

    return gscanImpl.check(argv.themePath, cliOptions)
        .then(theme => outputResultsFn(theme, cliOptions, deps))
        .catch((err) => {
            uiImpl.log(err.message);
            if (err.code === 'ENOTDIR') {
                uiImpl.log('Did you mean to add the -z flag to read a zip file?');
            }
        });
}

function main(cli = prettyCLI, deps = {}) {
    return configureCLI(cli)
        .parseAndExit()
        .then(argv => handleCli(argv, deps));
}

function outputResult(result, options, deps = {}) {
    const chalkImpl = deps.chalk || chalk;
    const levelsImpl = deps.levels || levels;
    const lodashImpl = deps._ || _;
    const uiImpl = deps.ui || ui;

    uiImpl.log(levelsImpl[result.level](`- ${lodashImpl.capitalize(result.level)}:`), result.rule);

    if (options.verbose) {
        uiImpl.log(`${chalkImpl.bold('\nDetails:')} ${result.details}`);
    }

    if (result.failures && result.failures.length) {
        if (options.verbose) {
            uiImpl.log(''); // extra line-break
            uiImpl.log(`${chalkImpl.bold('Affected Files:')}`);
            result.failures.forEach((failure) => {
                let message = failure.ref;

                if (failure.message) {
                    message += ` - ${failure.message}`;
                }
                uiImpl.log(message);
            });
        } else {
            uiImpl.log(`${chalkImpl.bold('Affected Files:')} ${lodashImpl.uniq(lodashImpl.map(result.failures, 'ref')).join(', ')}`);
        }
    }

    uiImpl.log(''); // extra line-break
}

function formatCount(word, count) {
    return `${count} ${count === 1 ? word : `${word}s`}`;
}

function getSummary(theme, options, deps = {}) {
    const chalkImpl = deps.chalk || chalk;
    const lodashImpl = deps._ || _;
    let summaryText = '';
    const errorCount = theme.results.error.length;
    const warnCount = theme.results.warning.length;
    const checkSymbol = '\u2713';

    if (errorCount === 0 && warnCount === 0) {
        if (options.onlyFatalErrors) {
            summaryText = `${chalkImpl.green(checkSymbol)} Your theme has no fatal compatibility issues with Ghost ${theme.checkedVersion}`;
        } else {
            summaryText = `${chalkImpl.green(checkSymbol)} Your theme is compatible with Ghost ${theme.checkedVersion}`;
        }
    } else {
        summaryText = `Your theme has`;

        if (!lodashImpl.isEmpty(theme.results.error)) {
            summaryText += chalkImpl.red.bold(` ${formatCount('error', theme.results.error.length)}`);
        }

        if (!lodashImpl.isEmpty(theme.results.error) && !lodashImpl.isEmpty(theme.results.warning)) {
            summaryText += ' and';
        }

        if (!lodashImpl.isEmpty(theme.results.warning)) {
            summaryText += chalkImpl.yellow.bold(` ${formatCount('warning', theme.results.warning.length)}`);
        }

        summaryText += '!';

        // NOTE: had to subtract the number of 'invisible' formating symbols
        //       needs update if formatting above changes
        const hiddenSymbols = 38;
        summaryText += '\n' + lodashImpl.repeat('-', (summaryText.length - hiddenSymbols));
    }

    return summaryText;
}

function outputResults(theme, options, deps = {}) {
    const chalkImpl = deps.chalk || chalk;
    const gscanImpl = deps.gscan || gscan;
    const lodashImpl = deps._ || _;
    const outputResultFn = deps.outputResult || outputResult;
    const processImpl = deps.process || process;
    const uiImpl = deps.ui || ui;

    try {
        theme = gscanImpl.format(theme, options);
    } catch (err) {
        uiImpl.log.error('Error formatting result, some results may be missing.');
        uiImpl.log.error(err);
    }

    let errorCount = theme.results.error.length;

    uiImpl.log('\n' + getSummary(theme, options, deps));

    if (!lodashImpl.isEmpty(theme.results.error)) {
        uiImpl.log(chalkImpl.red.bold('\nErrors'));
        uiImpl.log(chalkImpl.red.bold('------'));
        uiImpl.log(chalkImpl.red('Important to fix, functionality may be degraded.\n'));

        lodashImpl.each(theme.results.error, rule => outputResultFn(rule, options, deps));
    }

    if (!lodashImpl.isEmpty(theme.results.warning)) {
        uiImpl.log(chalkImpl.yellow.bold('\nWarnings'));
        uiImpl.log(chalkImpl.yellow.bold('--------'));

        lodashImpl.each(theme.results.warning, rule => outputResultFn(rule, options, deps));
    }

    if (!lodashImpl.isEmpty(theme.results.recommendation)) {
        uiImpl.log(chalkImpl.yellow.bold('\nRecommendations'));
        uiImpl.log(chalkImpl.yellow.bold('---------------'));

        lodashImpl.each(theme.results.recommendation, rule => outputResultFn(rule, options, deps));
    }

    uiImpl.log(`\nGet more help at ${chalkImpl.cyan.underline('https://ghost.org/docs/themes/')}`);
    uiImpl.log(`You can also check theme compatibility at ${chalkImpl.cyan.underline('https://gscan.ghost.org/')}`);

    // The CLI feature is mainly used to run gscan programatically in tests within themes.
    // Exiting with error code for warnings, causes the test to fail, even tho a theme
    // upload via Ghost Admin would be possible without showing errors/warning.
    // See also here: https://github.com/TryGhost/Blog/pull/41#issuecomment-484525754
    // TODO: make failing for warnings configurable by e. g. passing an option, so we can
    // disable it for the usage with tests
    if (errorCount > 0) {
        processImpl.exit(1);
    } else {
        processImpl.exit(0);
    }
}

module.exports = {
    buildCliOptions,
    configureCLI,
    formatCount,
    getSummary,
    handleCli,
    main,
    outputResult,
    outputResults
};

if (require.main === module) {
    main();
}
