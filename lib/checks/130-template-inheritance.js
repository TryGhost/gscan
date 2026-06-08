const _ = require('lodash');
const path = require('path');
const spec = require('../specs');
const {versions, normalizePath} = require('../utils');

const ruleCode = 'GS130-NO-RECURSIVE-LAYOUT';
const layoutPattern = /{{!<\s+([A-Za-z0-9._/-]+)\s*}}/;

function stripLeadingSlash(filePath) {
    return filePath.replace(/^\/+/, '');
}

function ensureExtension(layoutPath) {
    if (path.posix.extname(layoutPath)) {
        return layoutPath;
    }

    return `${layoutPath}.hbs`;
}

function resolveLayoutPath(sourceFile, layoutName) {
    const source = normalizePath(sourceFile);
    const layout = ensureExtension(normalizePath(layoutName));

    if (layout.startsWith('/')) {
        return stripLeadingSlash(path.posix.normalize(layout));
    }

    return stripLeadingSlash(path.posix.normalize(path.posix.join(path.posix.dirname(source), layout)));
}

function getLocation(source, index) {
    const lines = source.slice(0, index).split('\n');

    return {
        line: lines.length,
        column: lines[lines.length - 1].length
    };
}

function getLayoutReference(themeFile) {
    const source = normalizePath(themeFile.normalizedFile || themeFile.file);
    const content = themeFile.content || '';
    const match = content.match(layoutPattern);

    if (!match) {
        return;
    }

    return {
        source,
        target: resolveLayoutPath(source, match[1]),
        location: getLocation(content, match.index)
    };
}

function buildInheritanceGraph(theme) {
    const hbsFiles = theme.files.filter(file => file.ext === '.hbs');
    const existingFiles = new Set(hbsFiles.map(file => normalizePath(file.normalizedFile || file.file)));
    const graph = new Map();

    hbsFiles.forEach((themeFile) => {
        const reference = getLayoutReference(themeFile);

        if (!reference || !existingFiles.has(reference.target)) {
            return;
        }

        graph.set(reference.source, reference);
    });

    return graph;
}

function getCyclePath(stack, target) {
    const targetIndex = stack.indexOf(target);
    return stack.slice(targetIndex).concat(target).join(' -> ');
}

function getRecursiveLayoutFailures(graph) {
    const visited = new Set();
    const visiting = new Set();
    const stack = [];
    const reportedCycles = new Set();
    const failures = [];

    function visit(file) {
        visiting.add(file);
        stack.push(file);

        const reference = graph.get(file);

        if (!reference) {
            stack.pop();
            visiting.delete(file);
            visited.add(file);
            return;
        }

        if (visiting.has(reference.target)) {
            const cyclePath = getCyclePath(stack, reference.target);

            if (!reportedCycles.has(cyclePath)) {
                reportedCycles.add(cyclePath);

                failures.push({
                    ref: reference.source,
                    line: reference.location.line,
                    column: reference.location.column,
                    message: `Recursive layout inheritance detected: ${cyclePath}`
                });
            }
        } else if (!visited.has(reference.target)) {
            visit(reference.target);
        }

        stack.pop();
        visiting.delete(file);
        visited.add(file);
    }

    graph.forEach((_references, file) => {
        if (!visited.has(file)) {
            visit(file);
        }
    });

    return failures;
}

const checkTemplateInheritance = function checkTemplateInheritance(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    const ruleSet = spec.get([checkVersion]);

    if (!ruleSet.rules[ruleCode]) {
        return theme;
    }

    const failures = getRecursiveLayoutFailures(buildInheritanceGraph(theme));

    if (failures.length > 0) {
        theme.results.fail[ruleCode] = {failures};
    } else {
        theme.results.pass.push(ruleCode);
    }

    return theme;
};

module.exports = checkTemplateInheritance;
