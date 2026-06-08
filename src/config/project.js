/**
 * Project-wide configuration constants.
 *
 * Contains branding, URLs, SEO defaults, per-page metadata, analytics IDs,
 * and feature/security/performance flags. Values are merged with
 * environment-specific overrides returned by `getEnvOverrides()`.
 *
 * Run `yarn setup` to populate this file with real project values.
 *
 * @module config/project
 */

/**
 * Master project configuration object.
 *
 * @type {Object}
 */
export const PROJECT_CONFIG = {
  name: 'your-project-name',
  description: 'Your project description.',

  url: {
    production: 'https://yourproject.com',
    development: 'http://localhost:5173',
    staging: '',
  },

  organization: {
    name: 'Your Company',
    url: 'https://yourproject.com',
    logo: 'https://yourproject.com/logo.png',
    description: 'Your project description.',
    contact: {
      email: 'info@yourproject.com',
      phone: '',
      address: '',
      hours: {
        days: [],
        open: '',
        close: '',
      },
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      github: '',
      youtube: '',
    },
  },

  seo: {
    defaultTitle: 'your-project-name',
    description: 'Your project description.',
    keywords: [],
    author: 'Your Company',
    twitter: '',
    image: 'https://yourproject.com/og-image.png',
  },

  pages: {
    home: {
      title: 'Your Company',
      description: 'Your project description.',
      keywords: [],
      image: 'https://yourproject.com/og-image.png',
    },
    example: {
      title: 'Example Page | your-project-name',
      description:
        'Example page demonstrating a second route with CMS content for your-project-name.',
      keywords: ['example', 'template', 'placeholder'],
      image: 'https://yourproject.com/og-image.png',
    },
    demo: {
      title: 'Component Demo | your-project-name',
      description:
        'Explore the component library. This page is for development only.',
      keywords: ['demo', 'components', 'ui', 'react'],
      image: 'https://yourproject.com/og-image.png',
    },
    notFound: {
      title: 'Page Not Found | your-project-name',
      description: 'The page you are looking for does not exist.',
      noindex: true,
    },
  },

  analytics: {
    googleAnalyticsId: process.env.VITE_GA_ID || '',
    googleTagManagerId: process.env.VITE_GTM_ID || '',
    hotjarId: process.env.VITE_HOTJAR_ID || '',
    sentryDsn: process.env.VITE_SENTRY_DSN || '',
  },

  features: {
    analytics: process.env.NODE_ENV === 'production',
    demoMode: process.env.NODE_ENV === 'development',
    pwa: true,
    darkMode: true,
    errorReporting: process.env.NODE_ENV === 'production',
    performanceMonitoring: process.env.NODE_ENV === 'production',
    posts: false,
  },

  security: {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    httpsOnly: process.env.NODE_ENV === 'production',
    trustExternalScripts: false,
  },

  performance: {
    enableServiceWorker: true,
    enablePreloading: true,
    enableLazyLoading: true,
    enableCodeSplitting: true,
  },

  localization: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    timezone: 'America/New_York',
  },

  ...getEnvOverrides(),
};

function getEnvOverrides() {
  const env = process.env.NODE_ENV || 'development';
  switch (env) {
    case 'production':
      return {
        features: {
          analytics: true,
          demoMode: false,
          pwa: true,
          darkMode: true,
          errorReporting: true,
          performanceMonitoring: true,
          posts: false,
        },
        security: {
          contentSecurityPolicy: true,
          httpsOnly: true,
          trustExternalScripts: false,
        },
      };
    case 'development':
      return {
        features: {
          analytics: false,
          demoMode: true,
          pwa: true,
          darkMode: true,
          errorReporting: false,
          performanceMonitoring: false,
          posts: false,
        },
        security: {
          contentSecurityPolicy: false,
          httpsOnly: false,
          trustExternalScripts: true,
        },
      };
    case 'test':
      return {
        features: {
          analytics: false,
          demoMode: false,
          pwa: true,
          darkMode: true,
          errorReporting: false,
          performanceMonitoring: false,
          posts: false,
        },
        security: {
          contentSecurityPolicy: false,
          httpsOnly: false,
          trustExternalScripts: false,
        },
      };
    default:
      return {};
  }
}

/**
 * Returns the active project configuration for the current environment.
 *
 * @returns {typeof PROJECT_CONFIG} The merged project configuration object.
 */
export const getEnvConfig = () => PROJECT_CONFIG;

/**
 * React-friendly alias for `getEnvConfig`. Returns the project configuration.
 *
 * @returns {typeof PROJECT_CONFIG} The merged project configuration object.
 */
export const useProjectConfig = () => getEnvConfig();
export default PROJECT_CONFIG;
