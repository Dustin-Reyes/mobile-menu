# SEO Implementation Guide

This guide explains how to use and customize the comprehensive SEO system implemented in this SPA template.

## Overview

The SEO system provides:

- **Automatic meta tag management** for all pages
- **Open Graph and Twitter Card** support for social sharing
- **JSON-LD structured data** for rich snippets
- **Dynamic sitemap generation**
- **Comprehensive robots.txt**
- **PWA manifest support**
- **Template-friendly configuration** for easy customization

## Quick Start

### Option 1: Interactive Setup Script (Recommended)

The easiest way to configure SEO is to use the interactive setup script:

```bash
yarn seo:setup
```

This will guide you through all the configuration options and automatically generate the configuration file.

### Option 2: Basic Usage (Works Out of the Box)

The SEO system works automatically once you start the application:

```jsx
// App.jsx - SEO is automatically handled
import { PageSEO } from 'components/SEO';

function App() {
  return (
    <ErrorBoundary>
      <PageSEO /> {/* Automatic SEO based on current route */}
      <Header />
      <Routes>{/* Your routes */}</Routes>
      <ToastProvider />
    </ErrorBoundary>
  );
}
```

### 2. Custom SEO for Specific Pages

```jsx
import { SEOProvider } from 'components/SEO';

function CustomPage() {
  return (
    <SEOProvider
      page="custom"
      meta={{
        title: 'Custom Page Title',
        description: 'Custom page description',
        image: 'https://example.com/custom-image.png',
      }}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Custom', url: '/custom' },
      ]}
    >
      <div>Your page content</div>
    </SEOProvider>
  );
}
```

## Configuration

### Project Configuration

All SEO settings are centralized in `src/config/project.js`:

```javascript
export const PROJECT_CONFIG = {
  name: 'Your Project Name',
  description: 'Your project description',
  url: {
    production: 'https://yourdomain.com',
    development: 'http://localhost:5173',
  },
  organization: {
    name: 'Your Company',
    url: 'https://yourcompany.com',
    contact: {
      email: 'contact@yourcompany.com',
    },
    social: {
      twitter: 'https://twitter.com/yourhandle',
      github: 'https://github.com/yourorg',
    },
  },
  seo: {
    defaultTitle: 'Your Site | Default Title',
    description: 'Default SEO description',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
    twitter: '@yourhandle',
    image: 'https://yourdomain.com/og-image.png',
  },
  pages: {
    home: {
      title: 'Home | Your Site',
      description: 'Home page description',
      keywords: ['home', 'landing'],
    },
    demo: {
      title: 'Demo | Your Site',
      description: 'Demo page description',
      keywords: ['demo', 'showcase'],
    },
  },
};
```

### Environment-Specific Configuration

The system automatically adapts based on environment:

```javascript
// Development mode
- Analytics disabled
- Demo routes visible
- Debug features enabled

// Production mode
- Analytics enabled
- Demo routes hidden
- Optimized settings
```

## SEO Features

### 1. Meta Tags

Automatically generated for each page:

- **Title**: Page-specific with site name suffix
- **Description**: Optimized for 150-160 characters
- **Keywords**: Relevant keywords for each page
- **Author**: Site author information
- **Canonical URL**: Proper canonical links

### 2. Social Media Optimization

**Open Graph Tags** (Facebook, LinkedIn, etc.):

```html
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page description" />
<meta property="og:image" content="https://example.com/image.png" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Your Site" />
```

**Twitter Cards**:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@yourhandle" />
<meta name="twitter:creator" content="@yourhandle" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="https://example.com/image.png" />
```

### 3. Structured Data (JSON-LD)

**Organization Schema**:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yourcompany.com",
  "logo": "https://yourcompany.com/logo.png",
  "description": "Company description",
  "sameAs": ["https://github.com/yourorg", "https://twitter.com/yourhandle"]
}
```

**Website Schema**:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Site",
  "url": "https://yourdomain.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yourdomain.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 4. Static SEO Files

