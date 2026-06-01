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
