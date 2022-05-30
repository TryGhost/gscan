// @ts-check
/* eslint-disable no-console */
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const {default: fetch} = require('node-fetch');

const checkIds = process.env.GSCAN_DOC_CHECK_IDS !== 'false';

const SPEC_ROOT = path.resolve(__dirname, '../lib/specs/');

class Semaphore {
    /**
     * @param {number} maximum
     * @param {number} delay
     */
    constructor(maximum, delay = 150) {
        this._maximum = maximum;
        this._delay = delay;
        this._activeCount = 0;
        this._queue = [];

        // @TODO: Make this a public class property once ESLint supports it
        this._release = () => {
            this._activeCount -= 1;

            if (this._queue.length > 0) {
                setTimeout(this._queue.shift(), this._delay, this._release);
            }
        };
    }

    acquire() {
        if (this._activeCount === this._maximum) {
            const response = new Promise((resolve) => {
                this._queue.push(resolve);
            });

            return response;
        }

        this._activeCount += 1;
        return this._release;
    }
}

const LINK_TAG_EXTRACTION_REGEX = /<a\s(.*?)>/g;
const LINK_EXTRACTION_REGEX = /href="(.*?)"/g;

/**
 * @param {string} linkTag
 * @param {string} rulePath
 * @param {Record<string, Set<string>>} linksToCheck
 * @param {Record<string, Set<string>>} idsToCheck
 */
function extractLinksAndIssues(linkTag, rulePath, linksToCheck, idsToCheck) {
    const errorList = [];

    // @TODO: Should `target=_blank` be allowed?
    if (!linkTag.includes('target="_blank"') && !linkTag.includes('target=_blank')) {
        errorList.push('Does not have target="_blank"');
    }

    const [extractedLink] = linkTag.matchAll(LINK_EXTRACTION_REGEX);

    if (extractedLink) {
        try {
            const parsedLink = new URL(extractedLink[1]);
            const {hash} = parsedLink;
            parsedLink.hash = '';
            const link = parsedLink.toString();

            if (parsedLink.hostname.endsWith('ghost.org')) {
                // @TODO: Node 16 linksToCheck[link] ??= new Set();
                linksToCheck[link] = linksToCheck[link] || new Set();
                linksToCheck[link].add(rulePath);

                if (checkIds && hash.length > 1) {
                    idsToCheck[link] = idsToCheck[link] || new Set();
                    // @TODO: Node 16 idsToCheck[link] ??= new Set();
                    idsToCheck[link].add(hash.slice(1));
                }
            } else {
                errorList.push('Has an href that is not part of the Ghost website');
            }
        } catch (_) { // @TODO: Remove Catch Binding when eslint supports it
            errorList.push('Has an href with an invalid URL');
        }
    } else {
        errorList.push('Does not contain an href');
    }

    return errorList;
}

/**
 * @param {string} url
 * @param {Semaphore} semaphore
 * @param {Set<string>} dependencies
 * @param {null | Set<string>} idsToCheck
 */
async function confirmUrl(url, semaphore, dependencies, idsToCheck) {
    const releaseLock = await semaphore.acquire();
    const start = Date.now();

    try {
        const method = idsToCheck ? 'GET' : 'HEAD';
        const returnValue = {
            url,
            dependencies,
            success: false,
            hasRedirect: false,
            statusCode: null,
            missingIds: []
        };

        const response = await fetch(url, {method});
        returnValue.hasRedirect = response.redirected;
        returnValue.statusCode = response.status;

        if (!response.ok) {
            returnValue.success = false;
            return returnValue;
        }

        if (!idsToCheck) {
            returnValue.success = true;
            return returnValue;
        }

        const body = await response.text();

        for (const id of idsToCheck) {
            if (!body.includes(`id="${id}"`) && !body.includes(`id=${id}`)) {
                returnValue.missingIds.push(id);
            }
        }

        returnValue.success = returnValue.missingIds.length === 0;

        return returnValue;
    } finally {
        releaseLock();
        const elapsed = Date.now() - start;
        console.log(`Test: ${url} (${chalk.cyan(elapsed + 'ms')})`);
    }
}

/**
 * @param {Awaited<ReturnType<confirmUrl>>[]} summaries
 * @param {Record<string, string[]>} otherErrors
 */
function summarize(summaries, otherErrors) {
    let failureCount = 0;
    for (const summary of summaries) {
        const uses = summary.dependencies.size === 1
            ? `in ${summary.dependencies.values().next().value}`
            : `${summary.dependencies.size}x`;
        const urlWithUse = `${chalk.cyan(summary.url)} (used ${uses})`;
        if (summary.success) {
            if (summary.hasRedirect) {
                console.log(`${urlWithUse} was ${chalk.yellow('redirected')}`);
            }

            continue;
        }

        failureCount += 1;

        if (summary.missingIds.length === 0) {
            console.log(`${urlWithUse} returned a ${chalk.red('not-ok')} (${summary.statusCode}) status.`);
            continue;
        }

        console.log(`${urlWithUse} is ${chalk.yellow('missing')} ${summary.missingIds.length} ids:`);
        console.log(summary.missingIds.map(id => `  - ${id}`).join('\n'));
    }

    const otherErrorKV = Object.entries(otherErrors);

    if (otherErrorKV.length === 0) {
        return failureCount;
    }

    const plural = otherErrorKV.length === 1 ? '1 rule' : `${otherErrorKV.length} rules`;

    console.log(`${plural} have errors:`);

    for (const [ruleName, errors] of otherErrorKV) {
        console.log('  %s', ruleName);
        console.log(errors.map(error => `    ${error}`).join('\n'));
    }

    failureCount += otherErrorKV.length;

    return failureCount;
}

const semaphore = new Semaphore(5);

async function run() {
    const allSpecs = glob.sync('*.js', {cwd: SPEC_ROOT, ignore: 'index.js'});

    /** @type {Record<string, Set<string>>} */
    const linksToCheck = {};
    /** @type {Record<string, Set<string>>} */
    const idsToCheck = {};
    /** @type {Record<string, string[]>} */
    const miscErrors = {};

    for (const specFileName of allSpecs) {
        const {rules} = require(`../lib/specs/${specFileName}`);
        for (const [ruleName, {details: textWithPossibleLinks}] of Object.entries(rules)) {
            for (const match of textWithPossibleLinks.matchAll(LINK_TAG_EXTRACTION_REGEX)) {
                const fullRuleName = `${specFileName.split('.').shift()}/${ruleName}`;
                const errors = extractLinksAndIssues(match[0], fullRuleName, linksToCheck, idsToCheck);

                if (errors.length > 0) {
                    miscErrors[fullRuleName] = errors;
                }
            }
        }
    }

    const summary = await Promise.all(
        Object.entries(linksToCheck).map(
            ([url, dependencies]) => confirmUrl(url, semaphore, dependencies, idsToCheck[url] || null)
        )
    );

    process.exit(summarize(summary, miscErrors));
}

run();
