export const lightColors = {
  // Brand palette
  primary: '#F5A623', // golden amber — main CTA + accents
  secondary: '#E8A000', // darker amber — secondary actions + hover on dark bg
  tertiary: '#666666',

  // Fixed-value tokens (always this color regardless of mode)
  black: '#000000',
  white: '#FFFFFF',

  // Semantic surface tokens
  text: '#111111',
  background: '#FFFFFF',
  secondaryBackground: '#f7f7f7',
  surface: '#F5F5F5',
  textSecondary: '#555555',
  textMuted: '#9CA3AF',
  border: '#E0E0E0',
  secondaryBorder: '#939393',
  borderHover: '#F5A623',

  // Functional colors
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#4282E1',

  // On-color tokens (foreground for colored backgrounds)
  onPrimary: '#111111', // dark text on golden background
  onDark: '#FFFFFF',

  // Visual effects
  shadow: 'rgba(0, 0, 0, 0.10)',
  overlay: 'rgba(0, 0, 0, 0.55)',
};

export const darkColors = {
  // Brand palette
  primary: '#F7B733', // brighter amber for dark backgrounds
  secondary: '#F5A623', // golden amber as secondary on dark
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
  borderHover: '#F7B733',

  // Functional colors
  success: '#22C55E',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#5B9AEE',

  // On-color tokens (foreground for colored backgrounds)
  onPrimary: '#111111', // dark text on golden background
  onDark: '#FFFFFF',

  // Visual effects
  shadow: 'rgba(0, 0, 0, 0.45)',
  overlay: 'rgba(0, 0, 0, 0.65)',
};

export const colors = { light: lightColors, dark: darkColors };
