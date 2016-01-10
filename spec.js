/**
 * # Spec
 *
 * This file contains details of the theme API spec, in a format that can be used by GScan
 */

var knownHelpers = [
    'foreach', 'has', 'is', 'get', 'content', 'excerpt', 'tags', 'author', 'image', 'navigation', 'pagination',
    'url', 'date', 'plural', 'encode', 'asset', 'body_class', 'post_class', 'ghost_head', 'ghost_foot',
    'meta_title', 'meta_description', 'next_post', 'prev_post', 'log', 'if', 'unless'
];

module.exports = {
    knownHelpers: knownHelpers
};
