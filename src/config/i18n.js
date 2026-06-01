// Internationalization Configuration
// Customize these settings for your project needs

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
    defaultTitle: 'Titan Demo - Residential & Commercial Demolition',
    defaultDescription:
      'Licensed, insured, and built for the job before the job. Titan Demo handles residential and commercial demolition.',
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
