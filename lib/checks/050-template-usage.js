var _       = require('lodash'),
    Promise = require('bluebird'),
    checkTemplateUsage;

checkTemplateUsage = function checkTemplateUsage(theme) {
    var out = [],
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


    _.each(templates, function (template) {
        var match = _.find(theme.files, function (themeFile) {
            return themeFile.file.match(template.pattern);
        });

        if (match) {
            out.push({
                type: 'feature',
                ref: template.name,
                message: 'template is provided'
            });
        }
    });

    return Promise.resolve(out);
};

module.exports = checkTemplateUsage;
