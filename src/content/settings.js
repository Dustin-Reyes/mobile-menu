/**
 * Local settings fallbacks.
 *
 * Default site and SEO settings used when Firebase CMS is not configured.
 * Run `yarn setup` to populate these with your real project values.
 *
 * @module content/settings
 */

/**
 * Site-wide settings object.
 *
 * @type {{ site: { title: string, description: string, author: string, url: string }, seo: { defaultTitle: string, defaultDescription: string, keywords: string[] } }}
 */
export const settings = {
  site: {
    title: 'Your App',
    description: 'Your project description.',
    author: 'Your Company',
    url: 'https://yourproject.com',
  },
  seo: {
    defaultTitle: 'Your App',
    defaultDescription: 'Your project description.',
    keywords: [],
  },
};
