# AGENTS.md

## Purpose

GScan validates Ghost themes for compatibility with Ghost versions v1-v6. It can run as:
- A library (`packages/gscan/lib/index.js`)
- A CLI (`packages/gscan/bin/cli.js`)
- A web app (`apps/web/app/index.js`)

## Tech Stack

- Node.js (supported: `^20.19.0 || ^22.13.1 || ^24.0.0`)
- CommonJS modules
- pnpm monorepo
- Vitest with V8 coverage
- ESLint for linting

## Quick Start

```bash
pnpm install
pnpm test
pnpm lint
```

Run local web server:

```bash
pnpm dev
# http://localhost:2369
```

Run CLI checks:

```bash
./packages/gscan/bin/cli.js /path/to/theme
./packages/gscan/bin/cli.js -z /path/to/theme.zip
./packages/gscan/bin/cli.js /path/to/theme --v6
```

## Repository Map

- `packages/gscan/lib/checker.js`: orchestrates loading theme input and running checks
- `packages/gscan/lib/checks/`: rule checks (auto-loaded)
- `packages/gscan/lib/ast-linter/`: Handlebars AST parser and rules
- `packages/gscan/lib/specs/v1.js` ... `packages/gscan/lib/specs/v6.js`: version-specific rule metadata
- `packages/gscan/lib/format.js`: transforms results for CLI/web output
- `packages/gscan/test/*.test.js`: tests for checks and core behavior
- `packages/gscan/test/fixtures/themes/`: fixture themes used by tests
- `apps/web/app/`: web interface for zip uploads

## Working Rules

- Keep implementations consistent with existing CommonJS style.
- Prefer minimal, targeted edits over broad refactors.
- Add or update tests for behavior changes.
- Run `pnpm test` and `pnpm lint` before finalizing significant changes.
- Do not change rule code identifiers unless explicitly requested; they are user-facing and versioned.

## Adding a New Check

1. Add check file in `packages/gscan/lib/checks/` (auto-loaded by checker).
2. Define corresponding rule metadata in each relevant version spec under `packages/gscan/lib/specs/`.
3. Add fixtures under `packages/gscan/test/fixtures/themes/`.
4. Add test coverage in `packages/gscan/test/*.test.js`.
5. Update any strict pass-count assertions in `packages/gscan/test/checker.test.js` if needed.

## Common Pitfalls

- Missing rule metadata in one spec can break formatting and test output.
- `packages/gscan/test/checker.test.js` contains exact expectations and may need synchronized updates.
- Path handling should remain cross-platform; reuse utilities in `packages/gscan/lib/utils/`.
