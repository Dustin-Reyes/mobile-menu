import { MEDIA_CONFIG } from 'config/media';

/**
 * CMS field schema — single source of truth for the content editor.
 *
 * Defines which fields exist per page, their labels, types (`text`,
 * `textarea`, `url`, `email`, `array`), and the group they belong to in the
 * admin UI. Fields use section-prefixed keys (e.g. `heroTitle`) to mirror the
 * nested structure in `pages.js` while staying flat for the editor.
 *
 * To add a new field:
 *   1. Add the field definition here with a section prefix (`key`, `label`, `type`, `group`)
 *   2. Add the corresponding value in `src/content/pages.js` under the section object
 *   3. Run `yarn seed` to push the new content to Firestore
 *   4. Update the component that renders the field
 *
 * @module content/schema
 */

/**
 * Page schema keyed by page ID.
 *
 * Each page entry contains a `label`, optional `emoji`, and a `fields` array
 * of field descriptor objects.
 *
 * @type {Record<string, { label: string, emoji?: string, fields: Array<{ key: string, label: string, type: string, group: string }> }>}
 */
export const pageSchema = {
  home: {
    label: 'Home',
    emoji: '🏠',
    fields: [
      // Hero section
      {
        key: 'heroBadge',
        label: 'Hero Badge / Eyebrow',
        type: 'text',
        group: 'Hero',
      },
      { key: 'heroTitle', label: 'Hero Headline', type: 'text', group: 'Hero' },
      {
        key: 'heroSubtitle',
        label: 'Hero Subtitle',
        type: 'textarea',
        group: 'Hero',
      },
      {
        key: 'heroCtaText',
        label: 'Hero CTA Button Label',
        type: 'text',
        group: 'Hero',
      },
      // Services section
      {
        key: 'servicesTitle',
        label: 'Services Section Title',
        type: 'text',
        group: 'Services',
      },
      {
        key: 'servicesSubtitle',
        label: 'Services Section Subtitle',
        type: 'textarea',
        group: 'Services',
      },
      {
        key: 'servicesItems',
        label: 'Services Items',
        type: 'service-items',
        maxItems: 4,
        group: 'Services',
      },
      {
        key: 'servicesCtaText',
        label: 'Services CTA Button Text',
        type: 'text',
        group: 'Services',
      },
      // About section
      {
        key: 'aboutTitle',
        label: 'About Section Title',
        type: 'text',
        group: 'About',
      },
      {
        key: 'aboutSubtitle',
        label: 'About Section Subtitle',
        type: 'textarea',
        group: 'About',
      },
      {
        key: 'aboutDescription',
        label: 'About Section Description',
        type: 'textarea',
        group: 'About',
      },
      {
        key: 'aboutImage',
        label: 'About Section Image',
        type: 'image',
        group: 'About',
      },
      // Gallery section
      {
        key: 'galleryTitle',
        label: 'Gallery Section Title',
        type: 'text',
        group: 'Gallery',
      },
      {
        key: 'gallerySubtitle',
        label: 'Gallery Section Subtitle',
        type: 'textarea',
        group: 'Gallery',
      },
      {
        key: 'galleryImages',
        label: 'Gallery Images',
        type: 'image-list',
        maxItems: MEDIA_CONFIG.gallery.maxImages,
        group: 'Gallery',
      },
      // FAQ section
      {
        key: 'faqTitle',
        label: 'FAQ Section Title',
        type: 'text',
        group: 'FAQ',
      },
      {
        key: 'faqSubtitle',
        label: 'FAQ Section Subtitle',
        type: 'textarea',
        group: 'FAQ',
      },
      {
        key: 'faqItems',
        label: 'FAQ Items',
        type: 'faq-items',
        maxItems: 6,
        group: 'FAQ',
      },
      // Contact section
      {
        key: 'contactTitle',
        label: 'Contact Section Title',
        type: 'text',
        group: 'Contact',
      },
      {
        key: 'contactSubtitle',
        label: 'Contact Section Subtitle',
        type: 'textarea',
        group: 'Contact',
      },
      // CTA section
      {
        key: 'ctaTitle',
        label: 'CTA Section Title',
        type: 'text',
        group: 'CTA',
      },
      {
        key: 'ctaSubtitle',
        label: 'CTA Section Subtitle',
        type: 'textarea',
        group: 'CTA',
      },
      {
        key: 'ctaPrimaryText',
        label: 'CTA Primary Button Text',
        type: 'text',
        group: 'CTA',
      },
      {
        key: 'ctaSecondaryText',
        label: 'CTA Secondary Button Text',
        type: 'text',
        group: 'CTA',
      },
    ],
  },

  site: {
    label: 'Site (Global)',
    emoji: '🌐',
    fields: [
      // Contact info (used in footer and contact section)
      {
        key: 'footerContactEmail',
        label: 'Email Address',
        type: 'text',
        group: 'Contact Info',
      },
      {
        key: 'footerContactPhone',
        label: 'Phone Number',
        type: 'text',
        group: 'Contact Info',
      },
      {
        key: 'footerAddress',
        label: 'Address',
        type: 'textarea',
        group: 'Contact Info',
      },
      // Footer section (global footer content)
      {
        key: 'footerTagline',
        label: 'Footer Tagline',
        type: 'text',
        group: 'Footer',
      },
      {
        key: 'footerFacebook',
        label: 'Footer Facebook URL',
        type: 'text',
        group: 'Footer',
      },
      {
        key: 'footerInstagram',
        label: 'Footer Instagram URL',
        type: 'text',
        group: 'Footer',
      },
      {
        key: 'footerTwitter',
        label: 'Footer Twitter URL',
        type: 'text',
        group: 'Footer',
      },
      {
        key: 'footerLinkedin',
        label: 'Footer LinkedIn URL',
        type: 'text',
        group: 'Footer',
      },
      {
        key: 'footerGithub',
        label: 'Footer GitHub URL',
        type: 'text',
        group: 'Footer',
      },
      {
        key: 'footerYoutube',
        label: 'Footer YouTube URL',
        type: 'text',
        group: 'Footer',
      },
    ],
  },

  example: {
    label: 'Example Page',
    emoji: '💻',
    fields: [
      // Header section
      {
        key: 'headerTitle',
        label: 'Page Title',
        type: 'text',
        group: 'Header',
      },
      {
        key: 'headerDescription1',
        label: 'First Description',
        type: 'textarea',
        group: 'Header',
      },
      {
        key: 'headerDescription2',
        label: 'Second Description',
        type: 'textarea',
        group: 'Header',
      },
      // Features section
      {
        key: 'featuresItems',
        label: 'Feature List (one per line)',
        type: 'textarea',
        group: 'Features',
      },
    ],
  },
};
