const _ = require('lodash');
const ASTLinter = require('./ast-linter');
const {normalizePath} = require('./utils');

const linter = new ASTLinter({
    partials: [],
    helpers: []
});

// Files and directories that are not part of a theme and must be excluded from
// checks. Mirrors the filtering the on-disk reader (read-theme.js) performs
// while walking the directory tree.
const ignore = [
    'node_modules',
    'bower_components',
    '.DS_Store',
    '.git',
    '.svn',
    '.claude',
    'CLAUDE.md',
    'AGENTS.md',
    'Thumbs.db',
    '.yarn-cache'
];

/**
 * Returns true when any path segment of the (theme-relative) file matches an
 * ignored name, e.g. `node_modules/foo.js` or `.claude/settings.json`.
 */
const isIgnored = function isIgnored(file) {
    return file.split(/[/\\]/).some(segment => ignore.indexOf(segment) > -1);
};

/**
 * Returns true for files whose content the checks need: .hbs, .css, .js and
 * package.json.
 */
const isContentFile = function isContentFile(themeFile) {
    if (themeFile && themeFile.ext) {
        return themeFile.ext.match(/\.hbs|\.css|\.js/ig) || themeFile.file.match(/package.json/i);
    }
    return false;
};

const processHelpers = function (theme, themeFile) {
    linter.verify({
        parsed: themeFile.parsed,
        rules: [
            require('./ast-linter/rules/mark-used-helpers')
        ],
        source: themeFile.content,
        moduleId: themeFile.file
    });
    for (const helper of linter.helpers) {
        if (!theme.helpers[helper.name]) {
            theme.helpers[helper.name] = [];
        }
        theme.helpers[helper.name].push(themeFile.file);
    }
};

/**
 * Parses the content-bearing files of a theme that already have their
 * `content` loaded. Populates `theme.partials`, `theme.helpers`,
 * `theme.customSettings` and the parsed AST on each .hbs file.
 *
 * This is the filesystem-free core shared by the on-disk reader
 * (read-theme.js) and the in-memory readers (checkBuffer / checkFiles).
 *
 * @param {Theme} theme
 * @returns {Theme}
 */
const parseThemeFiles = function parseThemeFiles(theme) {
    const themeFilesContent = _.filter(theme.files, isContentFile);

    // Setup a partials array
    theme.partials = [];

    // Setup the helper object
    theme.helpers = {};

    themeFilesContent.forEach((themeFile) => {
        // CASE: in-memory readers may include entries without content; skip them
        if (typeof themeFile.content !== 'string') {
            return;
        }

        if (!theme.customSettings) {
            theme.customSettings = {};
        }

        const packageJsonMatch = themeFile.file === 'package.json';
        if (packageJsonMatch) {
            try {
                const packageJson = JSON.parse(themeFile.content);
                if (packageJson.config && packageJson.config.custom) {
                    theme.customSettings = packageJson.config.custom;
                }
            } catch (e) {
                // Ignore error as they will be caught in 010-package-json.js
            }
        }

        const partialMatch = themeFile.file.match(/^partials[/\\]+(.*)\.hbs$/);
        if (partialMatch) {
            theme.partials.push(partialMatch[1]);
        }

        const handlebarsMatch = themeFile.file.match(/\.hbs$/);
        if (handlebarsMatch) {
            themeFile.parsed = ASTLinter.parse(themeFile.content, themeFile.file);
            processHelpers(theme, themeFile);
        }
    });

    return theme;
};

/**
 * Works only for posts, pages and custom templates at the moment.
 *
 * @TODO:
 * This fn was added for the custom post template feature https://github.com/TryGhost/Ghost/issues/9060.
 * We've decided to extract custom templates in GScan for now, because the read-theme helper already knows which
 * hbs files are part of a theme.
 *
 * As soon as we have another use case e.g. we would like to allow to parse a custom template header with frontmatter,
 * then we need to know which template is custom, which is not. Also, it could be that
 * this function is outsourced in the future, so it can be used by GScan and Ghost. But for now, we don't pre-optimise.
 */
