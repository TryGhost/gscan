# AGENTS.md

## Purpose

GScan validates Ghost themes for compatibility with Ghost versions v1-v6. It can run as:
- A library (`lib/index.js`)
- A CLI (`bin/cli.js`)
- A web app (`app/index.js`)

## Tech Stack

- Node.js (supported: `^20.11.1 || ^22.13.1 || ^24.0.0`)
- CommonJS modules
- Mocha + c8 for tests
- ESLint for linting

## Quick Start

```bash
yarn install
yarn test
yarn lint
```

Run local web server:

```bash
yarn dev
# http://localhost:2369
```

Run CLI checks:

```bash
./bin/cli.js /path/to/theme
./bin/cli.js -z /path/to/theme.zip
./bin/cli.js /path/to/theme --v6
```

## Repository Map

- `lib/checker.js`: orchestrates loading theme input and running checks
- `lib/checks/`: rule checks (auto-loaded)
- `lib/ast-linter/`: Handlebars AST parser and rules
- `lib/specs/v1.js` ... `lib/specs/v6.js`: version-specific rule metadata
- `lib/format.js`: transforms results for CLI/web output
- `test/*.test.js`: tests for checks and core behavior
- `test/fixtures/themes/`: fixture themes used by tests
- `app/`: web interface for zip uploads

## Working Rules

- Keep implementations consistent with existing CommonJS style.
- Prefer minimal, targeted edits over broad refactors.
- Add or update tests for behavior changes.
- Run `yarn test` and `yarn lint` before finalizing significant changes.
- Do not change rule code identifiers unless explicitly requested; they are user-facing and versioned.

## Adding a New Check

1. Add check file in `lib/checks/` (auto-loaded by checker).
2. Define corresponding rule metadata in each relevant version spec under `lib/specs/`.
3. Add fixtures under `test/fixtures/themes/`.
4. Add test coverage in `test/*.test.js`.
5. Update any strict pass-count assertions in `test/checker.test.js` if needed.

## Common Pitfalls

- Missing rule metadata in one spec can break formatting and test output.
- `test/checker.test.js` contains exact expectations and may need synchronized updates.
- Path handling should remain cross-platform; reuse utilities in `lib/utils/`.
