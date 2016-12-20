/**
 * # Spec
 *
 * This file contains details of the theme API spec, in a format that can be used by GScan
 */

var knownHelpers, templates, rules, ruleNext;

knownHelpers = [
    // Ghost
    'foreach', 'has', 'is', 'get', 'content', 'excerpt', 'title', 'tags', 'author', 'image', 'navigation', 'pagination',
    'page_url', 'url', 'date', 'plural', 'encode', 'asset', 'body_class', 'post_class', 'ghost_head', 'ghost_foot',
    'meta_title', 'meta_description', 'next_post', 'prev_post', 'twitter_url', 'facebook_url',
    // Ghost apps
    'input_email', 'input_password', 'amp_components', 'amp_content', 'amp_ghost_head', 'subscribe_form',
    // Handlebars and express handlebars
    // TODO add a warning that `each` should not be used because Ghost has special behaviour in `foreach`
    'log', 'if', 'unless', 'with', 'block', 'contentFor', 'each', 'lookup'
    // Registering these will break template compile checks
    // 'blockHelperMissing', 'helperMissing',
];

templates = [
    {
        name: 'Page template',
        pattern: /^page\.hbs$/,
        version: '>=0.4.0'
    },
    {
        name: 'Error template',
        pattern: /^error\.hbs$/,
        version: '>=0.4.0'
    },
    {
        name: 'Tag template',
        pattern: /^tag\.hbs$/,
        version: '>=0.4.2'
    },
    {
        name: 'Custom page template',
        pattern: /^page-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.4.2'
    },
    {
        name: 'Author template',
        pattern: /^author\.hbs$/,
        version: '>=0.5.0'
    },
    {
        name: 'Home template',
        pattern: /^home\.hbs$/,
        version: '>=0.5.0'
    },
    {
        name: 'Custom tag template',
        pattern: /^tag-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.5.0'
    },
    {
        name: 'Custom author template',
        pattern: /^author-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.6.3'
    },
    {
        name: 'Private template',
        pattern: /^private\.hbs$/,
        version: '>=0.6.3'
    },
    {
        name: 'Custom post template',
        pattern: /^post-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.7.3'
    }
];

rules = {
    "GS005-TPL-ERR": {
        "level": "error",
        "rule": "Templates must contain valid Handlebars."
    },
    "GS010-PJ-REQ": {
        "level": "warning",
        "rule": "package.json file should be present."
    },
    "GS010-PJ-VAL": {
        "level": "warning",
        "rule": "package.json file must be valid."
    },
    "GS020-INDEX-REQ": {
        "level": "error",
        "rule": "A template file called index.hbs must be present."
    },
    "GS020-POST-REQ": {
        "level": "error",
        "rule": "A template file called post.hbs must be present."
    },
    "GS020-DEF-REC": {
        "level": "recommendation",
        "rule": "Provide a default layout template called default.hbs."
    },
    "GS030-ASSET-REQ": {
        "level": "warning",
        "rule": "Assets such as CSS & JS must use the <code>{{asset}}</code> helper",
        "details": "<p>The listed files should be included using the <code>{{asset}}</code> helper. "
            + " For more information, please see the <a href=\"http://themes.ghost.org/docs/asset\">asset helper documentation</a>.</p>"
    },
    "GS030-ASSET-SYM": {
        "level": "error",
        "rule": "Symlinks in themes are not allowed."
    },
    "GS040-GH-REQ": {
        "level": "warning",
        "rule": "The helper <code>{{ghost_head}}</code> should be present."
    },
    "GS040-GF-REQ": {
        "level": "warning",
        "rule": "The helper <code>{{ghost_foot}}</code> should be present."
    }
};

/**
 * These are rules that haven't been implemented yet, but should be!
 */
ruleNext = {
    "GS030-CSS-CACHE": {
        "level": "warning",
        "rule": "CSS files should use cache bustable URLs."
    },
    "GS035-CONTENT-0": {
        "level": "warning",
        "rule": "Replace the content zero hack with the {{image}} helper"
    }
};

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules
};
