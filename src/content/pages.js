/**
 * Local page content
 *
 * All content is organized by page, then by locale.
 * Add a new locale key to each page to support additional languages.
 * If a requested locale is missing, the content service falls back to 'en'.
 *
 * To add a new language:
 *   1. Add the locale key here (e.g., `de: { title: '...' }`)
 *   2. Add the locale to `src/config/i18n.js` availableLanguages
 *   3. Add a locale JSON file at `src/i18n/locales/de.json` for UI strings
 *
 * When Firebase CMS is enabled, these values serve as defaults until
 * an admin updates the content via the /admin dashboard.
 */

export const pages = {
  home: {
    en: {
      title: 'Titan Demo',
      subtitle: 'Licensed, insured, and built for the job before the job.',
      learnMore: 'Learn More',
      getQuote: 'Get a Free Quote',
      copyright: '© 2026 Titan Demo.',
    },
    es: {
      title: 'Titan Demo',
      subtitle: 'Con licencia, asegurado y listo para el trabajo.',
      learnMore: 'Saber Más',
      getQuote: 'Obtener Cotización',
      copyright: '© 2026 Titan Demo.',
    },
  },
};