**Sitemap** (`/sitemap.xml`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-02-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Robots.txt** (`/robots.txt`):

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://yourdomain.com/sitemap.xml
```

## Customization Guide

### 1. Update Basic Information

Edit `src/config/project.js`:

```javascript
export const PROJECT_CONFIG = {
  name: 'My Awesome Project',
  description: 'A description of my project',
  // ... other settings
};
```

### 2. Add New Pages

Add page-specific SEO in `project.js`:

```javascript
pages: {
  // Existing pages...
  blog: {
    title: 'Blog | My Site',
    description: 'Read our latest articles',
    keywords: ['blog', 'articles', 'news'],
    image: 'https://mydomain.com/og-blog.png',
  },
},
```

Then use it in your component:

```jsx
<SEOProvider page="blog" />
```

### 3. Custom Structured Data

Add custom structured data to any page:

```jsx
const customStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Article Title',
  author: {
    '@type': 'Person',
    name: 'Author Name',
  },
  datePublished: '2024-02-27',
};

<SEOProvider page="article" customStructuredData={[customStructuredData]} />;
```

### 4. Breadcrumb Navigation

Automatic breadcrumbs for nested routes:

```jsx
// For URL: /products/electronics/laptops
<SEOProvider
  page="products"
  breadcrumbs={[
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: 'Electronics', url: '/products/electronics' },
    { name: 'Laptops', url: '/products/electronics/laptops' },
  ]}
/>
```

## Best Practices

### 1. Title Optimization

- Keep titles under 60 characters
- Include primary keywords at the beginning
- Use format: "Page Title | Site Name"

### 2. Description Optimization

- Keep descriptions between 150-160 characters
- Include target keywords naturally
- Make descriptions compelling and actionable

### 3. Image Optimization

- Use 1200x630px for Open Graph images
- Use WebP format for better compression
- Include descriptive alt text

### 4. Structured Data

- Use Google's Structured Data Testing Tool
- Validate JSON-LD syntax
- Include all required properties

## Testing Your SEO

### 1. Local Testing

```bash
# Start development server
yarn dev

# Test static files
curl http://localhost:5173/sitemap.xml
curl http://localhost:5173/robots.txt
curl http://localhost:5173/manifest.json
```

### 2. Production Testing

```bash
# Build and preview
yarn build
yarn preview

# Test production URLs
curl http://localhost:4173/sitemap.xml
```

### 3. SEO Validation Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Schema.org Validator**: https://validator.schema.org/

## Analytics Integration

The SEO system includes analytics configuration in `project.js`:

```javascript
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
  googleTagManagerId: 'GTM-XXXXXXX',
  hotjarId: '123456',
  sentryDsn: 'https://your-sentry-dsn@sentry.io/project-id',
},
```

## Troubleshooting

### Common Issues

1. **Meta tags not showing in curl output**
   - This is normal for SPAs - tags are injected client-side
   - Use browser dev tools to verify tags
   - Test in production build for complete verification

2. **Structured data not validating**
   - Check JSON syntax
   - Ensure all required properties are included
   - Use Schema.org validator

3. **Social sharing previews not working**
   - Verify image URLs are accessible
   - Check image dimensions (1200x630px recommended)
   - Use Facebook/Twitter debug tools

### Debug Mode

Enable SEO debugging in development:

```javascript
// In your component
import { useSEOData } from 'components/SEO';

function MyPage() {
  const seoData = useSEOData({ page: 'home' });
  console.log('SEO Data:', seoData);

  return <div>...</div>;
}
```

## Migration Guide

If you're migrating from another SEO solution:

1. **Remove existing Helmet usage** from individual pages
2. **Update project configuration** in `src/config/project.js`
3. **Add PageSEO component** to App.jsx
4. **Test all pages** to ensure proper SEO tags
5. **Update sitemap** with your actual URLs

## Performance Considerations

- **Bundle Size**: SEO system adds < 2KB gzipped
- **Runtime Performance**: Minimal impact with memoization
- **SEO Score**: Designed to achieve 90+ Lighthouse SEO score
- **Core Web Vitals**: No impact on loading performance

## Support

For questions or issues:

1. Check this documentation first
2. Review the implementation in `src/components/SEO/`
3. Test with the provided examples
4. Refer to Google SEO guidelines for best practices
