/**
 * Typography design tokens: fluid font sizes, font weights, line heights,
 * and font-family stacks.
 *
 * Font sizes use CSS `clamp()` for fluid scaling between viewport widths.
 * The scale follows a `s0`–`s10` naming convention matching the spacing scale.
 *
 * @module styles/typography
 */

/**
 * Fluid font-size scale using `clamp()`.
 *
 * @type {Record<string, string>}
 */
export const fontSizes = {
  s0: 'clamp(1.0rem, 0.98rem + 0.1vw, 1.1rem)', // 10–11px  tiny: locale codes, overflow pills
  s1: 'clamp(1.1rem, 1.05rem + 0.25vw, 1.2rem)', // 11–12px  xsmall: field labels, group labels
  s2: 'clamp(1.2rem, 1.1rem + 0.5vw, 1.4rem)', // 12–14px  small: metadata, save status, pills
  s3: 'clamp(1.4rem, 1.3rem + 0.5vw, 1.6rem)', // 14–16px  base: page names, list items, body copy
  s4: 'clamp(1.6rem, 1.5rem + 0.5vw, 1.8rem)', // 16–18px  medium: editor title, form labels
  s5: 'clamp(1.8rem, 1.6rem + 1vw, 2.2rem)', // 18–22px  large: section headings, sidebar brand, buttons
  s6: 'clamp(2.2rem, 2.0rem + 1vw, 2.8rem)', // 22–28px  xlarge: page titles, dialog titles
  s7: 'clamp(2.8rem, 2.4rem + 2vw, 3.8rem)', // 28–38px  2xl: stat values, hero sub-headings
  s8: 'clamp(3.8rem, 3.2rem + 3vw, 5.0rem)', // 38–50px  3xl: hero headings
  s9: 'clamp(5.0rem, 4.2rem + 4vw, 6.8rem)', // 50–68px  display
  s10: 'clamp(6.5rem, 4.5rem + 5vw, 11.0rem)', // 65–110px hero display
};

/**
 * Named font-weight constants.
 *
 * @type {{ normal: number, medium: number, semibold: number, bold: number, extrabold: number }}
 */
export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

/**
 * Named line-height constants.
 *
 * @type {{ tight: number, normal: number, relaxed: number }}
 */
export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Font-family stacks keyed by role.
 *
 * @type {{ sans: string, mono: string, heading: string, body: string }}
 */
export const fontFamilies = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  heading:
    "'Bebas Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/**
 * Aggregate typography token object consumed by `createTheme()`.
 *
 * @type {{ fontSizes: typeof fontSizes, fontWeights: typeof fontWeights, lineHeights: typeof lineHeights, fontFamilies: typeof fontFamilies }}
 */
export const typography = {
  fontSizes,
  fontWeights,
  lineHeights,
  fontFamilies,
};
