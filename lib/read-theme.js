const fs = require('fs/promises');
const _ = require('lodash');
const os = require('os');
const path = require('path');
const ASTLinter = require('./ast-linter');
const {normalizePath, pathEscapesRoot} = require('./utils');

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

const linter = new ASTLinter({
    partials: [],
    helpers: []
});

const readThemeStructure = async function readThemeFiles(themePath, subPath, arr) {
    themePath = path.resolve(path.join(themePath, '.'));
    subPath = subPath || '';

    const tmpPath = os.tmpdir();
    const inTmp = themePath.substr(0, tmpPath.length) === tmpPath;

    arr = arr || [];

    const makeResult = function makeResult(result, subFilePath, ext, symlink) {
        result.push({
            file: subFilePath,
            normalizedFile: normalizePath(subFilePath),
            ext,
            symlink
        });
        return result;
    };

    const files = await fs.readdir(themePath, {withFileTypes: true});
    let result = arr;

    for (const dirent of files) {
        const file = dirent.name;
        const extMatch = file.match(/.*?(\.[0-9a-z]+$)/i);
        const subFilePath = path.join(subPath, file);

        // CASE: guard against path traversal - `newPath` must resolve to
        // somewhere inside `themePath`. `file` normally comes from a real
        // directory entry (`fs.readdir`), which can't itself escape its
        // listing directory, but this is cheap defense-in-depth against any
        // path-like value (e.g. an unexpected `..` segment) reaching the
        // filesystem calls below unchecked.
        const newPath = path.resolve(themePath, file);
        if (pathEscapesRoot(themePath, newPath)) {
            throw new Error(`Refusing to access path outside of theme directory: ${file}`);
        }

        /**
         * don't process ignored paths, remove target file
         *
         * @TODO:
         * - gscan extracts the target zip into a tmp directory
         * - if you use gscan with `keepExtractedDir` the caller (Ghost) will use the tmp folder with the deleted ignore files
         * - what we don't support right now is to delete the ignore files from the zip
         */
        if (ignore.indexOf(file) > -1) {
            if (inTmp) {
                await fs.rm(newPath, {recursive: true, force: true});
            }
            continue;
        }

        if (dirent.isDirectory()) {
            result = await readThemeStructure(newPath, subFilePath, result);
        } else {
            result = makeResult(result, subFilePath, extMatch !== null ? extMatch[1] : undefined, dirent.isSymbolicLink());
        }
    }

    return result;
};

/**
 *
 * @param {Theme} theme
 * @returns {Promise<Theme>}
 */
const readFiles = async function readFiles(theme) {
    const themeFilesContent = _.filter(theme.files, function (themeFile) {
        // CASE: never read the content of a symlinked entry - fs.readFile()
        // follows symlinks, so a symlink pointing outside the theme directory
        // would bypass the containment check below entirely. Symlinks are
        // always fatal for a theme (GS030-ASSET-SYM), so skipping their
        // content here costs nothing and closes that gap.
        if (themeFile && themeFile.ext && !themeFile.symlink) {
            return themeFile.ext.match(/\.hbs|\.css|\.js/ig) || themeFile.file.match(/package.json/i);
        }
    });

    // Setup a partials array
    theme.partials = [];

    // Setup the helper object
    theme.helpers = {};

    const themeRoot = path.resolve(theme.path);

    // CASE: we need the actual content of all css, hbs files, and package.json for our checks
    await Promise.all(themeFilesContent.map(async (themeFile) => {
        // CASE: guard against path traversal - `targetPath` must resolve to
        // somewhere inside `themeRoot`, see the matching check in
        // readThemeStructure() above.
        const targetPath = path.resolve(themeRoot, themeFile.file);
        if (pathEscapesRoot(themeRoot, targetPath)) {
            throw new Error(`Refusing to access path outside of theme directory: ${themeFile.file}`);
        }

        const content = await fs.readFile(targetPath, 'utf8');
        themeFile.content = content;

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
    }));

    return theme;
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
 *
 * @param {string} themePath - path to the validated theme
 * @returns {Promise<Theme>}
 */
module.exports = async function readTheme(themePath) {
    const themeFiles = await readThemeStructure(themePath);
    const allTemplates = extractTemplates(themeFiles);

    return readFiles({
        path: themePath,
        files: themeFiles,
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
};

module.exports._private = {readFiles, readThemeStructure};

/**
 * @typedef {Object} Theme
 * @param {string} path
 * @param {string[]} files
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
