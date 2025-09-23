const {normalizePath} = require('../utils');

const checkRecursivePartials = function checkRecursivePartials(theme, options) { // eslint-disable-line no-unused-vars
    let failed = false;
    const failures = [];

    // Build a dependency graph of partials
    const partialDependencies = {};

    // First pass: collect all partial dependencies
    theme.files.forEach((themeFile) => {
        if (!themeFile.content || !themeFile.file.match(/\.hbs$/)) {
            return;
        }

        // Extract the template name
        let templateName = themeFile.file.replace(/\.hbs$/, '');

        // For partials, use just the partial name
        const partialMatch = themeFile.file.match(/^partials[/\\]+(.*)\.hbs$/);
        if (partialMatch) {
            templateName = partialMatch[1];
        }

        const normalizedTemplateName = normalizePath(templateName);

        // Parse the template to find partial inclusions

        // Check if AST is nested in parsed.ast
        const ast = (themeFile.parsed && themeFile.parsed.ast) || themeFile.parsed;

        if (ast && ast.body) {
            const partials = [];

            // Function to recursively find partials in AST
            const findPartials = (node) => {
                if (!node) {
                    return;
                }

                if (node.type === 'PartialStatement' || node.type === 'PartialBlockStatement') {
                    if (node.name) {
                        let partialName = null;

                        if (typeof node.name === 'string') {
                            // Direct string
                            partialName = node.name;
                        } else if (node.name.type === 'StringLiteral' && node.name.value) {
                            // StringLiteral (most common)
                            partialName = node.name.value;
                        } else if (node.name.type === 'PathExpression' && node.name.original) {
                            // PathExpression
                            partialName = node.name.original;
                        } else if (node.name.original) {
                            // Has original property
                            partialName = node.name.original;
                        }

                        if (partialName) {
                            partials.push(normalizePath(partialName));
                        }
                    }
                }

                // CRITICAL: Check for helpers that match the partial name
                // This catches cases like navigation.hbs containing {{navigation}}
                if (node.type === 'MustacheStatement' && node.path) {
                    let helperName = null;

                    if (typeof node.path === 'string') {
                        helperName = node.path;
                    } else if (node.path.type === 'PathExpression' && node.path.original) {
                        helperName = node.path.original;
                    } else if (node.path.original) {
                        helperName = node.path.original;
                    }

                    // Check if the helper name matches the partial name (self-reference)
                    // For example: navigation.hbs containing {{navigation}}
                    const currentPartialName = templateName.replace(/^partials[/\\]+/, '');
                    if (helperName && helperName === currentPartialName) {
                        // This is a self-reference through a helper
                        partials.push(normalizePath(currentPartialName));
                    }
                }

                // Recursively process child nodes
                if (node.body) {
                    if (Array.isArray(node.body)) {
                        node.body.forEach(findPartials);
                    } else {
                        findPartials(node.body);
                    }
                }
                if (node.program) {
                    findPartials(node.program);
                }
                if (node.inverse) {
                    findPartials(node.inverse);
                }
            };

            ast.body.forEach(findPartials);

            if (partials.length > 0) {
                partialDependencies[normalizedTemplateName] = partials;
            }
        }
    });

    // Second pass: check for circular dependencies
    const checkCircularDependencies = (templateName, visited = new Set(), path = []) => {
        if (visited.has(templateName)) {
            // Found a cycle
            const cycleStart = path.indexOf(templateName);
            const cycle = [...path.slice(cycleStart), templateName];
            return cycle;
        }

        visited.add(templateName);
        path.push(templateName);

        const dependencies = partialDependencies[templateName] || [];
        for (const dep of dependencies) {
            const cycle = checkCircularDependencies(dep, new Set(visited), [...path]);
            if (cycle) {
                return cycle;
            }
        }

        return null;
    };

    // Check each template for circular dependencies
    const checkedCycles = new Set();
    Object.keys(partialDependencies).forEach((templateName) => {
        const cycle = checkCircularDependencies(templateName, new Set(), []);

        if (cycle && cycle.length > 1) {
            // Create a normalized cycle signature to avoid duplicate reports
            const cycleSignature = [...cycle].sort().join('->');

            if (!checkedCycles.has(cycleSignature)) {
                checkedCycles.add(cycleSignature);
                failed = true;

                // Find the actual file for better error reporting
                const templateFile = theme.files.find((f) => {
                    const name = f.file.replace(/\.hbs$/, '').replace(/^partials[/\\]+/, '');
                    return normalizePath(name) === templateName;
                });

                failures.push({
                    ref: templateFile ? templateFile.file : templateName,
                    message: `Circular partial dependency detected: ${cycle.join(' → ')}`
                });
            }
        }
    });

    // Check for direct self-recursion (template including itself)
    // Only report if not already caught by circular dependency check
    theme.files.forEach((themeFile) => {
        if (!themeFile.content || !themeFile.file.match(/\.hbs$/)) {
            return;
        }

        // Extract the template name
        let templateName = themeFile.file.replace(/\.hbs$/, '');
        const partialMatch = themeFile.file.match(/^partials[/\\]+(.*)\.hbs$/);
        if (partialMatch) {
            templateName = partialMatch[1];
        }
        const normalizedTemplateName = normalizePath(templateName);

        // Check if the template directly includes itself
        const dependencies = partialDependencies[normalizedTemplateName] || [];
        if (dependencies.includes(normalizedTemplateName)) {
            // Check if we already reported this as a circular dependency
            const alreadyReported = failures.some(f =>
                f.ref === themeFile.file &&
                f.message.includes('Circular partial dependency')
            );

            if (!alreadyReported) {
                failed = true;
                failures.push({
                    ref: themeFile.file,
                    message: `Direct recursive partial detected: Template <code>${templateName}</code> includes itself, which will cause an infinite render loop`
                });
            }
        }
    });

    if (failed) {
        theme.results.fail['GS091-RECURSIVE-PARTIAL'] = {
            failures: failures,
            fatal: true
        };
    } else {
        theme.results.pass.push('GS091-RECURSIVE-PARTIAL');
    }

    return theme;
};

module.exports = checkRecursivePartials;