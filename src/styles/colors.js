/**
 * Colour design tokens for light and dark themes.
 *
 * Exports `lightColors`, `darkColors`, and a combined `colors` object used
 * by `createTheme()` in `styles/theme.js`.
 *
 * @module styles/colors
 */

/**
 * Semantic colour tokens for the light theme.
 *
 * @type {Record<string, string>}
 */
export const lightColors = {
  // Brand palette
  primary: '#6366F1', // electric indigo — main CTA + accents
  secondary: '#4F46E5', // deeper indigo — secondary actions + hover on dark bg
  tertiary: '#666666',

  // Fixed-value tokens (always this color regardless of mode)
  black: '#000000',
  white: '#FFFFFF',

  // Semantic surface tokens
  text: '#111111',
  background: '#F0F2F5',
  secondaryBackground: '#E0E3E7',
  surface: '#D1D5DB',
  textSecondary: '#555555',
  textMuted: '#9CA3AF',
  border: '#E0E0E0',
  secondaryBorder: '#939393',
  borderHover: '#6366F1',

  // Functional colors
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#4282E1',

  // On-color tokens (foreground for colored backgrounds)
  onPrimary: '#FFFFFF', // white text on indigo background
  onDark: '#FFFFFF',

  // Visual effects
  shadow: 'rgba(0, 0, 0, 0.10)',
  overlay: 'rgba(0, 0, 0, 0.55)',
};

/**
 * Semantic colour tokens for the dark theme.
 *
 * @type {Record<string, string>}
 */
export const darkColors = {
  // Brand palette
  primary: '#818CF8', // soft indigo for dark backgrounds
  secondary: '#6366F1', // electric indigo as secondary on dark
  tertiary: '#888888',

  // Fixed-value tokens (always this color regardless of mode)
  black: '#000000',
  white: '#FFFFFF',

  // Semantic surface tokens
  text: '#F8FAFC',
  background: '#111111',
  secondaryBackground: '#1e1e1e',
  surface: '#1C1C1C',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#2D2D2D',
  secondaryBorder: '#606060',
  borderHover: '#818CF8',

  // Functional colors
  success: '#22C55E',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#5B9AEE',

  // On-color tokens (foreground for colored backgrounds)
  onPrimary: '#FFFFFF', // white text on indigo background
  onDark: '#FFFFFF',

  // Visual effects
  shadow: 'rgba(0, 0, 0, 0.45)',
  overlay: 'rgba(0, 0, 0, 0.65)',
};

/**
 * Combined colour map keyed by theme mode.
 *
 * @type {{ light: typeof lightColors, dark: typeof darkColors }}
 */
export const colors = { light: lightColors, dark: darkColors };
