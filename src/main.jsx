/**
 * Application entry point.
 *
 * Initialises Sentry error/performance monitoring, loads web fonts, bootstraps
 * i18n, and mounts the React application into `#root` wrapped in
 * StrictMode, HelmetProvider, BrowserRouter, and ThemeProvider.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';
import PROJECT_CONFIG from 'config/project';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import '@fontsource/bebas-neue';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import 'utils/errorHandler';
import './i18n/index'; // Initialize i18n
import App from '@/App';
import GlobalStyles from 'styles/global';
import { ThemeProvider } from 'components/ThemeProvider';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV || 'development',
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  release: __APP_VERSION__,
  ...(PROJECT_CONFIG.features.performanceMonitoring && {
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 0.2,
  }),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <GlobalStyles />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
