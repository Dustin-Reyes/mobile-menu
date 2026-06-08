/**
 * Home-page section configuration.
 *
 * Controls which sections are visible on the home page and which anchor links
 * appear in the header navigation. Toggle a section off by setting its flag to
 * `false` — no code changes required elsewhere.
 *
 * @module config/sections
 */

/**
 * Section visibility and navigation configuration.
 *
 * @type {{
 *   hero: boolean,
 *   services: boolean,
 *   about: boolean,
 *   gallery: boolean,
 *   faq: boolean,
 *   contact: boolean,
 *   cta: boolean,
 *   navigation: Array<{ id: string, enabled: boolean }>
 * }}
 */
export const SECTIONS_CONFIG = {
  // Section visibility flags
  // Set to false to hide a section, true to show it
  hero: true,
  services: true,
  about: true,
  gallery: true,
  faq: true,
  contact: true,
  cta: true,

  // Section order (optional - if not provided, uses default order)
  // Uncomment and customize to change section order
  // order: ['hero', 'services', 'about', 'gallery', 'faq', 'contact', 'cta'],

  // Navigation links for header
  // These will be added to the header navigation as anchor links
  navigation: [
    { id: 'services', enabled: true },
    { id: 'about', enabled: true },
    { id: 'gallery', enabled: true },
    { id: 'faq', enabled: true },
    { id: 'contact', enabled: true },
  ],
};

export default SECTIONS_CONFIG;
