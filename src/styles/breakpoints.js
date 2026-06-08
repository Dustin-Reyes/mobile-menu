/**
 * Responsive breakpoint tokens.
 *
 * Values are CSS pixel strings intended for use inside Emotion `css` template
 * literals: `@media (min-width: ${breakpoints.tablet}) { … }`.
 *
 * @module styles/breakpoints
 */

/**
 * Named breakpoint values keyed by device class.
 *
 * @type {{ mobile: string, tablet: string, desktop: string, wide: string, ultrawide: string }}
 */
export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  ultrawide: '1536px',
};
