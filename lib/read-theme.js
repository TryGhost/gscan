var Promise = require('bluebird'),
    _       = require('lodash'),
    hbs     = require('express-hbs'),
    path    = require('path'),
    pfs     = require('./promised-fs'),

    ignore = ['node_modules', 'bower_components', '.DS_Store', '.git', 'Thumbs.db'],
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

readHbsFiles = function readHbsFiles(themePath, themeFiles) {
    return Promise.map(_.where(themeFiles, {ext: '.hbs'}), function (themeFile) {
        return pfs.readFile(path.join(themePath, themeFile.file), 'utf8').then(function (content) {
            themeFile.content = content;
            try {
                themeFile.compiled = hbs.handlebars.precompile(content);
            } catch (e) {
                // TODO: Do something with this error
            }
        });
    }).then(function () {
        return themeFiles;
    });

};

module.exports = function readTheme(themePath) {
    return readThemeStructure(themePath).then(function (themeFiles) {
        return readHbsFiles(themePath, themeFiles);
    });
};
