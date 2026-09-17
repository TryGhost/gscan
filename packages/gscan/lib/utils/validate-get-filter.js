const nql = require('@tryghost/nql');

// Resources the {{#get}} helper knows how to fetch.
// Keep in sync with `RESOURCES` in Ghost's core/frontend/helpers/get.js.
const GET_RESOURCES = ['posts', 'pages', 'tags', 'authors', 'tiers', 'newsletters'];

/**
 * Fields the Content API refuses to filter on, mirroring
 * `CONTENT_API_RESTRICTED_FIELDS` and `CONTENT_API_RESTRICTED_RELATIONS` in
 * Ghost's core/server/api/endpoints/utils/api-filter-utils.ts.
 *
 * This is deliberately a blocklist rather than an allowlist of valid fields. It
 * mirrors one short, explicit constant that exists in core for its own reasons
 * and changes rarely, instead of the whole database schema, which changes every
 * release and would make gscan warn about perfectly good themes whenever it fell
 * behind. Being out of date here means missing a warning, never inventing one.
 *
 * Ghost matches these against every dot-separated segment of a filter key, so
 * `authors.email` is caught as well as `email`.
 */
const RESTRICTED_FIELDS = new Set([
    'password',
    'email',
    'email_only',
    'html',
    'lexical',
    'locale',
    'mobiledoc',
    'newsletter_id',
    'plaintext',
    'email_recipient_filter',
    'published_by',
    'mobiledoc_revisions',
    'post_revisions'
]);

// `{{#get}}` interpolates `{{...}}` inside a filter string before handing it to
// the API, so the literal we see in the template is not the string NQL parses.
// Swapping each interpolation for a placeholder literal lets us parse the shape
// of the filter without knowing the runtime values.
const INTERPOLATION_REGEX = /\{\{.*?\}\}/g;
const PLACEHOLDER = 'gscanDynamicValue';

/**
 * @param {string} filter
 * @returns {{filter: string, isDynamic: boolean}}
 */
function substituteInterpolations(filter) {
    const isDynamic = INTERPOLATION_REGEX.test(filter);
    INTERPOLATION_REGEX.lastIndex = 0;

    return {
        filter: filter.replace(INTERPOLATION_REGEX, PLACEHOLDER),
        isDynamic
    };
}

/**
 * Collect every field name referenced by a parsed NQL (mongo JSON) query.
 *
 * @param {*} node
 * @param {Set<string>} [keys]
 * @returns {Set<string>}
 */
function collectKeys(node, keys = new Set()) {
    if (!node || typeof node !== 'object') {
        return keys;
    }

    if (Array.isArray(node)) {
        node.forEach(child => collectKeys(child, keys));
        return keys;
    }

    for (const key of Object.keys(node)) {
        if (key.startsWith('$')) {
            // $and/$or/$nor hold groups, $not holds a single nested statement.
            // Everything else ($eq, $regex, ...) is a comparison against a value
            // we don't care about.
            if (['$and', '$or', '$nor', '$not'].includes(key)) {
                collectKeys(node[key], keys);
            }
        } else {
            keys.add(key);
        }
    }

    return keys;
}

/**
 * Statically validate a `{{#get}}` filter against what the Content API will do
 * with it.
 *
 * @param {string} resource One of posts/pages/tags/authors/tiers/newsletters
 * @param {string} rawFilter The filter exactly as written in the template
 * @returns {{type: 'syntax'|'restricted', message: string}[]} Empty when the filter is fine
 */
function validateGetFilter(resource, rawFilter) {
    if (!GET_RESOURCES.includes(resource) || typeof rawFilter !== 'string' || !rawFilter.trim()) {
        return [];
    }

    const {filter, isDynamic} = substituteInterpolations(rawFilter);

    let parsed;

    try {
        parsed = nql(filter).parse();
    } catch (err) {
        // A filter built partly from template values can legitimately fail to
        // parse here, because the placeholder stands in for text we can't know
        // (it may itself contain operators). Only a fully static filter is safe
        // to call a syntax error.
        if (isDynamic) {
            return [];
        }

        return [{
            type: 'syntax',
            message: `filter="${rawFilter}" is not valid NQL and will make {{#get}} render its {{else}} block: ${err.message.split('\n')[0]}`
        }];
    }

    const issues = [];

    for (const key of collectKeys(parsed)) {
        // Anything built from a template value could resolve to any field name.
        if (key.includes(PLACEHOLDER)) {
            continue;
        }

        const isRestricted = key.toLowerCase().split('.').some(segment => RESTRICTED_FIELDS.has(segment));

        if (isRestricted) {
            issues.push({
                type: 'restricted',
                message: `filter="${rawFilter}" uses "${key}", which the Content API is not allowed to filter on. Ghost silently drops it from the query, so {{#get}} returns more ${resource} than expected`
            });
        }
    }

    return issues;
}

module.exports = {
    validateGetFilter,
    // exported for tests
    collectKeys,
    GET_RESOURCES,
    RESTRICTED_FIELDS,
    PLACEHOLDER
};
