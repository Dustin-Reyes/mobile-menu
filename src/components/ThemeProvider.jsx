/**
 * @module components/ThemeProvider
 * @description Manages light/dark theme state, persisting the selection in
 * localStorage and syncing it across tabs. Wraps the component tree with
 * Emotion's ThemeProvider and exposes the current theme via the useTheme hook.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme } from '../styles/theme';

const ThemeContext = createContext();

/**
 * Returns the current theme context value.
 * @returns {{ mode: string, theme: Object, toggleMode: Function, isDark: boolean, isLight: boolean }|undefined}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context; // Return undefined if not in context instead of throwing
};

const STORAGE_KEY = 'theme-mode';

const getInitialMode = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component tree to wrap with theme context.
 * @param {string} [props._defaultMode='light'] - Default mode used in tests; overridden by stored or system preference at runtime.
 * @returns {JSX.Element}
 */
export const ThemeProvider = ({ children, _defaultMode = 'light' }) => {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === STORAGE_KEY &&
        (e.newValue === 'light' || e.newValue === 'dark')
      ) {
        setMode(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  );

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      mode,
      theme,
      toggleMode,
      isDark: mode === 'dark',
      isLight: mode === 'light',
    }),
    [mode, theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};
