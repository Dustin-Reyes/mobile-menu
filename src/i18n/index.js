/**
 * i18next initialisation and language constants.
 *
 * Configures i18next with the LanguageDetector and react-i18next plugins,
 * registers the English and Spanish translation resources, and exports
 * `AVAILABLE_LANGUAGES` and `DEFAULT_LANGUAGE` for use elsewhere.
 *
 * This module is imported once (side-effect) in `src/main.jsx` via
 * `import './i18n/index'`.
 *
 * @module i18n
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';

/**
 * Map of supported language codes to display metadata.
 *
 * @type {Record<string, { name: string, nativeName: string, flag: string }>}
 */
export const AVAILABLE_LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇲🇽',
  },
};

/**
 * BCP 47 language code used as the i18next fallback language.
 *
 * @type {string}
 */
export const DEFAULT_LANGUAGE = 'en';

// Resources object
const resources = {
  en: { translation: en },
  es: { translation: es },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: process.env.NODE_ENV === 'development',

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Namespace options
    defaultNS: 'translation',
    ns: ['translation'],

    // Performance options
    load: 'languageOnly', // Only load language, not region
    cleanCode: true, // Will be default in i18next v22
  });

export default i18n;
