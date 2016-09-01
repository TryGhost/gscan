var Promise = require('bluebird'),
    _       = require('lodash'),
    hbs     = require('express-hbs'),
    path    = require('path'),
    pfs     = require('./promised-fs'),

    ignore  = ['node_modules', 'bower_components', '.DS_Store', '.git', 'Thumbs.db'],
    readHbs = hbs.create(),
    readThemeStructure,
    readHbsFiles;

readThemeStructure = function readThemeFiles(themePath, subPath, arr) {
    subPath = subPath || '';
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
            var extMatch = file.match(/.*?(\..+$)/),
                subFilePath = path.join(subPath, file),
                newPath;

            // Don't process ignored paths
            if (ignore.indexOf(file) > -1) {
                return result;
            }

            // If it has an extension, treat it as a file
            if (extMatch) {
                return makeResult(result, subFilePath, extMatch[1]);
            } else {
                newPath = path.join(themePath, file);
                return pfs.statFile(newPath).then(function (statFile) {
                    if (statFile.isDirectory()) {
                        return readThemeStructure(newPath, subFilePath, result);
                    } else {
                        return makeResult(result, subFilePath);
                    }
                });
            }
        }, arr);
    });
};

readHbsFiles = function readHbsFiles(theme) {
    // Setup a partials array
    theme.partials = [];

    return Promise.map(_.where(theme.files, {ext: '.hbs'}), function (themeFile) {
        return pfs.readFile(path.join(theme.path, themeFile.file), 'utf8').then(function (content) {
            var partialMatch = themeFile.file.match(/^partials[\/\\]+(.*)+\.hbs$/);
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

module.exports = function readTheme(themePath) {
    return readThemeStructure(themePath).then(function (themeFiles) {
        var theme = {
            path: themePath,
            files: themeFiles,
            results: {
                pass: [],
                fail: {}
            }
        };
        return readHbsFiles(theme);
    });
};
