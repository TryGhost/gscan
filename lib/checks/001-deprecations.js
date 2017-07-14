var _       = require('lodash'),
    path = require('path'),
    fs = require('fs-extra'),
    checkDeprecations;

checkDeprecations = function checkDeprecations(theme, themePath) {
    var checks = [
        {
            helperRegEx: /{{\s*?pageUrl\b[\w\s='"]*?}}/ig,
            helperName: '{{pageUrl}}',
            ruleCode: 'GS001-DEPR-PURL'
        },
        {
            helperRegEx: /<meta name=("|')description("|') content=("|'){{meta_description}}("|')/ig,
            helperName: '{{meta_description}}',
            ruleCode: 'GS001-DEPR-MD'
        },
        {
            helperRegEx: /{{\s*?image\b[\w\s='"]*?}}/g,
            helperName: '{{image}}',
            ruleCode: 'GS001-DEPR-IMG'
        },
        {
            helperRegEx: /{{\s*?cover\s*?}}/g,
            helperName: '{{cover}}',
            ruleCode: 'GS001-DEPR-COV'
        },
        {
            helperRegEx: /{{\s*?author\.image\s*?}}/g,
            helperName: '{{author.image}}',
            ruleCode: 'GS001-DEPR-AIMG'
        },
        {
            helperRegEx: /{{\s*?post\.image\s*?}}/g,
            helperName: '{{post.image}}',
            ruleCode: 'GS001-DEPR-PIMG'
        },
        {
            helperRegEx: /{{\s*?@blog\.cover\s*?}}/g,
            helperName: '{{@blog.cover}}',
            ruleCode: 'GS001-DEPR-BC'
        },
        {
            helperRegEx: /{{\s*?author\.cover\s*?}}/g,
            helperName: '{{author.cover}}',
            ruleCode: 'GS001-DEPR-AC'
        },
        {
            helperRegEx: /{{\s*?tag\.image\s*?}}/g,
            helperName: '{{tag.image}}',
            ruleCode: 'GS001-DEPR-TIMG'
        },
        {
            helperRegEx: /{{\s*?tags\.\[[0-9]+\]\.image\s*?}}/g,
            helperName: '{{tags.[#].image}}',
            ruleCode: 'GS001-DEPR-TSIMG'
        },
        {
            helperRegEx: /{{\s*?post\.author\.image\s*?}}/g,
            helperName: '{{post.author.image}}',
            ruleCode: 'GS001-DEPR-PAIMG'
        },
        {
            helperRegEx: /{{\s*?post\.author\.cover\s*?}}/g,
            helperName: '{{post.author.cover}}',
            ruleCode: 'GS001-DEPR-PAC'
        },
        {
            helperRegEx: /{{\s*?post\.tags\.\[[0-9]+\]\.image\s*?}}/g,
            helperName: '{{post.tags.[#].image}}',
            ruleCode: 'GS001-DEPR-PTIMG'
        },
        {
            helperRegEx: /{{\s*?#if\s*?image\s*?}}/g,
            helperName: '{{#if image}}',
            ruleCode: 'GS001-DEPR-CON-IMG'
        },
        {
            helperRegEx: /{{\s*?#if\s*?cover\s*?}}/g,
            helperName: '{{#if cover}}',
            ruleCode: 'GS001-DEPR-CON-COV'
        },
        {
            helperRegEx: /{{\s*?#if\s*?@blog\.cover\s*?}}/g,
            helperName: '{{#if @blog.cover}}',
            ruleCode: 'GS001-DEPR-CON-BC'
        },
        {
            helperRegEx: /{{\s*?#if\s*?author\.cover\s*?}}/g,
            helperName: '{{#if author.cover}}',
            ruleCode: 'GS001-DEPR-CON-AC'
        },
        {
            helperRegEx: /{{\s*?#if\s*?author\.image\s*?}}/g,
            helperName: '{{#if author.image}}',
            ruleCode: 'GS001-DEPR-CON-AIMG'
        },
        {
            helperRegEx: /{{\s*?#if\s*?tag\.image\s*?}}/g,
            helperName: '{{#if tag.image}}',
            ruleCode: 'GS001-DEPR-CON-TIMG'
        },
        {
            helperRegEx: /{{\s*?#if\s*?post\.tags\.\[[0-9]+\].image\s*?}}/g,
            helperName: '{{#if posts.tags.[#].image}}',
            ruleCode: 'GS001-DEPR-CON-PTIMG'
        },
        {
            helperRegEx: /{{\s*?#if\s*?tags\.\[[0-9]+\].image\s*?}}/g,
            helperName: '{{#if tags.[#].image}}',
            ruleCode: 'GS001-DEPR-CON-TSIMG'
        },
        {
            helperRegEx: /{{\s*?@blog\.posts_per_page\s*?}}/g,
            helperName: '{{@blog.posts_per_page}}',
            ruleCode: 'GS001-DEPR-PPP'
        },
        {
            helperRegEx: /{{\s*?content words=("|')0("|')\s*?}}/g,
            helperName: '{{content words="0"}}',
            ruleCode: 'GS001-DEPR-C0H'
        },
        {
            cssRegEx: /\.archive-template[\s\{]/g,
            className: '.archive-template',
            css: true,
            ruleCode: 'GS001-DEPR-CSS-AT'
        },
        {
            cssRegEx: /\.page[\s\{]/g,
            className: '.page',
            css: true,
            ruleCode: 'GS001-DEPR-CSS-PA'
        },
        {
            cssRegEx: /\.page-template-\w+[\s\{]/g,
            className: '.page-template-slug',
            css: true,
            ruleCode: 'GS001-DEPR-CSS-PATS'
        }
    ];

    _.each(checks, function (check) {
        _.each(theme.files, function (themeFile) {
            var template = themeFile.file.match(/^[^\/]+.hbs$/) || themeFile.file.match(/^partials[\/\\]+(.*)\.hbs$/),
                css = themeFile.file.match(/\.css/),
                cssDeprecations;

            if (template && !check.css) {
                if (themeFile.content.match(check.helperRegEx)) {
                    if (!theme.results.fail.hasOwnProperty(check.ruleCode)) {
                        theme.results.fail[check.ruleCode] = {failures: []};
                    }

                    theme.results.fail[check.ruleCode].failures.push(
                        {
                            ref: themeFile.file,
                            message: 'Please remove or replace ' + check.helperName + ' from this template'
                        }
                    );
                }
            } else if (css && check.css) {
                try {
                    css = fs.readFileSync(path.join(themePath, themeFile.file), 'utf8');
                    cssDeprecations = css.match(check.cssRegEx);

                    if (cssDeprecations) {
                        _.each(cssDeprecations, function (cssDeprecation) {
                            if (!theme.results.fail.hasOwnProperty(check.ruleCode)) {
                                theme.results.fail[check.ruleCode] = {failures: []};
                            }

                            theme.results.fail[check.ruleCode].failures.push(
                                {
                                    ref: themeFile.file,
                                    message: 'Please remove or replace ' + cssDeprecation.trim() + ' from this css file.'
                                }
                            );
                        });
                    }
                } catch (err) {
                    // ignore for now
                }
            }
        });

       if (theme.results.pass.indexOf(check.ruleCode) === -1 && !theme.results.fail.hasOwnProperty(check.ruleCode)) {
           theme.results.pass.push(check.ruleCode);
       }
    });

    return theme;
};

module.exports = checkDeprecations;
