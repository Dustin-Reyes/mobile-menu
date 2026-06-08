/**
 * SEO utility functions.
 *
 * Generates meta tags, Open Graph tags, Twitter Card tags, JSON-LD structured
 * data, breadcrumb data, robots directives, and URL slugs from the centralised
 * SEO config in `src/config/seo`.
 *
 * @module utils/seo
 */
import { SEO_DEFAULTS, PAGE_SEO, STRUCTURED_DATA } from '@/config/seo';

/**
 * Generate meta tags for a page
 * @param {string} pageKey - Page key from PAGE_SEO
 * @param {Object} overrides - Additional meta tag overrides
 * @returns {Object} Meta tags configuration
 */
export function generateMetaTags(pageKey, overrides = {}) {
  const pageConfig = PAGE_SEO[pageKey] || {};
  const siteConfig = SEO_DEFAULTS.site;

  const title = overrides.title || pageConfig.title || siteConfig.title;
  const description =
    overrides.description || pageConfig.description || siteConfig.description;
  const keywords =
    overrides.keywords || pageConfig.keywords || siteConfig.keywords;
  const image = overrides.image || pageConfig.image || siteConfig.image;
  const url = overrides.url || `${siteConfig.url}${getPagePath(pageKey)}`;
  const noindex = overrides.noindex || pageConfig.noindex || false;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    image,
    url,
    noindex,
    author: siteConfig.author,
    canonical: url,
  };
}

/**
 * Generate Open Graph meta tags
 * @param {Object} metaTags - Meta tags from generateMetaTags
 * @returns {Object} Open Graph configuration
 */
export function generateOpenGraphTags(metaTags) {
  const { title, description, image, url } = metaTags;
  const openGraphConfig = SEO_DEFAULTS.social.openGraph;

  return {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': openGraphConfig.type,
    'og:locale': openGraphConfig.locale,
    'og:site_name': openGraphConfig.siteName,
  };
}

/**
 * Generate Twitter Card meta tags
 * @param {Object} metaTags - Meta tags from generateMetaTags
 * @returns {Object} Twitter Card configuration
 */
export function generateTwitterCardTags(metaTags) {
  const { title, description, image } = metaTags;
  const twitterConfig = SEO_DEFAULTS.social.twitter;

  return {
    'twitter:card': twitterConfig.card,
    'twitter:site': twitterConfig.site,
    'twitter:creator': twitterConfig.creator,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
  };
}

/**
 * Generate structured data for a page
 * @param {string} pageKey - Page key from PAGE_SEO
 * @param {Object} overrides - Additional structured data overrides
 * @returns {Array} Array of structured data objects
 */
export function generateStructuredData(pageKey, overrides = {}) {
  const structuredData = [];
  const siteConfig = SEO_DEFAULTS.site;

  // Add organization data to all pages
  structuredData.push(STRUCTURED_DATA.organization);

  // Add website data to all pages
  structuredData.push({
    ...STRUCTURED_DATA.webSite,
    url: overrides.url || `${siteConfig.url}${getPagePath(pageKey)}`,
  });

  // Add page-specific structured data
  if (pageKey === 'demo') {
    structuredData.push(STRUCTURED_DATA.webApplication);
  }

  // Add breadcrumb data if provided
  if (overrides.breadcrumbs) {
    structuredData.push(generateBreadcrumbData(overrides.breadcrumbs));
  }

  // Add custom structured data if provided
  if (
    overrides.customStructuredData &&
    Array.isArray(overrides.customStructuredData)
  ) {
    structuredData.push(...overrides.customStructuredData);
  }

  return structuredData;
}

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Object} Breadcrumb structured data
 */
export function generateBreadcrumbData(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Get page path from page key
 * @param {string} pageKey - Page key
 * @returns {string} Page path
 */
function getPagePath(pageKey) {
  const paths = {
    home: '',
    demo: '/demo',
    notFound: '/404',
  };
  return paths[pageKey] || '';
}

/**
 * Generate robots meta tag content
 * @param {boolean} noindex - Whether to noindex the page
 * @returns {string} Robots meta content
 */
export function generateRobotsMeta(noindex = false) {
  if (noindex) {
    return 'noindex, nofollow';
  }
  return 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
}

/**
 * Validate SEO configuration
 * @param {Object} seoConfig - SEO configuration to validate
 * @returns {Object} Validation result with errors and warnings
 */
export function validateSEO(seoConfig) {
  const errors = [];
  const warnings = [];

  // Validate required fields
  if (!seoConfig.title || seoConfig.title.length < 10) {
    errors.push('Title must be at least 10 characters long');
  }
  if (seoConfig.title && seoConfig.title.length > 60) {
    warnings.push(
      'Title is longer than 60 characters, may be truncated in search results',
    );
  }

  if (!seoConfig.description || seoConfig.description.length < 50) {
    errors.push('Description must be at least 50 characters long');
  }
  if (seoConfig.description && seoConfig.description.length > 160) {
    warnings.push(
      'Description is longer than 160 characters, may be truncated in search results',
    );
  }

  if (!seoConfig.image) {
    errors.push('Image is required for social sharing');
  }

  if (!seoConfig.url) {
    errors.push('URL is required');
  }

  // Validate image format
  if (seoConfig.image && !seoConfig.image.match(/\.(png|jpg|jpeg|webp)$/i)) {
    warnings.push(
      'Image should be in PNG, JPG, or WebP format for best compatibility',
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate SEO-friendly URL slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate JSON-LD script tag content
 * @param {Array} structuredData - Array of structured data objects
 * @returns {string} JSON-LD script content
 */
export function generateJsonLd(structuredData) {
  return structuredData.map((data) => JSON.stringify(data)).join('\n');
}
