#!/usr/bin/env node

const prettyCLI = require('@tryghost/pretty-cli');
const ui = require('@tryghost/pretty-cli').ui;
const _ = require('lodash');
const {default: chalk} = require('chalk');
const gscan = require('../lib');
const ghostVersions = require('../lib/utils').versions;
const stripAnsi = require('strip-ansi');

/**
 * @typedef {object} CliArgv
 * @property {string} themePath
 * @property {boolean} [zip]
 * @property {boolean} [v1]
 * @property {boolean} [v2]
 * @property {boolean} [v3]
 * @property {boolean} [v4]
 * @property {boolean} [v5]
 * @property {boolean} [v6]
 * @property {boolean} [canary]
 * @property {boolean} [fatal]
 * @property {boolean} [verbose]
 * @property {string[]} [labs]
 */

/**
 * @typedef {object} CheckOptions
 * @property {'cli'} format
 * @property {string} [checkVersion]
 * @property {boolean} [verbose]
 * @property {boolean} [onlyFatalErrors]
 * @property {Record<string, true>} [labs]
 */

/**
 * @typedef {object} ResultFailure
 * @property {string} ref
 * @property {string} [message]
 */

/**
 * @typedef {object} FormattedResult
 * @property {'error' | 'warning' | 'recommendation' | 'feature'} level
 * @property {string} rule
 * @property {string} details
 * @property {ResultFailure[]} [failures]
 */

/**
 * @typedef {object} FormattedTheme
 * @property {string} checkedVersion
 * @property {{error: FormattedResult[], warning: FormattedResult[], recommendation: FormattedResult[]}} results
 */

const levels = {
    error: chalk.red,
    warning: chalk.yellow,
    recommendation: chalk.yellow,
    feature: chalk.green
};

/**
 * @param {CliArgv} argv
 * @returns {CheckOptions}
 */
function resolveOptions(argv) {
    /** @type {CheckOptions} */
    const options = {format: 'cli'};

    if (argv.canary) {
        options.checkVersion = ghostVersions.canary;
    } else {
        const versionKey = Object.keys(ghostVersions).find(k => k.startsWith('v') && argv[k]);
        options.checkVersion = versionKey || ghostVersions.default;
    }

    options.verbose = argv.verbose;
    options.onlyFatalErrors = argv.fatal;

    if (argv.labs) {
        options.labs = {};

        argv.labs.forEach((flag) => {
            options.labs[flag] = true;
        });
    }

    return options;
}

/**
 * @param {CliArgv} argv
 * @param {CheckOptions} options
 * @returns {Promise<void>}
 */
async function runCheck(argv, options) {
    if (options.onlyFatalErrors) {
        ui.log(chalk.bold('\nChecking theme compatibility (fatal issues only)...'));
    } else {
        ui.log(chalk.bold('\nChecking theme compatibility...'));
    }

    try {
        const theme = argv.zip
            ? await gscan.checkZip(argv.themePath, options)
            : await gscan.check(argv.themePath, options);
        outputResults(theme, options);
    } catch (err) {
        if (argv.zip) {
            ui.log(err);
        } else {
            ui.log(err.message);
            if (err.code === 'ENOTDIR') {
                ui.log('Did you mean to add the -z flag to read a zip file?');
            }
        }
    }
}

/**
 * @param {FormattedResult} result
 * @param {CheckOptions} options
 */
function outputResult(result, options) {
    ui.log(levels[result.level](`- ${_.capitalize(result.level)}:`), result.rule);

    if (options.verbose) {
        ui.log(`${chalk.bold('\nDetails:')} ${result.details}`);
    }

    if (result.failures && result.failures.length) {
        if (options.verbose) {
            ui.log(''); // extra line-break
            ui.log(`${chalk.bold('Affected Files:')}`);
            result.failures.forEach((failure) => {
                let message = failure.ref;

                if (failure.message) {
                    message += ` - ${failure.message}`;
                }
                ui.log(message);
            });
        } else {
            ui.log(`${chalk.bold('Affected Files:')} ${_.uniq(_.map(result.failures, 'ref')).join(', ')}`);
        }
    }

    ui.log(''); // extra line-break
}

