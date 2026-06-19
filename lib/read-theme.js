const fs = require('fs/promises');
const _ = require('lodash');
const os = require('os');
const path = require('path');
const buildTheme = require('./build-theme');
const {normalizePath} = require('./utils');
const {parseThemeFiles, extractTemplates, extractCustomTemplates, isContentFile, ignore} = buildTheme;

const readThemeStructure = function readThemeFiles(themePath, subPath, arr) {
    themePath = path.join(themePath, '.');
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

    return fs.readdir(themePath, {withFileTypes: true}).then(function (files) {
        let result = arr;

        return files.reduce(function (promise, dirent) {
            return promise.then(function () {
                const file = dirent.name;
                const extMatch = file.match(/.*?(\.[0-9a-z]+$)/i);
                const subFilePath = path.join(subPath, file);
                const newPath = path.join(themePath, file);

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
                        ? fs.rm(newPath, {recursive: true, force: true})
                            .then(function () {
                                return result;
                            })
                        : Promise.resolve(result);
                }

                if (dirent.isDirectory()) {
                    return readThemeStructure(newPath, subFilePath, result)
                        .then((updatedResult) => {
                            result = updatedResult;
                        });
                } else {
                    result = makeResult(result, subFilePath, extMatch !== null ? extMatch[1] : undefined, dirent.isSymbolicLink());
                    return Promise.resolve();
                }
            });
        }, Promise.resolve()).then(() => result);
    });
};

/**
 * Reads the content for the content-bearing files in `theme` from disk and
 * then parses them. The IO is kept separate from parsing (parseThemeFiles in
 * build-theme.js) so the filesystem-free parsing can be shared with the
 * in-memory readers (checkBuffer / checkFiles).
 *
 * @param {Theme} theme
 * @returns {Promise<Theme>}
 */
const readFiles = function readFiles(theme) {
    const themeFilesContent = _.filter(theme.files, isContentFile);

    // CASE: we need the actual content of all css, hbs files, and package.json for our checks
    return Promise.all(themeFilesContent.map((themeFile) => {
        return fs.readFile(path.join(theme.path, themeFile.file), 'utf8').then(function (content) {
            themeFile.content = content;
        });
    })).then(() => parseThemeFiles(theme));
};

/**
 *
 * @param {string} themePath - path to the validated theme
 * @returns {Promise<Theme>}
 */
module.exports = function readTheme(themePath) {
    return readThemeStructure(themePath)
        .then(function (themeFiles) {
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
        });
};

module.exports._private = {readFiles};

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
