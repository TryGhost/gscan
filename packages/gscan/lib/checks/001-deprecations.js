const _ = require('lodash');
const parse = require('../ast-linter/parser');
const spec = require('../specs');
const versions = require('../utils').versions;

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

function getLineOffsets(content) {
    const offsets = [0];

    for (let index = 0; index < content.length; index += 1) {
        if (content[index] === '\n') {
            offsets.push(index + 1);
        }
    }

    return offsets;
}

function getOffset(location, lineOffsets) {
    return lineOffsets[location.line - 1] + location.column;
}

function isNegatedBlock(content, node, lineOffsets) {
    const start = getOffset(node.loc.start, lineOffsets);

    return /^{{~?\^/.test(content.slice(start));
}

function isSingleAuthorCondition(node) {
    return node.path.original === 'is' &&
        node.params.length === 1 &&
        node.params[0].type === 'StringLiteral' &&
        node.params[0].value.trim() === 'author';
}

function addRange(ranges, node, lineOffsets) {
    ranges.push({
        start: getOffset(node.loc.start, lineOffsets),
        end: getOffset(node.loc.end, lineOffsets)
    });
}

function walkProgram(program, exempt, inLoop, content, lineOffsets, ranges) {
    program.body.forEach(function (node) {
        if (node.type !== 'BlockStatement') {
            if (exempt) {
                addRange(ranges, node, lineOffsets);
            }
            return;
        }

        const isLoop = node.path.original === 'foreach' || node.path.original === 'each';
        const isAuthorCondition = isSingleAuthorCondition(node);
        if (isAuthorCondition) {
            const isNegated = isNegatedBlock(content, node, lineOffsets);
            const primaryBranch = isNegated ? node.inverse : node.program;
            const elseBranch = isNegated ? node.program : node.inverse;

            if (primaryBranch) {
                walkProgram(primaryBranch, !isNegated && !inLoop, inLoop, content, lineOffsets, ranges);
            }

            if (elseBranch) {
                walkProgram(elseBranch, isNegated && !inLoop, inLoop, content, lineOffsets, ranges);
            }

            return;
        }

        if (node.program) {
            walkProgram(node.program, isLoop ? false : exempt, isLoop || inLoop, content, lineOffsets, ranges);
        }

        if (node.inverse) {
            walkProgram(node.inverse, exempt, inLoop, content, lineOffsets, ranges);
        }
    });
}

function getAuthorCheckableContent(content) {
    const parsed = parse(content, 'template.hbs');

    if (parsed.error) {
        return content;
    }

    const lineOffsets = getLineOffsets(content);
    const ranges = [];

    walkProgram(parsed.ast, false, false, content, lineOffsets, ranges);

    ranges.sort(function (left, right) {
        return left.start - right.start;
    });

    let checkableContent = '';
    let lastOffset = 0;

    ranges.forEach(function (range) {
        checkableContent += content.slice(lastOffset, range.start);
        lastOffset = range.end;
    });

    return checkableContent + content.slice(lastOffset);
}

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
