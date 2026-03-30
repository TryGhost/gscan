# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GScan is a Ghost theme validation tool that checks themes for compatibility with different Ghost versions (v1-v6). It validates theme structure, Handlebars templates, package.json, assets, and Ghost-specific features.

This is a pnpm monorepo with two packages:
- `packages/gscan` — the published npm library and CLI
- `apps/web` — the web interface at https://gscan.ghost.org

## Essential Commands

### Testing
```bash
# Run all tests with coverage
pnpm test

# Run specific test file
NODE_ENV=testing npx vitest run packages/gscan/test/010-package-json.test.js

# Run specific test pattern
NODE_ENV=testing npx vitest run packages/gscan/test/030-assets.test.js packages/gscan/test/040-ghost-head-foot.test.js

# Debug mode testing
NODE_ENV=testing DEBUG=gscan:* npx vitest run packages/gscan/test/checker.test.js
```

### Development
```bash
# Dev server with debug output (port 2369)
pnpm dev  # Runs the web app with nodemon

# Production server
pnpm start  # Runs the web app

# Lint code
pnpm lint
pnpm lint -- --fix

# Full release process (core team)
pnpm --filter gscan ship
```

### CLI Usage
```bash
# Check theme directory
./packages/gscan/bin/cli.js /path/to/theme

# Check zip file
./packages/gscan/bin/cli.js -z /path/to/theme.zip

# Check for specific Ghost version
./packages/gscan/bin/cli.js /path/to/theme --v1  # Ghost 1.x
./packages/gscan/bin/cli.js /path/to/theme --v5  # Ghost 5.x
./packages/gscan/bin/cli.js /path/to/theme --canary  # Latest/canary
```

## Key Architecture Components

### Entry Points
- **packages/gscan/lib/index.js**: Main library exports (`check`, `checkZip`, `format`, `versions`)
- **packages/gscan/bin/cli.js**: CLI tool entry point
- **apps/web/app/index.js**: Web server for https://gscan.ghost.org

### Core Validation Flow
1. **packages/gscan/lib/checker.js**: Orchestrates all checks
   - Loads theme via `lib/read-theme.js` (directories) or `lib/read-zip.js` (zips)
   - Executes all checks from `lib/checks/` sequentially
   - Returns theme object with `results.pass/fail` arrays

