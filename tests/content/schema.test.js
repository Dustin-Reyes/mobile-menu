import { pageSchema } from '../../src/content/schema';

describe('pageSchema', () => {
  it('has home and about pages', () => {
    expect(pageSchema).toHaveProperty('home');
    expect(pageSchema).toHaveProperty('about');
  });

  it('home has required metadata', () => {
    expect(pageSchema.home.label).toBe('Home');
    expect(pageSchema.home.emoji).toBeDefined();
    expect(Array.isArray(pageSchema.home.fields)).toBe(true);
  });

  it('home has all expected fields', () => {
    const keys = pageSchema.home.fields.map((f) => f.key);
    expect(keys).toContain('title');
    expect(keys).toContain('subtitle');
    expect(keys).toContain('viewDemo');
    expect(keys).toContain('viewGitHub');
    expect(keys).toContain('copyright');
  });

  it('about has all expected fields', () => {
    const keys = pageSchema.about.fields.map((f) => f.key);
    expect(keys).toContain('title');
    expect(keys).toContain('content');
  });

  it('each field has key, label, and type', () => {
    Object.values(pageSchema).forEach((page) => {
      page.fields.forEach((field) => {
        expect(field).toHaveProperty('key');
        expect(field).toHaveProperty('label');
        expect(field).toHaveProperty('type');
        expect(['text', 'textarea']).toContain(field.type);
      });
    });
  });
});
