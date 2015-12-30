# Ghost Theme Check

Checks Ghost themes for errors, deprecations, best practices and looks to see which features are supported. 
Aims to generate a compatibility report and feature listing for themes.

To install:

`npm install ghost-theme-check`

## CLI usage

To run a local directory through the checks:

`gtc /path/to/theme/directory`

To run a local zip file through the checks:

`gtc /path/to/theme.zip -z`

## Web usage

You can run a web interface for uploading a zip file:

`node server.js`

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
