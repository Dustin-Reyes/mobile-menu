# Project Context — transpiled-web-template

> **Purpose:** Project-specific technical reference for all AI assistants, tools, and developers.
> This is the single source of truth for what this project is, how it's structured, and how it works.
>
> - For **development workflow and process**, see [DEV_WORKFLOW.md](DEV_WORKFLOW.md)
> - For **Claude Code CLI guidance**, see [CLAUDE.md](../CLAUDE.md)

---

## Project Overview

**transpiled-web-template** is a production-ready SPA starter template built on Vite + React. It includes the full TranspiledCode toolchain: ESLint 9 flat config, Prettier, Jest (unit), Playwright (E2E), Sentry, Emotion, and Netlify deployment.

- **Tech**: Vite 6, React 18, `@emotion/styled`, `@sentry/react`
- **Tests**: Jest (unit/integration) + Playwright (E2E)
- **Deploy**: Netlify
- **Dev server**: `./dev.sh` (port 5173 by default)

---

## Development Commands

```bash
yarn install          # Install dependencies (no PnP — node-modules linker)
./dev.sh              # Start Vite dev server with QR code for mobile
yarn dev:logs         # Vite with visible stdout logs
```

### Code Quality (always in this order)

```bash
yarn format           # Prettier (ALWAYS FIRST)
yarn lint             # ESLint flat config
yarn lint:fix         # Auto-fix linting issues
```

### Testing

```bash
yarn test             # Jest unit/integration tests
yarn test:watch       # Jest in watch mode
yarn test:coverage    # Jest coverage report
yarn test:e2e         # Playwright E2E tests
yarn test:e2e:ui      # Playwright with interactive UI
yarn test:e2e:report  # Open last Playwright HTML report
```

### Building & Deploying

```bash
yarn build            # Vite production build + Sentry sourcemaps
yarn preview          # Preview production build locally
```

### Release

```bash
git checkout dev && git pull origin dev
yarn release            # Auto-detect bump from conventional commits
git push --follow-tags origin dev
gh pr create --base main --head dev --fill
```

---

## Project Structure

```
src/
  components/   — Shared UI components
  context/      — React context providers
  config/       — App configuration constants
  hooks/        — Custom React hooks
  pages/        — Route-level page components
  services/     — API / external service calls
  styles/       — Global styles (Emotion)
  utils/        — Pure utility functions
  assets/       — Static assets (images, icons)
tests/
  __mocks__/    — Jest asset/module mocks
  components/   — Component unit tests
  hooks/        — Hook unit tests
  utils/        — Utility unit tests
  e2e/          — Playwright end-to-end tests
netlify/
  functions/    — Serverless functions
docs/           — Project documentation
```

**Flat component structure** — no atoms/molecules/organisms hierarchy.

---

## Path Aliases

All aliases resolve from `src/`:

| Alias        | Resolves to       |
| ------------ | ----------------- |
| `@/`         | `src/`            |
| `components` | `src/components/` |
| `context`    | `src/context/`    |
| `config`     | `src/config/`     |
| `hooks`      | `src/hooks/`      |
| `pages`      | `src/pages/`      |
| `services`   | `src/services/`   |
| `styles`     | `src/styles/`     |
| `utils`      | `src/utils/`      |

---

## Key Configuration Files

| File                     | Purpose                        |
| ------------------------ | ------------------------------ |
| `vite.config.js`         | Vite build + dev server config |
| `eslint.config.mjs`      | ESLint 9 flat config           |
| `.prettierrc`            | Prettier formatting rules      |
| `jest.config.js`         | Jest unit test config          |
| `jest.babel.config.json` | Babel transform for Jest       |
| `jest.setup.js`          | Jest global mocks/setup        |
| `playwright.config.js`   | Playwright E2E config          |
| `netlify.toml`           | Netlify build + deploy config  |
| `.env.example`           | Environment variable template  |

---

## Environment Variables

Copy `.env.example` → `.env` and fill in values.

- `VITE_` prefix — exposed to browser (**no secrets here**)
- No prefix — Netlify Functions only (server-side, safe for secrets)

---

## State Management

