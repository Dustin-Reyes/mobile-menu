// Project Configuration
// This file contains all project-specific settings for easy customization

export const PROJECT_CONFIG = {
  name: 'titan-demo',
  description:
    'Licensed, insured, and built for the job before the job. Demo Titan handles residential and commercial demolition so your remodel can start on a clean slate',

  url: {
    production: 'https://demotitan.com/',
    development: 'http://localhost:5173',
    staging: 'https://staging.demotitan.com',
  },

  organization: {
    name: 'Titan Demo',
    url: 'https://demotitan.com/',
    logo: 'https://demotitan.com//logo.png',
    description:
      'Licensed, insured, and built for the job before the job. Residential and commercial demolition in Oregon.',
    contact: {
      email: 'info@demotitan.com',
      phone: '+15413297504',
      address: '123 Demo Lane, Eugene, OR 97401',
      hours: {
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        open: '7:00 AM',
        close: '6:00 PM',
      },
    },
    social: {
      twitter: 'https://twitter.com/demotitan',
      github: 'https://github.com/TranspiledCode/titan-demo',
      linkedin: 'https://linkedin.com/company/demotitan',
      facebook: 'https://facebook.com/demotitan',
      instagram: 'https://instagram.com/demotitan',
      google: 'https://google.com',
    },
  },

  seo: {
    defaultTitle: 'titan-demo',
    description:
      'Licensed, insured, and built for the job before the job. Demo Titan handles residential and commercial demolition so your remodel can start on a clean slate',
    keywords: [
      'demo',
      'demolition',
      'residential',
      'commercial',
      'titan',
      'oregon',
    ],
    author: 'Titan Demo',
    twitter: '@demotitan',
    image: 'https://demotitan.com/og-image.png',
  },

  pages: {
    home: {
      title: 'Titan Demo',
      description:
        'Licensed, insured, and built for the job before the job. Demo Titan handles residential and commercial demolition so your remodel can start on a clean slate.',
      keywords: [
        'demo',
        'demolition',
        'residential',
        'commercial',
        'titan',
        'oregon',
      ],
      image: 'https://demotitan.com/og-image.png',
    },
    demo: {
      title: 'Component Demo | titan-demo',
      description:
        'Explore the component library. This page is for development only.',
      keywords: ['demo', 'components', 'ui', 'react'],
      image: 'https://demotitan.com/og-image.png',
    },
    notFound: {
      title: 'Page Not Found | titan-demo',
      description:
        'The page you are looking for does not exist. Please check the URL and try again.',
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

  // Environment-specific overrides
  ...getEnvOverrides(),
};

/**
 * Environment-specific feature/security overrides (applied to PROJECT_CONFIG above)
 * @returns {Object} Partial overrides
 */
function getEnvOverrides() {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return {
        features: {
          analytics: true,
          demoMode: false,
          errorReporting: true,
          performanceMonitoring: true,
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
          errorReporting: false,
          performanceMonitoring: false,
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
          errorReporting: false,
          performanceMonitoring: false,
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
 * Get current environment configuration
 * @returns {Object} Full project config
 */
export const getEnvConfig = () => PROJECT_CONFIG;

/**
 * Hook-style alias for getEnvConfig
 * @returns {Object} Full project config
 */
export const useProjectConfig = () => getEnvConfig();

export default PROJECT_CONFIG;
