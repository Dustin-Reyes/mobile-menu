import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { SEOProvider } from '@/components/SEOProvider';
import { validateSEO } from '@/utils/seo';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://titan-demo.vercel.app',
    pathname: '/',
  },
  writable: true,
});

describe('SEO Components', () => {
  const renderWithHelmet = (component, initialEntries = ['/']) => {
    return render(
      <HelmetProvider>
        <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
      </HelmetProvider>,
    );
  };

  describe('SEOProvider', () => {
    it('should render without crashing', () => {
      renderWithHelmet(<SEOProvider page="home" />);
    });

    it('should accept page overrides', () => {
      renderWithHelmet(
        <SEOProvider
          page="home"
          meta={{
            title: 'Custom Title',
            description: 'Custom Description',
          }}
        />,
      );
    });

    it('should handle noindex flag', () => {
      renderWithHelmet(<SEOProvider page="notFound" noindex />);
    });

    it('should include structured data', () => {
      renderWithHelmet(<SEOProvider page="home" />);
    });

    it('should include Open Graph tags', () => {
      renderWithHelmet(<SEOProvider page="home" />);
    });

    it('should include Twitter Card tags', () => {
      renderWithHelmet(<SEOProvider page="home" />);
    });

    it('should include canonical URL', () => {
      renderWithHelmet(<SEOProvider page="home" />);
    });

    it('should handle breadcrumbs', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Demo', url: '/demo' },
      ];

      renderWithHelmet(<SEOProvider page="demo" breadcrumbs={breadcrumbs} />);
    });

    it('should include custom structured data', () => {
      const customData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Test Article',
      };

      renderWithHelmet(
        <SEOProvider page="home" customStructuredData={[customData]} />,
      );
    });
  });

  describe('SEO Validation', () => {
    it('should validate correct SEO data', () => {
      const seoData = {
        title: 'This is a good title for SEO purposes',
        description:
          'This is a good description that meets the minimum length requirements for SEO optimization and provides enough detail.',
        image: 'https://example.com/image.png',
        url: 'https://example.com',
      };

      const validation = validateSEO(seoData);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect SEO issues', () => {
      const seoData = {
        title: 'Short', // Too short
        description: 'Short', // Too short
        image: '', // Missing
      };

      const validation = validateSEO(seoData);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });
});
