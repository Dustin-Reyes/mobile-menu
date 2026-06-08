/**
 * Local navigation content fallback.
 *
 * Each nav item carries locale-keyed labels so navigation text can be
 * translated. The `href` and `order` fields are shared across all locales.
 *
 * To add a nav item:
 * ```js
 * { id: 'about', sectionId: 'about', order: 2, labels: { en: 'About', es: 'Nosotros' } }
 * ```
 *
 * @module content/navigation
 */

/**
 * Navigation content grouped by placement (`main`, `footer`).
 *
 * @type {{ main: Array<Object>, footer: Array<Object> }}
 */
export const navigation = {
  main: [],
  footer: [],
};
