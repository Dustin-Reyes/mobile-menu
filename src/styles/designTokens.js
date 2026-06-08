/**
 * Core design tokens: spacing, borders, z-index, shadows, transitions,
 * animations, opacity, and font-family constants.
 *
 * All tokens are consumed by `createTheme()` via the `designTokens` aggregate
 * export, which is spread into the Emotion theme object.
 *
 * Token scale nomenclature: `s0` → smallest, `s10` → largest.
 *
 * @module styles/designTokens
 */

/**
 * Spacing scale (rem values).
 *
 * @type {Record<string, string>}
 */
export const spacing = {
  s0: '0.25rem',
  s1: '0.5rem',
  s2: '1rem',
  s3: '1.5rem',
  s4: '2rem',
  s5: '3rem',
  s6: '4rem',
  s7: '6rem',
  s8: '8rem',
  s9: '10rem',
  s10: '12rem',
};

/**
 * Border-radius scale.
 *
 * @type {Record<string, string>}
 */
export const borderRadius = {
  s0: '0.25rem',
  s1: '0.5rem',
  s2: '0.75rem',
  s3: '1rem',
  s4: '1.5rem',
  s100: '9999px',
};

/**
 * Z-index scale for layered UI elements.
 *
 * @type {Record<string, number>}
 */
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
  toast: 60,
};

/**
 * Box-shadow scale.
 *
 * @type {Record<string, string>}
 */
export const shadows = {
  s0: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  s1: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  s2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  s3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  s4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

/**
 * CSS transition shorthand values.
 *
 * @type {{ fast: string, base: string, slow: string }}
 */
export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

/**
 * CSS animation duration and timing-function presets.
 *
 * @type {Record<string, string>}
 */
export const animations = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
  bounce: '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  slideIn: '0.3s ease-out',
  fadeIn: '0.2s ease-in',
  fadeOut: '0.2s ease-out',
};

/**
 * Opacity constants for interactive states.
 *
 * @type {Record<string, string>}
 */
export const opacity = {
  transparent: '0',
  disabled: '0.5',
  active: '0.6',
  focus: '0.7',
  hover: '0.8',
  solid: '1',
};

/**
 * Font-family stacks for heading and body text.
 *
 * @type {{ heading: string, body: string }}
 */
export const fonts = {
  heading:
    "'Bebas Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/**
 * Aggregate design tokens object spread into the Emotion theme.
 *
 * @type {{ spacing: typeof spacing, borderRadius: typeof borderRadius, zIndex: typeof zIndex, shadows: typeof shadows, transitions: typeof transitions, animations: typeof animations, opacity: typeof opacity, fonts: typeof fonts }}
 */
export const designTokens = {
  spacing,
  borderRadius,
  zIndex,
  shadows,
  transitions,
  animations,
  opacity,
  fonts,
};
