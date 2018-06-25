var Promise = require('bluebird'),
    _ = require('lodash'),
    os = require('os'),
    hbs = require('express-hbs'),
    path = require('path'),
    pfs = require('./promised-fs'),

    ignore = ['node_modules', 'bower_components', '.DS_Store', '.git', '.svn', 'Thumbs.db'],
    readHbs = hbs.create(),
    readThemeStructure,
    extractTemplates,
    extractCustomTemplates,
    readHbsFiles,
    processHelpers;

readThemeStructure = function readThemeFiles(themePath, subPath, arr) {
    themePath = path.join(themePath, '.');
    subPath = subPath || '';

    var tmpPath = os.tmpdir(),
        inTmp = themePath.substr(0, tmpPath.length) === tmpPath;

    arr = arr || [];

    var makeResult = function makeResult(result, subFilePath, ext) {
        result.push({
            file: subFilePath,
            ext: ext
        });
        return result;
    };

    return pfs.readDir(themePath).then(function (files) {
        return Promise.reduce(files, function (result, file) {
            var extMatch = file.match(/.*?(\.[0-9a-z]+$)/i),
                subFilePath = path.join(subPath, file),
                newPath = path.join(themePath, file);

            /**
             * don't process ignored paths, remove target file
             *
             * @TODO:
             * - gscan extracts the target zip into a tmp directory
             * - if you use gscan with `keepExtractedDir` the caller (Ghost) will use the tmp folder with the deleted ignore files
             * - what we don't support right now is to delete the ignore files from the zip
             */
            if (ignore.indexOf(file) > -1) {
                return inTmp
                    ? pfs.remove(newPath)
                        .then(function () {
                            return result;
                        })
                    : result;
            }

            // NOTE: lstat does not follow symlinks
            return pfs.lstatFile(newPath).then(function (statFile) {
                if (statFile.isDirectory()) {
                    return readThemeStructure(newPath, subFilePath, result);
                } else {
                    return makeResult(result, subFilePath, extMatch !== null ? extMatch[1] : undefined);
                }
            });
        }, arr);
    });
};

readHbsFiles = function readHbsFiles(theme) {
    // Setup a partials array
    theme.partials = [];

    return Promise.map(_.filter(theme.files, {ext: '.hbs'}), function (themeFile) {
        return pfs.readFile(path.join(theme.path, themeFile.file), 'utf8').then(function (content) {
            var partialMatch = themeFile.file.match(/^partials[/\\]+(.*)\.hbs$/);
            themeFile.content = content;

            try {
                themeFile.compiled = readHbs.handlebars.precompile(content);
            } catch (error) {
                // This error is caught and handled in the template-compile check
            }

            // If this is a partial, put the partial name in the partials array
            if (partialMatch) {
                theme.partials.push(partialMatch[1]);
            }

            processHelpers(theme, themeFile);
        });
    }).then(function () {
        return theme;
    });
};

processHelpers = function (theme, themeFile) {
    var helperRegex = /helpers(\.|\[')([a-z0-9_-]+)/gmi,
        helperName,
        match;

    theme.helpers = theme.helpers || {};

    while ((match = helperRegex.exec(themeFile.compiled)) !== null) {
        helperName = match[2];

        if (theme.helpers[helperName]) {
            theme.helpers[helperName].push(themeFile.file);
        } else {
            theme.helpers[helperName] = [themeFile.file];
        }
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
extractCustomTemplates = function extractCustomTemplates(allTemplates) {
    var toReturn = [],
        generateName = function generateName(templateName) {
            var name = templateName;

            name = name.replace(/^post-|page-|custom-/, '');
            name = name.replace(/-/g, ' ');
            name = name.replace(/\b\w/g, function (letter) {
                return letter.toUpperCase();
            });

            return name.trim();
        },
        generateFor = function (templateName) {
            if (templateName.match(/^page-/)) {
                return ['page'];
            }

            if (templateName.match(/^post-/)) {
                return ['post'];
            }

            return ['page', 'post'];
        },
        generateSlug = function (templateName) {
            if (templateName.match(/^custom-/)) {
                return null;
            }

            return templateName.match(/^(page-|post-)(.*)/)[2];
        };

    _.each(allTemplates, function (templateName) {
        if (templateName.match(/^post-|page-|custom-/) && !templateName.match(/\//)) {
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
extractTemplates = function extractTemplates(allFiles) {
    return _.reduce(allFiles, function (templates, entry) {
        // CASE: partials are added to `theme.partials`
        if (entry.file.match(/^partials[/\\]+(.*)\.hbs$/)) {
            return templates;
        }

        // CASE: we ignore any hbs files in assets/
        if (entry.file.match(/^assets[/\\]+(.*)\.hbs$/)) {
            return templates;
        }

        var tplMatch = entry.file.match(/(.*)\.hbs$/);
        if (tplMatch) {
            templates.push(tplMatch[1]);
        }
        return templates;
    }, []);
};

module.exports = function readTheme(themePath) {
    return readThemeStructure(themePath)
        .then(function (themeFiles) {
            var allTemplates = extractTemplates(themeFiles);

            return readHbsFiles({
                path: themePath,
                files: themeFiles,
                templates: {
                    all: allTemplates,
                    custom: extractCustomTemplates(allTemplates)
                },
                results: {
                    pass: [],
                    fail: {}
                }
            });
        });
};
