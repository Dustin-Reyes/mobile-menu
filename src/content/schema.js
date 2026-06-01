/**
 * Field schema for CMS content editor
 *
 * Single source of truth for which fields exist per page, their labels, types,
 * and display metadata. Each page object defines the editable fields that appear
 * in the admin dashboard content editor.
 *
 * To add a new field to a page:
 *   1. Add the field definition here (key, label, type)
 *   2. Add the corresponding field to the page object in `src/content/pages.js`
 *   3. Update any components that render that field
 *
 * When Firebase CMS is enabled, the admin dashboard uses this schema to
 * generate the form for editing each page's content.
 */

export const pageSchema = {
  home: {
    label: 'Home',
    emoji: '🏠',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'viewDemo', label: 'View Demo Label', type: 'text' },
      { key: 'viewGitHub', label: 'GitHub Label', type: 'text' },
      { key: 'copyright', label: 'Copyright', type: 'text' },
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
