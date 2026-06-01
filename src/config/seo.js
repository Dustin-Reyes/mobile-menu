import { getEnvConfig } from './project';

// Get current environment configuration
const config = getEnvConfig();

export const SEO_DEFAULTS = {
  site: {
    name: config.name,
    title: config.seo.defaultTitle,
    description: config.seo.description,
    url: config.url.production,
    author: config.organization.name,
    twitter: config.seo.twitter,
    image: config.seo.image,
    keywords: config.seo.keywords,
  },
  social: {
    twitter: {
      card: 'summary_large_image',
      site: config.seo.twitter,
      creator: config.seo.twitter,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: config.name,
    },
  },
  verification: {
    google: 'google-site-verification-code', // TODO: Add actual verification code
    bing: 'bing-site-verification-code', // TODO: Add actual verification code
  },
};

export const PAGE_SEO = {
  home: config.pages.home,
  demo: config.pages.demo,
  notFound: config.pages.notFound,
};

export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.organization.name,
    url: config.organization.url,
    logo: config.organization.logo,
    description: config.organization.description,
    sameAs: Object.values(config.organization.social),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: config.organization.contact.email,
    },
  },
  webSite: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url.production,
    description: config.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.url.production}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.name,
    url: config.url.production,
    description: config.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    screenshot: `${config.url.production}/screenshot.png`,
  },
};
