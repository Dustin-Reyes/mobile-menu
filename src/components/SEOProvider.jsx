import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import {
  generateMetaTags,
  generateOpenGraphTags,
  generateTwitterCardTags,
  generateStructuredData,
  generateRobotsMeta,
  generateJsonLd,
} from '@/utils/seo';

/**
 * SEO Provider component for comprehensive SEO management
 * @param {Object} props - Component props
 * @param {string} props.page - Page key for SEO configuration
 * @param {Object} props.meta - Meta tag overrides
 * @param {Array} props.breadcrumbs - Breadcrumb items for structured data
 * @param {Object} props.customStructuredData - Additional structured data
 * @param {boolean} props.noindex - Whether to noindex the page
 */
export function SEOProvider({
  page,
  meta = {},
  breadcrumbs = [],
  customStructuredData = [],
  noindex = false,
}) {
  const seoData = useMemo(() => {
    // Generate base meta tags
    const metaTags = generateMetaTags(page, { ...meta, noindex });

    // Generate Open Graph tags
    const openGraphTags = generateOpenGraphTags(metaTags);

    // Generate Twitter Card tags
    const twitterCardTags = generateTwitterCardTags(metaTags);

    // Generate structured data
    const structuredData = generateStructuredData(page, {
      url: metaTags.url,
      breadcrumbs,
    });

    // Add custom structured data
    if (customStructuredData.length > 0) {
      structuredData.push(...customStructuredData);
    }

    // Generate robots meta
    const robotsMeta = generateRobotsMeta(metaTags.noindex);

    return {
      metaTags,
      openGraphTags,
      twitterCardTags,
      structuredData,
      robotsMeta,
    };
  }, [page, meta, breadcrumbs, customStructuredData, noindex]);

  const {
    metaTags,
    openGraphTags,
    twitterCardTags,
    structuredData,
    robotsMeta,
  } = seoData;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="author" content={metaTags.author} />

      {/* Canonical URL */}
      <link rel="canonical" href={metaTags.canonical} />

      {/* Robots meta */}
      <meta name="robots" content={robotsMeta} />

      {/* Open Graph meta tags */}
      {Object.entries(openGraphTags).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}

      {/* Twitter Card meta tags */}
      {Object.entries(twitterCardTags).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* Additional meta tags */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="application-name" content="Transpiled Web Template" />
      <meta name="apple-mobile-web-app-title" content="Transpiled Web Template" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="referrer" content="no-referrer-when-downgrade" />

      {/* Structured data */}
      {structuredData.length > 0 && (
        <script type="application/ld+json">
          {generateJsonLd(structuredData)}
        </script>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://github.com" />
      <link rel="preconnect" href="https://vercel.app" />

      {/* DNS prefetch for commonly accessed domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//github.com" />
      <link rel="dns-prefetch" href="//vercel.app" />
    </Helmet>
  );
}

/**
 * Hook for SEO data (useful for debugging or analytics)
 * @param {Object} props - Same props as SEOProvider
 * @returns {Object} SEO data for debugging
 */
export function useSEOData({
  page,
  meta = {},
  breadcrumbs = [],
  customStructuredData = [],
  noindex = false,
}) {
  return useMemo(() => {
    const metaTags = generateMetaTags(page, { ...meta, noindex });
    const openGraphTags = generateOpenGraphTags(metaTags);
    const twitterCardTags = generateTwitterCardTags(metaTags);
    const structuredData = generateStructuredData(page, {
      url: metaTags.url,
      breadcrumbs,
    });

    if (customStructuredData.length > 0) {
      structuredData.push(...customStructuredData);
    }

    const robotsMeta = generateRobotsMeta(metaTags.noindex);

    return {
      metaTags,
      openGraphTags,
      twitterCardTags,
      structuredData,
      robotsMeta,
    };
  }, [page, meta, breadcrumbs, customStructuredData, noindex]);
}

export default SEOProvider;
