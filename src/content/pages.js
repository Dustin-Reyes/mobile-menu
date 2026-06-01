/**
 * Local page content
 *
 * All content is organized by page, then by locale.
 * Add a new locale key to each page to support additional languages.
 * If a requested locale is missing, the content service falls back to 'en'.
 *
 * When Firebase CMS is enabled, these values serve as defaults until
 * an admin updates the content via the /admin dashboard.
 */

export const pages = {
  home: {
    en: {
      title: 'Your App',
      subtitle: 'Your tagline here.',
      copyright: '© 2026 Your Company.',
    },
    es: {
      title: 'Your App',
      subtitle: 'Tu eslogan aquí.',
      copyright: '© 2026 Your Company.',
    },
  },
};
