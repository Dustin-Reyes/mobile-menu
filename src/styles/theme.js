import { colors } from './colors';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { designTokens } from './designTokens';

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