const extractCustomTemplates = function extractCustomTemplates(allTemplates) {
    const toReturn = [];
    const generateName = function generateName(templateName) {
        let name = templateName;

        name = name.replace(/^(post-|page-|custom-)/, '');
        name = name.replace(/-/g, ' ');
        name = name.replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });

        return name.trim();
    };
    const generateFor = function (templateName) {
        if (templateName.match(/^page-/)) {
            return ['page'];
        }

        if (templateName.match(/^post-/)) {
            return ['post'];
        }

        return ['page', 'post'];
    };
    const generateSlug = function (templateName) {
        if (templateName.match(/^custom-/)) {
            return null;
        }

        return templateName.match(/^(page-|post-)(.*)/)[2];
    };

    _.each(allTemplates, function (templateName) {
        if (templateName.match(/^(post-|page-|custom-)/) && !templateName.match(/\//)) {
            toReturn.push({
                filename: templateName,
                name: generateName(templateName),
                for: generateFor(templateName),
                slug: generateSlug(templateName)
            });
        }
    });

    return toReturn;
};

/**
 * Extracts from all theme files the .hbs files.
 */
const extractTemplates = function extractTemplates(allFiles) {
    return _.reduce(allFiles, function (templates, entry) {
        // CASE: partials are added to `theme.partials`
        if (entry.file.match(/^partials[/\\]+(.*)\.hbs$/)) {
            return templates;
        }

        // CASE: we ignore any hbs files in assets/
        if (entry.file.match(/^assets[/\\]+(.*)\.hbs$/)) {
            return templates;
        }

        const tplMatch = entry.file.match(/(.*)\.hbs$/);
        if (tplMatch) {
            templates.push(tplMatch[1]);
        }
        return templates;
    }, []);
};

/**
 * Normalizes a raw file entry into the canonical theme.files shape. Computes
 * `ext` and `normalizedFile` when not supplied. `content` is only retained for
 * content-bearing files, matching the on-disk reader's output.
 */
const normalizeFileEntry = function normalizeFileEntry(entry) {
    const file = entry.file;
    const extMatch = file.match(/.*?(\.[0-9a-z]+$)/i);
    const normalized = {
        file,
        normalizedFile: entry.normalizedFile || normalizePath(file),
        ext: entry.ext !== undefined ? entry.ext : (extMatch !== null ? extMatch[1] : undefined),
        symlink: entry.symlink || false
    };

    if (typeof entry.content === 'string' && isContentFile(normalized)) {
        normalized.content = entry.content;
    }

    return normalized;
};

/**
 * Builds a complete theme object from an in-memory list of files. Each file is
 * `{file, content}` (relative path + UTF-8 string content). Extra fields
 * (ext, normalizedFile, symlink) are derived when absent.
 *
 * @param {string} themePath - name/path used for reporting (no disk access)
 * @param {Array<{file: string, content?: string, ext?: string, normalizedFile?: string, symlink?: boolean}>} rawFiles
 * @returns {Theme}
 */
const buildTheme = function buildTheme(themePath, rawFiles) {
    const files = rawFiles
        .filter(entry => !isIgnored(entry.file))
        .map(normalizeFileEntry);
    const allTemplates = extractTemplates(files);

    const theme = parseThemeFiles({
        path: themePath,
        files,
        templates: {
            all: allTemplates,
            custom: extractCustomTemplates(allTemplates)
        },
        // @TODO: there's no good reason to mix Object and Array formats.
        //        They should be unified and use the one that suits best.
        results: {
            pass: [],
            fail: {}
        }
    });

    if (!theme.customSettings) {
        theme.customSettings = {};
    }

    return theme;
};

module.exports = buildTheme;
module.exports.parseThemeFiles = parseThemeFiles;
module.exports.extractTemplates = extractTemplates;
module.exports.extractCustomTemplates = extractCustomTemplates;
module.exports.isContentFile = isContentFile;
module.exports.isIgnored = isIgnored;
module.exports.ignore = ignore;

/**
 * @typedef {Object} Theme
 * @param {string} path
 * @param {Object[]} files
 * @param {Object} templates
 * @param {Object[]} templates.all
 * @param {Object[]} templates.custom
 * @param {string[]} [partials]
 * @param {Object} helpers
 * @param {Object} results
 * @param {Object[]} results.pass
 * @param {Object} results.fail
 * @param {Object=} customSettings
 */