2. **packages/gscan/lib/checks/**: Individual validation modules
   - Each exports async function: `(theme, options, themePath) => Promise`
   - Populates `theme.results.pass` or `theme.results.fail[code]`
   - Uses error codes like `GS010-PJ-NAME-REQ` (structured as GSXXX-CATEGORY-DETAIL)

3. **packages/gscan/lib/ast-linter/**: Handlebars template analysis
   - Parses `.hbs` files into AST
   - Runs rules to detect issues (deprecated helpers, unknown globals, etc.)
   - Marks used features for compatibility checking

### Error Code Structure
Error codes follow pattern: `GSXXX-YY-ZZZ`
- `GSXXX`: Check number (e.g., GS010 for package.json)
- `YY`: Category (e.g., PJ for package.json, ASSET for assets)
- `ZZZ`: Specific rule (e.g., NAME-REQ for name required)

### Version Specifications
Located in `packages/gscan/lib/specs/v1.js` through `v6.js`:
- `knownHelpers`: Valid Handlebars helpers
- `knownGlobals`: Valid global variables
- `rules`: Error definitions with levels (error/warning/recommendation)

## Testing Strategy

### Test Structure
- Tests in `packages/gscan/test/*.test.js` map to checks in `packages/gscan/lib/checks/*.js`
- Fixtures in `packages/gscan/test/fixtures/themes/` contain example themes
- Each fixture directory corresponds to a check number

### Test Utilities
```javascript
// packages/gscan/test/utils.js provides helpers
themePath('030-assets/valid')  // Returns fixture path
testCheck(theme, checkName, expectedFailCodes)  // Validates check results
```

### Assertions
New tests must use vitest's `expect` (available globally via `globals: true` in vitest config). Do not use `should` — it is legacy and being removed from the codebase. Existing tests still use `should` but should not be taken as a pattern to follow.

### Common Test Patterns
```javascript
// Testing a passing theme
const theme = await check(themePath('valid-theme'));
expect(theme.results.pass).toContain('GS010-PJ-REQ');

// Testing failures
const theme = await check(themePath('invalid-theme'));
expect(theme.results.fail['GS010-PJ-NAME-REQ']).toBeDefined();
```

## Debugging

Enable debug output with `DEBUG=gscan:*` environment variable:
- `gscan:checker`: Main checker flow
- `gscan:ast-linter`: Template parsing
- Individual checks have their own namespaces

## Key Implementation Details

### Theme Object Structure
```javascript
{
  name: 'theme-name',
  path: '/path/to/theme',
  files: [{file: 'index.hbs', content: '...'}],
  partials: [],
  helpers: {},
  results: {
    pass: ['GS001-RULE1', 'GS002-RULE2'],
    fail: {
      'GS010-PJ-NAME-REQ': {
        failures: [{ref: 'package.json'}],
        rule: 'Package.json name is required'
      }
    }
  }
}
```

### Custom Theme Settings
Themes can define custom settings in package.json:
- Max 20 settings allowed
- Types: `select`, `boolean`, `color`, `image`, `text`
- Must use snake_case naming
- Visibility conditions supported in v5+

### Output Formatting
`packages/gscan/lib/format.js` transforms results for different outputs:
- CLI: Converts HTML tags to terminal colors
- Web: Maintains HTML formatting
- Calculates compatibility scores via `packages/gscan/lib/utils/score-calculator.js`

## Adding New Rules/Checks

### Quick Guide for Adding a New Check

1. **Create the check file** in `packages/gscan/lib/checks/XXX-check-name.js`:
   ```javascript
   const checkSomething = function (theme, options) {
       // Your check logic
       if (failed) {
           theme.results.fail['GSXXX-ERROR-CODE'] = {
               failures: [{ref: 'file.hbs', message: 'Error message'}],
               fatal: true  // if it's a critical error
           };
       } else {
           theme.results.pass.push('GSXXX-ERROR-CODE');
       }
       return theme;
   };
   module.exports = checkSomething;
   ```

2. **Add the rule definition** to ALL version specs that need it (`packages/gscan/lib/specs/v1.js` through `v6.js`):
   ```javascript
   'GSXXX-ERROR-CODE': {
       level: 'error',  // or 'warning', 'recommendation'
       fatal: true,     // optional, for critical errors
       rule: 'Short description',
       details: oneLineTrim`Detailed explanation with <code>examples</code>`
   }
   ```

3. **Create test fixtures** in `packages/gscan/test/fixtures/themes/XXX-check-name/`:
   - Create subdirectories for different test scenarios
   - Each should have a minimal theme structure with `package.json` and relevant files

4. **Write tests** in `packages/gscan/test/XXX-check-name.test.js`:
   ```javascript
   const checkSomething = require('../lib/checks/XXX-check-name');
   describe('XXX Check name', function () {
       it('should detect the issue', async function () {
           const output = await utils.testCheck(checkSomething, 'XXX-check-name/failing-case');
           expect(output.results.fail['GSXXX-ERROR-CODE']).toBeDefined();
       });
   });
   ```

5. **Update checker test expectations** in `packages/gscan/test/checker.test.js`:
   - Add 1 to the pass array length count for each version
   - Add the new rule code to the exact position in the pass arrays (they're alphabetically sorted)
   - Run tests to see where the rule should be positioned

### Important Notes When Adding Rules

- **Check files are auto-loaded**: Any `.js` file in `packages/gscan/lib/checks/` is automatically executed by the checker
- **Rule codes are alphabetically sorted** in test expectations
- **All versions need the rule definition** even if the check runs for all versions - otherwise `packages/gscan/lib/format.js` will fail with "Cannot read properties of undefined (reading 'level')"
- **Use require('common-tags/lib/oneLineTrim')** for multi-line rule details in specs
- **AST-based checks** should go in `packages/gscan/lib/ast-linter/rules/` and be called from a check file
- **The check function signature** is always `(theme, options, themePath) => Promise<theme>` where options may be unused

### Common Gotchas

1. **Missing rule in specs**: If you get `Cannot read properties of undefined (reading 'level')` errors, the rule definition is missing from one or more version specs
2. **Test array counts**: The checker tests have exact counts of pass results - you must update these when adding new rules
3. **Alphabetical ordering**: The pass results are sorted, so GSXXX codes must be inserted in the correct position in test arrays
4. **Partial path normalization**: Use `normalizePath()` from `packages/gscan/lib/utils` to handle Windows vs Unix path separators
5. **Check options parameter**: Even if unused, keep the `options` parameter in the function signature and add `// eslint-disable-line no-unused-vars`
