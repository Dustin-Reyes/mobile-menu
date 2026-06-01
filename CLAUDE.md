# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Reference Documents

All project context and workflow rules live in dedicated docs — read these before starting any work:

- **[docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)** — Tech stack, commands, project structure, path aliases, config files, env vars, animation system, and critical reminders
- **[docs/DEV_WORKFLOW.md](docs/DEV_WORKFLOW.md)** — Full development workflow, AI rules, commit conventions, release process, and branching strategy

## Quick Reference

```bash
yarn install          # Install dependencies (no PnP — node-modules linker)
./dev.sh              # Start Vite dev server (port 5173)
yarn format           # Prettier — ALWAYS run before lint
yarn lint             # ESLint flat config
yarn test             # Jest unit/integration tests
yarn test:e2e         # Playwright E2E tests
yarn build            # Production build + Sentry sourcemaps
```

## Non-Negotiable Rules (enforced by DEV_WORKFLOW.md)

1. **Present a plan and get approval before writing any code**
2. **`yarn format && yarn lint` before every commit — no exceptions**
3. **Ask the developer to test in the browser before committing**
4. **Only commit after receiving explicit approval**
5. **Conventional commits always** — `feat(scope):`, `fix(scope):`, etc.

> For full rules, checkpoints, and phase-by-phase instructions see [docs/DEV_WORKFLOW.md](docs/DEV_WORKFLOW.md).
