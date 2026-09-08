# gscan

GScan is a tool for validating Ghost themes. It produces detailed reports of issues where themes need to be modified in order to be compatible with a specific version of Ghost.

It is actively capable of dealing with the current and last major versions of Ghost (v1-v6).

GScan works on a system of rules. Each rule has a way to check whether it passes or fails and has help content which describes how to fix it. Each rule is also marked with an error level:

- Errors: issues that will cause your theme to not work properly. These must be fixed.
- Warnings: these are usually related to deprecated features. These should be fixed.
- Recommendations: these are advisories about best practice. Fixing these will improve your theme.
- Features: detected features which may impact on compatibility. Nothing to do!

In addition, an **error** can be marked as **fatal**. A **fatal error** means, left unchecked a Ghost publication would throw 500 errors on certain pages because of the detected out-of-date or erroneous code.

This package is the library and CLI. There is also a hosted web version at https://gscan.ghost.org, and GScan comes pre-installed in Ghost itself.

## CLI usage

Install globally:

```
npm install -g gscan
```

To run a local directory through the checks:

`gscan /path/to/theme/directory`

To run a local zip file through the checks:

`gscan /path/to/theme.zip -z`

By default, GScan scans themes for the latest Ghost version compatibility. You can also specify a Ghost version by using the following parameters (for Ghost 1.0, 2.0, 3.0, 4.0, 5.0 and 6.0):

`--v1` or `-1`
`--v2` or `-2`
`--v3` or `-3`
`--v4` or `-4`
`--v5` or `-5`
`--v6` or `-6` (default) or `--canary`

Examples:

`gscan /path/to/theme.zip -z -1` - scan a theme in a zip file for Ghost 1.0 compatibility
`gscan /path/to/theme/directory --v2` - scan a theme in a directory for Ghost 2.0 compatibility
`gscan /path/to/theme/directory` - scan a theme for Ghost 6.0 compatibility

## Lib usage

```js
var gscan = require('gscan');

gscan.checkZip({
    path: 'path-to-zip',
    // Pass in a folder to check
    // if you need to check the theme for a different
    // major Ghost version, you can pass it. Currently
    // v1, v2, v3, v4, v5 and v6 are supported. Default is
    // the latest Ghost version 6.0:
    // checkVersion: 'v6',
    name: 'my-theme'
}).then(function (result) {
    console.log(result);
}).catch(function(err) {
    console.log(err);
});
```

## Development

This package lives in the [TryGhost/gscan](https://github.com/TryGhost/gscan) monorepo. See the [repository README](https://github.com/TryGhost/gscan#readme) for development and release instructions.

# Copyright & License

Copyright (c) 2013-2026 Ghost Foundation - Released under the [MIT license](LICENSE). Ghost and the Ghost Logo are trademarks of Ghost Foundation Ltd. Please see our [trademark policy](https://ghost.org/trademark/) for info on acceptable usage.
