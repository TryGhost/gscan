# GScan

Checks Ghost themes for errors, deprecations, best practices and looks to see which features are supported. 
Aims to generate a compatibility report and feature listing for themes.

## Usage

There are 3 ways to use gscan to validate your theme:

### 1. Web usage

Visit https://gscan.ghost.org and upload your zip to our online version of Gscan.

### 2. CLI usage

Install using yarn / npm:

`yarn global add gscan` /  `npm install -G gscan`

To run a local directory through the checks:

`gscan /path/to/theme/directory`

To run a local zip file through the checks:

`gscan /path/to/theme.zip -z`

### 3. Lib usage

Install using yarn/npm and then:

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

## Development

### Run

- Either dev mode: `yarn dev`
- Or standard server: `yarn start`
- View: http://localhost:2369

### Publish

(Core team only)

- `yarn ship`
- Or if you DGAF `yarn ship --yolo`  (skip yarn install, deploy local deps)

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
