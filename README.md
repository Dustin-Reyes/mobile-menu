# Titan Demo

Production-ready SPA starter for TranspiledCode projects. This template provides a complete development toolchain with React, Vite, testing, CI/CD, and deployment pre-configured.

> **🚀 Starting a new project?** Go to **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** for the complete setup guide.

---

## Quick Overview

### What's Included

- **React 18** with modern hooks and patterns
- **Vite 6** for fast development and building
- **Emotion** for styled-components
- **React Router** for navigation
- **Comprehensive SEO** with meta tags, Open Graph, and structured data
- **Jest** for unit testing
- **Playwright** for E2E testing
- **ESLint + Prettier** for code quality
- **Sentry** for error monitoring
- **Netlify** for hosting and functions
- **GitHub Actions** for CI/CD

### Prerequisites

- Node.js >= 23.10.0
- Yarn 4.x (via Corepack)
- GitHub CLI
- Git with SSH access to GitHub

### Quick Start (Existing Projects)

```bash
git clone git@github.com:TranspiledCode/your-project.git your-project
cd your-project
yarn install                         # Install dependencies
yarn setup-prereqs                    # Check compatibility
yarn setup                            # Make scripts executable
yarn dev                              # Start development
```

---

## Documentation

- **[Getting Started](docs/GETTING_STARTED.md)** - Complete setup guide for new projects
- **[Project Context](docs/PROJECT_CONTEXT.md)** - Tech stack, structure, commands, and project-specific rules
- **[Development Workflow](docs/DEV_WORKFLOW.md)** - Team development process and standards
- **[SEO Guide](docs/SEO_GUIDE.md)** - Comprehensive SEO implementation and customization guide
- **[Project Structure](#project-structure)** - How the codebase is organized

---

## Project Structure

```
titan-demo/
├── src/
│   ├── components/       Shared UI components
│   ├── pages/            Route-level page components
│   ├── hooks/            Custom React hooks
│   ├── utils/            Pure utility functions
│   └── styles/           Global styles (Emotion)
├── tests/
│   ├── components/       Component unit tests
│   └── e2e/              Playwright end-to-end tests
├── docs/
    ├── GETTING_STARTED.md
    └── DEV_WORKFLOW_INSTRUCTIONS.md
```

---

## 🚀 Key Features

### SEO Optimization

- **Interactive setup script** - Run `yarn seo:setup` for guided configuration
- **Automatic meta tags** for all pages with proper titles and descriptions
- **Open Graph and Twitter Cards** for social media sharing
- **JSON-LD structured data** for rich snippets in search results
- **Dynamic sitemap generation** with all your pages
- **Comprehensive robots.txt** for search engine crawling
- **Template-friendly configuration** - easy to customize for any project
- **Environment-aware settings** - different configs for dev/staging/production

### Developer Experience

- **Hot Module Replacement** with Vite
- **Component library** with 15+ pre-built components
- **Dark/light theme** support with smooth transitions
- **Toast notifications** for user feedback
- **Error boundaries** for graceful error handling
- **Comprehensive testing** with Jest and Playwright

### Production Ready

- **Optimized build** with code splitting and tree shaking
- **PWA support** with manifest and service worker
- **Sentry integration** for error monitoring
- **GitHub Actions** for automated CI/CD
- **Netlify deployment** ready

---

## License

MIT
