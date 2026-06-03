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
 * Run `yarn seed` to push this content to Firestore.
 */

export const pages = {
  home: {
    en: {
      badge: 'TranspiledCode Template',
      title: 'Your Headline Here',
      subtitle: 'Replace this with your tagline. Short, punchy, and on-brand.',
      ctaText: 'Get Started',
      ctaHref: '/',
    },
    es: {
      badge: 'Plantilla TranspiledCode',
      title: 'Tu Título Aquí',
      subtitle:
        'Reemplaza esto con tu eslogan. Corto, impactante y acorde a tu marca.',
      ctaText: 'Comenzar',
      ctaHref: '/',
    },
  },
  about: {
    en: {
      title: 'About',
      content: 'About page content goes here.',
    },
    es: {
      title: 'Acerca de',
      content: 'El contenido de la página de información va aquí.',
    },
  },
};
