# GScan

Checks Ghost themes for errors, deprecations, best practices and looks to see which features are supported. 
Aims to generate a compatibility report and feature listing for themes.

To install:

`npm install gscan`

## CLI usage

To run a local directory through the checks:

`gscan /path/to/theme/directory`

To run a local zip file through the checks:

`gscan /path/to/theme.zip -z`

## Lib usage

```js
var gscan = require('gscan');

gscan.checkZip({
    path: 'path-to-zip',
    name: 'my-theme'
}).then(function (result) {
    console.log(result);
}).catch(function(err) {
    console.log(err);
});
```

## Web usage

You can run a web interface for uploading a zip file:

`node app/index.js` or `nodemon` or `npm start` or `MODE=long npm start`

Then navigate to `http://localhost:2369`, and use the form to upload your file

## Result types:

- Errors: these are issues which will cause your theme to not work properly. These must be fixed.
- Warnings: these are usually related to deprecated features. These should be fixed.
- Recommendations: these are advisories about best practice. Fixing these will improve your theme.
- Features: detected features which may impact on compatibility. Nothing to do :)

## Still To Do:

- Support for running the checks against a GitHub repository
- Many, many more checks
- Detailed advice for each check/result
- Compatibility report
- Feature listing

# Copyright & License

Copyright (c) 2014-2017 Ghost Foundation - Released under the [MIT license](LICENSE).
