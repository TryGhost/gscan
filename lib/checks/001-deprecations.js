const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;

// {{author.*}} properties are correctly available in the current context while
// inside a single-condition {{#is "author"}}...{{/is}} block (e.g. in
// default.hbs), so deprecation checks for those properties should ignore
// content in these blocks. Tokenizes rather than doing a single blind regex
// replace so that: multi-condition `{{#is}}` (an OR, so it isn't necessarily
// author context), Handlebars comments, nested `{{#is}}`/`{{#foreach}}`
// blocks, and `{{else}}` branches are all handled correctly - see #365 review
// discussion for the concrete false-negative cases a naive strip previously
// introduced.
//
// `{{#if}}`/`{{#unless}}` are tracked as their own frame type so that a
// nested `{{else}}` (which belongs to that if/unless, not the enclosing
// `{{#is "author"}}`) never flips the outer is-block's active branch.
//
// Note: bare `{{author}}` (GS001-DEPR-AUTH) is intentionally NOT in the list
// below - it's a removed helper, not a property access, so it renders
// `[object Object]` even inside an author context and should never be exempt.
const authorTagRegex = /{{!--[\s\S]*?--}}|{{!(?!--)[\s\S]*?}}|{{[#^]is\s+(['"])([\s\S]*?)\1\s*}}|{{\/is}}|{{else}}|{{#(?:foreach|each)\b[^}]*}}|{{\/(?:foreach|each)}}|{{[#^](?:if|unless)\b[^}]*}}|{{\/(?:if|unless)}}/g;

function currentExempt(stack) {
    if (!stack.length) {
        return false;
    }

    const top = stack[stack.length - 1];

    if (top.type === 'loop') {
        return false;
    }

    return top.inElse ? top.elseExempt : top.primaryExempt;
}

function getAuthorCheckableContent(content) {
    const stack = [];
    let result = '';
    let lastIndex = 0;
    let match;

    authorTagRegex.lastIndex = 0;
    while ((match = authorTagRegex.exec(content)) !== null) {
        const exemptBefore = currentExempt(stack);
        result += exemptBefore ? '' : content.slice(lastIndex, match.index);

        const token = match[0];

        if (token.startsWith('{{!')) {
            // Handlebars comment: opaque, does not affect nesting/exemption.
        } else if (token.startsWith('{{#is') || token.startsWith('{{^is')) {
            const condition = (match[2] || '').trim();
            const isNegated = token.startsWith('{{^is');
            const isSingleAuthorCondition = condition === 'author';
            // {{#is "author"}}: author context before {{else}}, not after.
            // {{^is "author"}}: the inverse - author context only after
            // {{else}} (Ghost's {{#is}} supports {{else}} for both forms).
            const ownPrimaryExempt = isSingleAuthorCondition && !isNegated;
            const ownElseExempt = isSingleAuthorCondition && isNegated;
            stack.push({
                type: 'is',
                inElse: false,
                primaryExempt: ownPrimaryExempt || exemptBefore,
                elseExempt: ownElseExempt || exemptBefore
            });
        } else if (token === '{{else}}') {
            // Only an `{{#is}}` frame's own `{{else}}` should switch its
            // active branch - an `{{else}}` belonging to a nested
            // `{{#if}}`/`{{#unless}}` (or `{{#foreach}}`/`{{#each}}`) frame
            // must not leak through to the enclosing `is` frame.
            if (stack.length && stack[stack.length - 1].type === 'is') {
                stack[stack.length - 1].inElse = true;
            }
        } else if (token === '{{/is}}') {
            if (stack.length && stack[stack.length - 1].type === 'is') {
                stack.pop();
            }
        } else if (/^{{#(?:foreach|each)\b/.test(token)) {
            // {{author}} inside a {{#foreach}}/{{#each}} refers to that
            // item's author relation, not the page-context author, even
            // when nested inside an {{#is "author"}} block - still checkable.
            stack.push({type: 'loop'});
        } else if (/^{{\/(?:foreach|each)}}/.test(token)) {
            if (stack.length && stack[stack.length - 1].type === 'loop') {
                stack.pop();
            }
        } else if (/^{{[#^](?:if|unless)\b/.test(token)) {
            // `{{#if}}`/`{{#unless}}` don't change author context - both of
            // their branches inherit whatever exemption was already active.
            stack.push({
                type: 'cond',
                inElse: false,
                primaryExempt: exemptBefore,
                elseExempt: exemptBefore
            });
        } else if (/^{{\/(?:if|unless)}}/.test(token)) {
            if (stack.length && stack[stack.length - 1].type === 'cond') {
                stack.pop();
            }
        }

        result += token;
        lastIndex = authorTagRegex.lastIndex;
    }

    const exemptAfter = currentExempt(stack);
    result += exemptAfter ? '' : content.slice(lastIndex);

    return result;
}

const authorContextAwareRules = [
    'GS001-DEPR-CON-AUTH',
    'GS001-DEPR-AUTH-ID',
    'GS001-DEPR-AUTH-SLUG',
    'GS001-DEPR-AUTH-MAIL',
    'GS001-DEPR-AUTH-MT',
    'GS001-DEPR-AUTH-MD',
    'GS001-DEPR-AUTH-NAME',
    'GS001-DEPR-AUTH-BIO',
    'GS001-DEPR-AUTH-LOC',
    'GS001-DEPR-AUTH-WEB',
    'GS001-DEPR-AUTH-TW',
    'GS001-DEPR-AUTH-FB',
    'GS001-DEPR-AUTH-PIMG',
    'GS001-DEPR-AUTH-CIMG',
    'GS001-DEPR-AUTH-URL'
];

function getCheckableContent(content, ruleCode) {
    if (authorContextAwareRules.includes(ruleCode)) {
        return getAuthorCheckableContent(content);
    }

    return content;
}

const checkDeprecations = function checkDeprecations(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);

    // CASE: 001-deprecations checks only needs `rules` that start with `GS001-`
    const ruleRegex = /GS001-.*/g;

    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    _.each(ruleSet, function (check, ruleCode) {
        _.each(theme.files, function (themeFile) {
            const template = themeFile.file.match(/^.+\.hbs$/);
            const skipTemplateCheck = check.notValidIn && check.notValidIn.match(template);
            let css = themeFile.file.match(/\.css$/);
            let cssDeprecations;

            if (template && !check.css && !skipTemplateCheck) {
                if (getCheckableContent(themeFile.content, ruleCode).match(check.regex)) {
                    if (!Object.prototype.hasOwnProperty.call(theme.results.fail, (ruleCode))) {
                        theme.results.fail[ruleCode] = {failures: []};
                    }

                    theme.results.fail[ruleCode].failures.push(
                        {
                            ref: themeFile.file,
                            message: 'Please remove or replace ' + check.helper + ' from this template'
                        }
                    );
                }
            } else if (css && check.css && !skipTemplateCheck) {
                try {
                    css = themeFile.content;
                    cssDeprecations = css.match(check.regex);

                    if (cssDeprecations) {
                        _.each(cssDeprecations, function (cssDeprecation) {
                            if (!Object.prototype.hasOwnProperty.call(theme.results.fail, ruleCode)) {
                                theme.results.fail[ruleCode] = {failures: []};
                            }

                            theme.results.fail[ruleCode].failures.push(
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

        if (theme.results.pass.indexOf(ruleCode) === -1 && !Object.prototype.hasOwnProperty.call(theme.results.fail, ruleCode)) {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkDeprecations;
