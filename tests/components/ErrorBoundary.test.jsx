import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../jest.setup';
import * as Sentry from '@sentry/react';
import ErrorBoundary from '../../src/components/ErrorBoundary';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'error.boundary.title': 'Something went wrong',
        'error.boundary.message':
          "We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.",
        'error.boundary.footer':
          'If this problem persists, please contact support or try again later.',
        'common.retry': 'Try Again',
        'common.reload': 'Reload Page',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('displays fallback UI when child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/We're sorry, but something unexpected happened/),
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('renders custom fallback when fallback prop is provided', () => {
    const customFallback = <div>Custom error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    // import.meta.env.DEV defaults to true in jest.setup.js
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText('Error Details (Development Only)'),
    ).toBeInTheDocument();
  });

  it('hides error details in production mode', () => {
    global.import.meta.env.DEV = false;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.queryByText('Error Details (Development Only)'),
    ).not.toBeInTheDocument();

    global.import.meta.env.DEV = true;
  });

  it('reports errors to Sentry', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        contexts: expect.objectContaining({
          react: expect.objectContaining({
            componentStack: expect.any(String),
          }),
        }),
      }),
    );
  });

  it('recovers from error when retry button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try Again'));

    rerender(
      <ErrorBoundary key="retry">
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('reloads page when reload button is clicked', () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByText('Reload Page'));
    expect(mockReload).toHaveBeenCalled();
  });

  it('logs errors to console in development mode', () => {
    // import.meta.env.DEV defaults to true in jest.setup.js
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });
});
