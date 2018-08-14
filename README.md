# GScan

GScan is a tool for validating Ghost themes. It produces detailed reports of issues where themes need to be modified in order to be compatible with a specific version.
GScan is actively capable of dealing with the current and last major versions of Ghost (so at the time of writing v2 and v1).
GScan works on a system of rules. Each rule has a way to check whether it passes or fails and has help content which describes how to fix it. Each rule is also marked with an error level:

- **recommendation** = these are things the dev might want to know about
- **warning** = usually used for deprecations, things that will be errors in the next version
- **error** = anything that makes the theme invalid or incompatible with the current version of Ghost

In addition, an **error** can be marked as **fatal**. A **fatal error** means, left unchecked a Ghost publication would throw 500 errors on certain pages because of the detected out-of-date or erroneous code. 

In Ghost, we call GScan on boot. If any fatal errors are detected, the blog will not boot. In Ghost(Pro) and in Ghost-CLI we call GScan as part of major upgrades. The upgrade will not be allowed to continue if any fatal errors are detected.

Errors are only be marked as **fatal errors** if they would cause errors, and therefore should block a boot or an upgrade.

## Usage

There are 3 ways to use gscan to validate your theme:

### 1. Web usage

Visit https://gscan.ghost.org and upload your zip to our online version of Gscan.

### 2. CLI usage

Install using yarn / npm:

`yarn global add gscan` /  `npm install -g gscan`

To run a local directory through the checks:

`gscan /path/to/theme/directory`

To run a local zip file through the checks:

`gscan /path/to/theme.zip -z`

You can also pass a version. Currently supported is `--v1` or `-1`, which will check the theme
for 1.0.0 requirements. By default, GScan will always check for the latest version:

`gscan /path/to/theme.zip -z1`

or

`gscan /path/to/theme/directory --v1`

### 3. Lib usage

Install using yarn/npm and then:

```js
var gscan = require('gscan');

gscan.checkZip({
    path: 'path-to-zip',
    // if you need to check the theme for a different
    // major Ghost version, you can pass it. Currently
    // v1, which is Ghost 1.0 is supported. Default is
    // the latest Ghost version 2.0:
    // checkVersion: 'v1',
    name: 'my-theme'
}).then(function (result) {
    console.log(result);
}).catch(function(err) {
    console.log(err);
});
```

## Development

### Run

- Either dev mode: `yarn dev`
- Or standard server: `yarn start`
- View: http://localhost:2369

### Publish

(Core team only)

- `yarn ship`

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

Copyright (c) 2014-2018 Ghost Foundation - Released under the [MIT license](LICENSE). Ghost and the Ghost Logo are trademarks of Ghost Foundation Ltd. Please see our [trademark policy](https://ghost.org/trademark/) for info on acceptable usage.
