import {
  generateMetaTags,
  generateOpenGraphTags,
  generateTwitterCardTags,
  generateStructuredData,
  generateRobotsMeta,
  validateSEO,
  generateJsonLd,
} from '@/utils/seo';
import { SEO_DEFAULTS, PAGE_SEO } from '@/config/seo';

describe('SEO Utils', () => {
  describe('generateMetaTags', () => {
    it('should generate meta tags for home page', () => {
      const metaTags = generateMetaTags('home');

      expect(metaTags).toEqual({
        title: PAGE_SEO.home.title,
        description: PAGE_SEO.home.description,
        keywords: PAGE_SEO.home.keywords.join(', '),
        image: PAGE_SEO.home.image,
        url: expect.stringContaining('/'),
        noindex: false,
        author: SEO_DEFAULTS.site.author,
        canonical: expect.stringContaining('/'),
      });
    });

    it('should accept overrides', () => {
      const overrides = {
        title: 'Custom Title',
        description: 'Custom Description',
        noindex: true,
      };

      const metaTags = generateMetaTags('home', overrides);

      expect(metaTags.title).toBe('Custom Title');
      expect(metaTags.description).toBe('Custom Description');
      expect(metaTags.noindex).toBe(true);
    });

    it('should handle unknown page key', () => {
      const metaTags = generateMetaTags('unknown');

      expect(metaTags.title).toBe(SEO_DEFAULTS.site.title);
      expect(metaTags.description).toBe(SEO_DEFAULTS.site.description);
    });
  });

  describe('generateOpenGraphTags', () => {
    it('should generate Open Graph tags', () => {
      const metaTags = {
        title: 'Test Title',
        description: 'Test Description',
        image: 'https://example.com/image.png',
        url: 'https://example.com',
      };

      const ogTags = generateOpenGraphTags(metaTags);

      expect(ogTags).toEqual({
        'og:title': 'Test Title',
        'og:description': 'Test Description',
        'og:image': 'https://example.com/image.png',
        'og:url': 'https://example.com',
        'og:type': SEO_DEFAULTS.social.openGraph.type,
        'og:locale': SEO_DEFAULTS.social.openGraph.locale,
        'og:site_name': SEO_DEFAULTS.social.openGraph.siteName,
      });
    });
  });

  describe('generateTwitterCardTags', () => {
    it('should generate Twitter Card tags', () => {
      const metaTags = {
        title: 'Test Title',
        description: 'Test Description',
        image: 'https://example.com/image.png',
      };

      const twitterTags = generateTwitterCardTags(metaTags);

      expect(twitterTags).toEqual({
        'twitter:card': SEO_DEFAULTS.social.twitter.card,
        'twitter:site': SEO_DEFAULTS.social.twitter.site,
        'twitter:creator': SEO_DEFAULTS.social.twitter.creator,
        'twitter:title': 'Test Title',
        'twitter:description': 'Test Description',
        'twitter:image': 'https://example.com/image.png',
      });
    });
  });

  describe('generateStructuredData', () => {
    it('should generate structured data for home page', () => {
      const structuredData = generateStructuredData('home');

      expect(structuredData).toHaveLength(2); // Organization + WebSite
      expect(structuredData[0]['@type']).toBe('Organization');
      expect(structuredData[1]['@type']).toBe('WebSite');
    });

    it('should generate structured data for demo page', () => {
      const structuredData = generateStructuredData('demo');

      expect(structuredData).toHaveLength(3); // Organization + WebSite + WebApplication
      expect(structuredData[2]['@type']).toBe('WebApplication');
    });

    it('should include breadcrumbs when provided', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Demo', url: '/demo' },
      ];

      const structuredData = generateStructuredData('home', { breadcrumbs });

      expect(structuredData).toHaveLength(3); // Organization + WebSite + Breadcrumb
      expect(structuredData[2]['@type']).toBe('BreadcrumbList');
    });

    it('should include custom structured data', () => {
      const customData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Test Article',
      };

      const structuredData = generateStructuredData('home', {
        customStructuredData: [customData],
      });

      expect(structuredData).toHaveLength(3); // Organization + WebSite + Custom
      expect(structuredData[2]['@type']).toBe('Article');
    });
  });

  describe('generateRobotsMeta', () => {
    it('should generate index robots meta', () => {
      const robotsMeta = generateRobotsMeta(false);

      expect(robotsMeta).toBe(
        'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      );
    });

    it('should generate noindex robots meta', () => {
      const robotsMeta = generateRobotsMeta(true);

      expect(robotsMeta).toBe('noindex, nofollow');
    });
  });

  describe('validateSEO', () => {
    it('should validate correct SEO configuration', () => {
      const seoConfig = {
        title: 'This is a good title for SEO purposes',
        description:
          'This is a good description that meets the minimum length requirements for SEO optimization and provides enough detail.',
        image: 'https://example.com/image.png',
        url: 'https://example.com',
      };

      const validation = validateSEO(seoConfig);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect title too short', () => {
      const seoConfig = {
        title: 'Short',
        description:
          'This is a good description that meets the minimum length requirements for SEO optimization and provides enough detail.',
        image: 'https://example.com/image.png',
        url: 'https://example.com',
      };

      const validation = validateSEO(seoConfig);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'Title must be at least 10 characters long',
      );
    });

    it('should detect title too long warning', () => {
      const seoConfig = {
        title:
          'This title is way too long and exceeds the recommended 60 character limit for search results',
        description:
          'This is a good description that meets the minimum length requirements for SEO optimization and provides enough detail.',
        image: 'https://example.com/image.png',
        url: 'https://example.com',
      };

      const validation = validateSEO(seoConfig);

      expect(validation.isValid).toBe(true);
      expect(validation.warnings).toContain(
        'Title is longer than 60 characters, may be truncated in search results',
      );
    });

    it('should detect missing image', () => {
      const seoConfig = {
        title: 'This is a good title for SEO purposes',
        description:
          'This is a good description that meets the minimum length requirements for SEO optimization and provides enough detail.',
        url: 'https://example.com',
      };

      const validation = validateSEO(seoConfig);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'Image is required for social sharing',
      );
    });
  });

  describe('generateJsonLd', () => {
    it('should generate JSON-LD script content', () => {
      const structuredData = [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Test Organization',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Test Website',
        },
      ];

      const jsonLd = generateJsonLd(structuredData);

      expect(jsonLd).toContain('"@context":"https://schema.org"');
      expect(jsonLd).toContain('"@type":"Organization"');
      expect(jsonLd).toContain('"@type":"WebSite"');
      expect(jsonLd).toContain('"name":"Test Organization"');
      expect(jsonLd).toContain('"name":"Test Website"');
    });

    it('should handle empty structured data', () => {
      const jsonLd = generateJsonLd([]);

      expect(jsonLd).toBe('');
    });
  });
});
