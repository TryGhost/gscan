var _       = require('lodash'),
    path = require('path'),
    fs = require('fs-extra'),
    checkDeprecations;

checkDeprecations = function checkDeprecations(theme, themePath) {
    var checks = [
            {
                helperRegEx: /{{pageUrl(\s\S+)?}}/ig,
                helperName: '{{pageUrl}}',
                ruleCode: 'GS001-DEPR-PURL'
            },
            {
                helperRegEx: /<meta name=("|')description("|') content=("|'){{meta_description}}("|')/ig,
                helperName: '{{meta_description}}',
                ruleCode: 'GS001-DEPR-MD'
            },
            {
                helperRegEx: /{{image}}/g,
                helperName: '{{image}}',
                ruleCode: 'GS001-DEPR-IMG'
            },
            {
                helperRegEx: /{{author\.image}}/g,
                helperName: '{{author.image}}',
                ruleCode: 'GS001-DEPR-AIMG'
            },
            {
                helperRegEx: /{{post\.image}}/g,
                helperName: '{{post.image}}',
                ruleCode: 'GS001-DEPR-PIMG'
            },
            {
                helperRegEx: /{{@blog\.cover}}/g,
                helperName: '{{@blog.cover}}',
                ruleCode: 'GS001-DEPR-BC'
            },
            {
                helperRegEx: /{{author\.cover}}/g,
                helperName: '{{author.cover}}',
                ruleCode: 'GS001-DEPR-AC'
            },
            {
                helperRegEx: /{{post\.image}}/g,
                helperName: '{{post.image}}',
                ruleCode: 'GS001-DEPR-TIMG'
            },
            {
                helperRegEx: /{{@blog\.posts_per_page}}/g,
                helperName: '{{@blog.posts_per_page}}',
                ruleCode: 'GS001-DEPR-PPP'
            },
            {
                helperRegEx: /{{content words=("|')0("|')}}/g,
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
