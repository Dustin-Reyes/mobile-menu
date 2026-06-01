import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';

// Available languages configuration
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

// Default language
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
