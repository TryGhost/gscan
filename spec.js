/**
 * # Spec
 *
 * This file contains details of the theme API spec, in a format that can be used by GScan
 */

var knownHelpers, templates, rules;

knownHelpers = [
    'foreach', 'has', 'is', 'get', 'content', 'excerpt', 'tags', 'author', 'image', 'navigation', 'pagination',
    'url', 'date', 'plural', 'encode', 'asset', 'body_class', 'post_class', 'ghost_head', 'ghost_foot',
    'meta_title', 'meta_description', 'next_post', 'prev_post', 'log', 'if', 'unless'
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
    "template-parse": {
        "code": "GS005TPLERR",
        "level": "error",
        "rule": "Templates must contain valid Handlebars."
    },
    "package.json-required": {
        "code": "GS010PJREQ",
        "level": "warning",
        "rule": "package.json file should be present."
    },
    "package.json-valid": {
        "code": "GS010PJVAL",
        "level": "error",
        "rule": "package.json file must be valid."
    },
    "index.hbs-required": {
        "code": "GS020INDEXREQ",
        "level": "error",
        "rule": "index.hbs file must be present."
    },
    "post.hbs-required": {
        "code": "GS020POSTREQ",
        "level": "error",
        "rule": "post.hbs file must be present."
    },
    "default.hbs-recommended": {
        "code": "GS020DEFREC",
        "level": "recommendation",
        "rule": "default.hbs file should be present."
    },
    "asset-required": {
        "code": "GS030ASSETREQ",
        "level": "error",
        "rule": "Assets such as CSS & JS must use the `{{asset}}` helper"
    },
    "ghost_head-required": {
        "code": "GS040GHREQ",
        "level": "warning",
        "rule": "{{ghost_head}} should be present."
    },
    "ghost_foot-required": {
        "code": "GS040GFREQ",
        "level": "warning",
        "rule": "{{ghost_foot}} should be present."
    }
};

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules
};