This project uses **React Context API** for global state. Key contexts live in `src/context/`.

---

## Styling

**Emotion (`@emotion/styled`)** — CSS-in-JS. No CSS modules, no Tailwind.

- Theme tokens live in `src/styles/`
- Use theme tokens for colors, spacing, and typography — never hardcode values
- See [THEME.md](THEME.md) for full theme reference

---

## Animation System

See [ANIMATIONS.md](ANIMATIONS.md) for the full developer usage guide.

This project uses **Framer Motion** for page transitions, hero entrance animations, scroll-triggered section reveals, and button micro-interactions.

### `useAnimationConfig` hook (`src/hooks/useAnimationConfig.js`)

Central accessibility bridge. All animated components call this hook. Returns:

| Export             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `fadeIn`           | Opacity fade for page transitions (has `exit` variant) |
| `slideUp`          | Fade + translateY for hero children and stagger items  |
| `slideDown`        | Fade + negative translateY for header entrance         |
| `scaleIn`          | Fade + scale for modal-style reveals                   |
| `staggerContainer` | Variant config for parent that staggers children       |
| `buttonPress`      | `{ whileHover, whileTap }` spread for motion elements  |
| `prefersReduced`   | `boolean` — true when `prefers-reduced-motion: reduce` |

When `prefersReduced = true`: all `y`/`scale` values are `0` and `duration` is `0`. Opacity transitions are always preserved.

### Reusable animation components

- **`PageTransition`** (`src/components/PageTransition.jsx`) — Wrap route elements; used with `AnimatePresence` in `App.jsx`
- **`AnimatedSection`** (`src/components/AnimatedSection.jsx`) — `whileInView` scroll reveal wrapper; accepts optional `delay` prop
- **`MotionButton`** (`src/components/ui/MotionButton.jsx`) — Drop-in replacement for `Button` with press/hover scale micro-interactions

### Jest mock

`tests/__mocks__/framer-motion.js` replaces all `motion.*` elements and `motion(Component)` factory with plain HTML equivalents. Strips all animation props before passing to DOM. Wired in `jest.config.js` `moduleNameMapper` before CSS entries.

### Rule: preserve Radix CSS animations

CSS `@keyframes` and `data-state` animations on Radix primitives (Accordion, Dialog, DropdownMenu) are **intentionally preserved** — they rely on Radix's attribute-based state and CSS custom properties and must not be replaced with Framer Motion.

---

## Internationalization (i18n)

See [I18N_GUIDE.md](I18N_GUIDE.md) for full details.

- Content is locale-nested (e.g. `{ en: {...}, es: {...} }`)
- `yarn translate` seeds content files via MyMemory API
- In dev mode, translation calls go directly to MyMemory (no Netlify Dev required)

---

## CMS / Content

See [FIREBASE_CMS_SETUP.md](FIREBASE_CMS_SETUP.md) for setup.

- Firebase Firestore is used as the CMS backend
- Local content files in `src/content/` serve as fallback / dev mode
- `ContentService` abstracts Firebase vs local reads
- `usePage` hook exposes `updatePage` for editing

---

## Error Tracking

**Sentry** (`@sentry/react`) is integrated for production error tracking.

```javascript
import * as Sentry from '@sentry/react';

try {
  // code
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'ComponentName', action: 'actionName' },
    extra: { relevantData },
  });
}
```

---

## SEO

See [SEO_GUIDE.md](SEO_GUIDE.md) and [SEO_QUICK_SETUP.md](SEO_QUICK_SETUP.md) for full details.

---

## Critical Reminders

1. **Format before lint, always** — `yarn format && yarn lint`
2. **Never skip approval checkpoints** — planning and testing gates are mandatory (see [DEV_WORKFLOW.md](DEV_WORKFLOW.md))
3. **No PnP** — yarn is configured with `nodeLinker: node-modules`
4. **VITE\_ prefix for browser env vars** — never put secrets in `VITE_` vars
5. **Flat component structure** — no atoms/molecules/organisms hierarchy
6. **Theme tokens over hardcoded values** — always use Emotion theme tokens
7. **Preserve Radix CSS animations** — do not replace with Framer Motion
