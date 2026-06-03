import {
  generateMetaTags,
  generateOpenGraphTags,
  generateTwitterCardTags,
  generateStructuredData,
  generateBreadcrumbData,
  generateRobotsMeta,
  validateSEO,
  generateSlug,
  generateJsonLd,
} from 'utils/seo';

describe('generateMetaTags', () => {
  it('returns all required fields', () => {
    const tags = generateMetaTags('home');
    expect(tags).toHaveProperty('title');
    expect(tags).toHaveProperty('description');
    expect(tags).toHaveProperty('url');
    expect(tags).toHaveProperty('image');
    expect(tags).toHaveProperty('canonical');
    expect(tags).toHaveProperty('author');
    expect(tags).toHaveProperty('keywords');
    expect(typeof tags.noindex).toBe('boolean');
  });

  it('applies title override', () => {
    const tags = generateMetaTags('home', { title: 'Custom Title Override' });
    expect(tags.title).toBe('Custom Title Override');
  });

  it('applies description override', () => {
    const tags = generateMetaTags('home', {
      description: 'Custom description here.',
    });
    expect(tags.description).toBe('Custom description here.');
  });

  it('applies noindex override', () => {
    const tags = generateMetaTags('home', { noindex: true });
    expect(tags.noindex).toBe(true);
  });

  it('joins keywords array into comma-separated string', () => {
    const tags = generateMetaTags('home');
    expect(typeof tags.keywords).toBe('string');
  });

  it('falls back gracefully for unknown pageKey', () => {
    const tags = generateMetaTags('unknownPage');
    expect(tags.title).toBeTruthy();
  });
});

describe('generateOpenGraphTags', () => {
  it('returns all og: prefixed fields', () => {
    const meta = generateMetaTags('home');
    const og = generateOpenGraphTags(meta);
    expect(og).toHaveProperty('og:title');
    expect(og).toHaveProperty('og:description');
    expect(og).toHaveProperty('og:image');
    expect(og).toHaveProperty('og:url');
    expect(og).toHaveProperty('og:type');
    expect(og).toHaveProperty('og:locale');
    expect(og).toHaveProperty('og:site_name');
  });

  it('mirrors the meta title into og:title', () => {
    const meta = generateMetaTags('home', { title: 'My OG Title' });
    const og = generateOpenGraphTags(meta);
    expect(og['og:title']).toBe('My OG Title');
  });
});

describe('generateTwitterCardTags', () => {
  it('returns all twitter: prefixed fields', () => {
    const meta = generateMetaTags('home');
    const twitter = generateTwitterCardTags(meta);
    expect(twitter).toHaveProperty('twitter:card');
    expect(twitter).toHaveProperty('twitter:site');
    expect(twitter).toHaveProperty('twitter:creator');
    expect(twitter).toHaveProperty('twitter:title');
    expect(twitter).toHaveProperty('twitter:description');
    expect(twitter).toHaveProperty('twitter:image');
  });
});

describe('generateStructuredData', () => {
  it('always includes Organization and WebSite entries', () => {
    const data = generateStructuredData('home');
    const types = data.map((d) => d['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
  });

  it('adds BreadcrumbList when breadcrumbs are provided', () => {
    const data = generateStructuredData('home', {
      breadcrumbs: [{ name: 'Home', url: 'https://example.com' }],
    });
    const types = data.map((d) => d['@type']);
    expect(types).toContain('BreadcrumbList');
  });

  it('merges customStructuredData array', () => {
    const custom = [{ '@type': 'Product', name: 'Test' }];
    const data = generateStructuredData('home', {
      customStructuredData: custom,
    });
    const types = data.map((d) => d['@type']);
    expect(types).toContain('Product');
  });
});

describe('generateBreadcrumbData', () => {
  const crumbs = [
    { name: 'Home', url: 'https://example.com' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: 'Post', url: 'https://example.com/blog/post' },
  ];

  it('returns BreadcrumbList type with correct context', () => {
    const data = generateBreadcrumbData(crumbs);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('BreadcrumbList');
  });

  it('assigns sequential positions starting at 1', () => {
    const data = generateBreadcrumbData(crumbs);
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[1].position).toBe(2);
    expect(data.itemListElement[2].position).toBe(3);
  });

  it('maps name and item (url) correctly', () => {
    const data = generateBreadcrumbData(crumbs);
    expect(data.itemListElement[0].name).toBe('Home');
    expect(data.itemListElement[0].item).toBe('https://example.com');
  });
});

describe('generateRobotsMeta', () => {
  it('returns index/follow string by default', () => {
    expect(generateRobotsMeta()).toContain('index, follow');
  });

  it('returns index/follow when noindex=false', () => {
    expect(generateRobotsMeta(false)).toContain('index, follow');
  });

  it('returns noindex/nofollow when noindex=true', () => {
    expect(generateRobotsMeta(true)).toBe('noindex, nofollow');
  });
});

describe('validateSEO', () => {
  const validConfig = {
    title: 'My Great Website Title Here',
    description:
      'This is a sufficiently long description that meets the fifty character minimum requirement.',
    image: 'https://example.com/og.png',
    url: 'https://example.com',
  };

  it('returns isValid=true and no errors for a valid config', () => {
    const result = validateSEO(validConfig);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('errors when title is shorter than 10 characters', () => {
    const result = validateSEO({ ...validConfig, title: 'Short' });
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('10 characters'))).toBe(true);
  });

  it('warns when title exceeds 60 characters', () => {
    const result = validateSEO({ ...validConfig, title: 'x'.repeat(61) });
    expect(result.warnings.some((w) => w.includes('60 characters'))).toBe(true);
  });

  it('errors when description is shorter than 50 characters', () => {
    const result = validateSEO({ ...validConfig, description: 'Too short' });
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('Description'))).toBe(true);
  });

  it('warns when description exceeds 160 characters', () => {
    const result = validateSEO({
      ...validConfig,
      description: 'x'.repeat(161),
    });
    expect(result.warnings.some((w) => w.includes('160 characters'))).toBe(
      true,
    );
  });

  it('errors when image is missing', () => {
    const { image: _, ...noImage } = validConfig;
    const result = validateSEO(noImage);
    expect(result.errors).toContain('Image is required for social sharing');
  });

  it('errors when url is missing', () => {
    const { url: _, ...noUrl } = validConfig;
    const result = validateSEO(noUrl);
    expect(result.errors).toContain('URL is required');
  });

  it('warns on non-standard image extension', () => {
    const result = validateSEO({
      ...validConfig,
      image: 'https://example.com/image.gif',
    });
    expect(result.warnings.some((w) => w.includes('PNG, JPG, or WebP'))).toBe(
      true,
    );
  });
});

describe('generateSlug', () => {
  it('lowercases and trims the input', () => {
    expect(generateSlug('  Hello World  ')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('my blog post')).toBe('my-blog-post');
  });

  it('strips special characters', () => {
    expect(generateSlug('React & TypeScript!')).toBe('react-typescript');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('foo---bar')).toBe('foo-bar');
  });

  it('removes leading and trailing hyphens', () => {
    expect(generateSlug('!hello!')).toBe('hello');
  });
});

describe('generateJsonLd', () => {
  it('serializes each structured data object as JSON', () => {
    const data = [
      { '@type': 'Organization', name: 'Acme' },
      { '@type': 'WebSite', url: 'https://acme.com' },
    ];
    const result = generateJsonLd(data);
    expect(result).toContain('"@type":"Organization"');
    expect(result).toContain('"@type":"WebSite"');
  });

  it('returns empty string for empty array', () => {
    expect(generateJsonLd([])).toBe('');
  });
});
