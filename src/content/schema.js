/**
 * Field schema for CMS content editor
 *
 * Single source of truth for which fields exist per page, their labels, types,
 * and display metadata. Each page object defines the editable fields that appear
 * in the admin dashboard content editor.
 *
 * Note: Fields are organized with section prefixes (e.g., heroTitle, servicesSubtitle)
 * to match the nested structure in pages.js, but remain flat for the admin UI.
 *
 * To add a new section field:
 *   1. Add the field definition here with section prefix (key, label, type)
 *   2. Add the corresponding field value in `src/content/pages.js` under the section object
 *   3. Run `yarn seed` to push the new content to Firestore
 *   4. Update the component that renders the field
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

  development: {
    label: 'Development',
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