/**
 * @param {string} word
 * @param {number} count
 * @returns {string}
 */
function formatCount(word, count) {
    return `${count} ${count === 1 ? word : `${word}s`}`;
}

/**
 * @param {FormattedTheme} theme
 * @param {CheckOptions} options
 * @returns {string}
 */
function getSummary(theme, options) {
    let summaryText = '';
    const errorCount = theme.results.error.length;
    const warnCount = theme.results.warning.length;
    const checkSymbol = '\u2713';

    if (errorCount === 0 && warnCount === 0) {
        if (options.onlyFatalErrors) {
            summaryText = `${chalk.green(checkSymbol)} Your theme has no fatal compatibility issues with Ghost ${theme.checkedVersion}`;
        } else {
            summaryText = `${chalk.green(checkSymbol)} Your theme is compatible with Ghost ${theme.checkedVersion}`;
        }
    } else {
        summaryText = `Your theme has`;

        if (!_.isEmpty(theme.results.error)) {
            summaryText += chalk.red.bold(` ${formatCount('error', theme.results.error.length)}`);
        }

        if (!_.isEmpty(theme.results.error) && !_.isEmpty(theme.results.warning)) {
            summaryText += ' and';
        }

        if (!_.isEmpty(theme.results.warning)) {
            summaryText += chalk.yellow.bold(` ${formatCount('warning', theme.results.warning.length)}`);
        }

        summaryText += `!\n${'-'.repeat(stripAnsi(summaryText).length + 1)}`;
    }

    return summaryText;
}

/**
 * @param {*} theme - Raw theme object; mutated into FormattedTheme by gscan.format()
 * @param {CheckOptions} options
 */
function outputResults(theme, options) {
    try {
        /** @type {FormattedTheme} */
        theme = gscan.format(theme, options);
    } catch (err) {
        ui.log.error('Error formating result, some results may be missing.');
        ui.log.error(err);
    }

    const errorCount = theme.results.error.length;

    ui.log('\n' + getSummary(theme, options));

    if (!_.isEmpty(theme.results.error)) {
        ui.log(chalk.red.bold('\nErrors'));
        ui.log(chalk.red.bold('------'));
        ui.log(chalk.red('Important to fix, functionality may be degraded.\n'));

        _.each(theme.results.error, rule => outputResult(rule, options));
    }

    if (!_.isEmpty(theme.results.warning)) {
        ui.log(chalk.yellow.bold('\nWarnings'));
        ui.log(chalk.yellow.bold('--------'));

        _.each(theme.results.warning, rule => outputResult(rule, options));
    }

    if (!_.isEmpty(theme.results.recommendation)) {
        ui.log(chalk.yellow.bold('\nRecommendations'));
        ui.log(chalk.yellow.bold('---------------'));

        _.each(theme.results.recommendation, rule => outputResult(rule, options));
    }

    ui.log(`\nGet more help at ${chalk.cyan.underline('https://docs.ghost.org/themes/')}`);
    ui.log(`You can also check theme compatibility at ${chalk.cyan.underline('https://gscan.ghost.org/')}`);

    // The CLI feature is mainly used to run gscan programatically in tests within themes.
    // Exiting with error code for warnings, causes the test to fail, even tho a theme
    // upload via Ghost Admin would be possible without showing errors/warning.
    // See also here: https://github.com/TryGhost/Blog/pull/41#issuecomment-484525754
    // TODO: make failing for warnings configurable by e. g. passing an option, so we can
    // disable it for the usage with tests
    if (errorCount > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

function main() {
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
        })
        .parseAndExit()
        .then((argv) => {
            const options = resolveOptions(argv);
            runCheck(argv, options);
        });
}

module.exports = {formatCount, getSummary, outputResult, outputResults, resolveOptions, runCheck};

if (require.main === module) {
    // Remove all Node warnings only when run as a CLI, not when imported as a module
    process.removeAllListeners('warning');
    main();
}
