/**
 * Internationalisation configuration.
 *
 * Defines the default language, available locales, language-detection
 * strategy, and i18next runtime options. Consumed by `src/i18n/index.js`
 * to initialise i18next.
 *
 * Customise `availableLanguages` and `defaultLanguage` when scaffolding a
 * new project.
 *
 * @module config/i18n
 */

/**
 * Full i18n configuration object.
 *
 * @type {{
 *   enabled: boolean,
 *   defaultLanguage: string,
 *   availableLanguages: Record<string, { name: string, nativeName: string, flag: string }>,
 *   detection: { order: string[], caches: string[], lookupLocalStorage: string },
 *   load: string,
 *   cleanCode: boolean,
 *   debug: boolean,
 *   seo: { generateHrefLang: boolean, defaultTitle: string, defaultDescription: string },
 *   namespaces: string[],
 *   defaultNS: string,
 *   interpolation: { escapeValue: boolean }
 * }}
 */
export const i18nConfig = {
  // Enable/disable i18n entirely
  enabled: true,

  // Default language (must match one of the available languages)
  defaultLanguage: 'en',

  // Available languages for your application
  // Format: { code: { name: 'English', nativeName: 'English', flag: '🇺🇸' } }
  availableLanguages: {
    en: {
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
    },
  },

  // Language detection strategy
  // Order matters - first match wins
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },

  // Performance settings
  load: 'languageOnly', // 'languageOnly' or 'languageRegion'
  cleanCode: true, // Clean language codes (e.g., 'en-US' -> 'en')

  // Debug mode (shows console logs in development)
  debug: process.env.NODE_ENV === 'development',

  // SEO settings
  seo: {
    // Generate hreflang tags automatically
    generateHrefLang: true,

    // Default SEO meta tags
    defaultTitle: 'your-project-name',
    defaultDescription: 'Your project description.',
  },

  // Namespace configuration (for organizing translations)
  namespaces: ['translation'],
  defaultNS: 'translation',

  // Interpolation settings
  interpolation: {
    escapeValue: false, // React already escapes values
  },
};

// Export individual settings for easier imports
export const { enabled, defaultLanguage, availableLanguages, detection, seo } =
  i18nConfig;
