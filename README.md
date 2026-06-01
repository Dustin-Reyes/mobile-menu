# transpiled-web-template

> Vite + React starter with the full TranspiledCode toolchain. Clone it, run `yarn setup`, and start building.

## Getting Started

1. **Use this template** — click "Use this template" on GitHub, or clone directly
2. **Install dependencies**
   ```bash
   yarn install
   ```
3. **Run setup** — configure the project for your client/product
   ```bash
   yarn setup
   ```
4. **Start developing**
   ```bash
   yarn dev
   ```
5. **When ready for production** — remove template scaffolding
   ```bash
   yarn cleanup
   ```

## Stack

- **Vite 6** + **React 18**
- **Emotion** — CSS-in-JS styling with design tokens
- **Radix UI** — accessible component primitives
- **Framer Motion** — animations and page transitions
- **Firebase** — Firestore CMS + Auth
- **i18next** — English + Spanish out of the box
- **Sentry** — production error tracking
- **Jest** (unit) + **Playwright** (E2E)
- **Netlify** — deployment

## Available Scripts

```bash
yarn dev           # Start dev server (port 5173)
yarn build         # Production build
yarn format        # Prettier (run before lint)
yarn lint          # ESLint
yarn test          # Jest unit tests
yarn test:e2e      # Playwright end-to-end tests
yarn setup         # Interactive project configuration
yarn cleanup       # Remove template scaffolding (irreversible)
yarn release       # Bump version + changelog via standard-version
```

## Project Structure

```
src/
  components/   — Shared UI components
  config/       — App configuration (project.js is populated by yarn setup)
  content/      — Local CMS content (fallback when Firebase is offline)
  context/      — React context providers
  dev/demo/     — Component showcase (removed by yarn cleanup)
  hooks/        — Custom React hooks
  i18n/         — i18next setup and locale files
  pages/        — Route-level page components
  services/     — API / Firebase / content service layer
  styles/       — Emotion design tokens and global styles
  utils/        — Pure utility functions
netlify/
  functions/    — Serverless functions
scripts/
  lib/          — Writer and cleanup helpers
  setup.mjs     — Interactive setup CLI
  cleanup.mjs   — Template removal CLI
docs/           — Project documentation
```

## After Setup

- `src/config/project.js` — re-run `yarn setup` to update
- `src/content/` — add your page content here (or manage via `/admin`)
- `src/i18n/locales/` — add your translation strings
- `public/` — add your favicon, og-image, and brand assets
- See `docs/` for guides on theming, animations, SEO, Firebase CMS, and i18n

## Template Scaffolding

`yarn cleanup` permanently removes:
- The component demo page (`/demo` route)
- `src/dev/demo/` component showcase
- `src/components/DemoWidget.jsx`, `ErrorTrigger.jsx`, `CodeBlock.jsx`
- The `scripts/` directory (setup + cleanup scripts)

Everything else — the full toolchain, all UI components, hooks, services — stays.
