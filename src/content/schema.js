/**
 * Field schema for CMS content editor
 *
 * Single source of truth for which fields exist per page, their labels, types,
 * and display metadata. Each page object defines the editable fields that appear
 * in the admin dashboard content editor.
 *
 * To add a new section to a page:
 *   1. Add the field definitions here (key, label, type)
 *   2. Add the corresponding field values in `src/content/pages.js`
 *   3. Run `yarn seed` to push the new content to Firestore
 *   4. Update the component that renders the field
 */

export const pageSchema = {
  home: {
    label: 'Home',
    emoji: '🏠',
    fields: [
      { key: 'badge', label: 'Badge / Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'ctaText', label: 'CTA Button Label', type: 'text' },
      { key: 'ctaHref', label: 'CTA Button URL', type: 'text' },
    ],
  },
  about: {
    label: 'About',
    emoji: '📄',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
    ],
  },
};
