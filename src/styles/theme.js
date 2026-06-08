/**
 * Emotion theme factory.
 *
 * Assembles colour tokens, typography, breakpoints, and design tokens into a
 * single theme object consumed by Emotion's `<ThemeProvider>`. Two pre-built
 * themes are exported (`lightTheme`, `darkTheme`) alongside `createTheme()`
 * for runtime mode switching.
 *
 * @module styles/theme
 */
import { colors } from './colors';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { designTokens } from './designTokens';

/**
 * Creates an Emotion theme object for the given colour mode.
 *
 * @param {'light' | 'dark'} [mode='light'] - Colour scheme to apply.
 * @returns {Object} Fully assembled Emotion theme.
 */
export const createTheme = (mode = 'light') => ({
  mode,
  colors: colors[mode],
  typography,
  breakpoints,
  ...designTokens,
  fontSizes: typography.fontSizes,
  fontWeights: typography.fontWeights,
});

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export const defaultTheme = lightTheme;
