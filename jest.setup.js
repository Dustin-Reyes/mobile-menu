// jest.setup.js
require('@testing-library/jest-dom');

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from './src/components/ThemeProvider';
import { HelmetProvider } from 'react-helmet-async';

// Theme provider wrapper for tests
const AllTheProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </HelmetProvider>
  );
};

// Override render method to include providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Sentry
jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  captureEvent: jest.fn(),
  setTag: jest.fn(),
  setUser: jest.fn(),
  setContext: jest.fn(),
  withScope: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

// Mock Vite's import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_SENTRY_DSN: 'test-sentry-dsn',
        VITE_APP_ENV: 'test',
        DEV: true,
      },
    },
  },
  writable: true,
});

// Mock process.env for Vite environment variables
process.env.VITE_SENTRY_DSN = 'test-sentry-dsn';
process.env.VITE_APP_ENV = 'test';

// Suppress React act() warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
        args[0].includes('Warning: `ReactDOMTestUtils.act`') ||
        args[0].includes('not wrapped in act(...)'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
