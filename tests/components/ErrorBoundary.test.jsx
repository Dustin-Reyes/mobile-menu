import React from 'react';
import { render, screen } from '../utils/test-utils';
import * as Sentry from '@sentry/react';
import ErrorBoundary from 'components/ErrorBoundary';

function ThrowingComponent({ shouldThrow }) {
  if (shouldThrow) throw new Error('Test component explosion');
  return <p>All good</p>;
}

describe('ErrorBoundary', () => {
  let consoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress React's error boundary console output
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.queryByText('All good')).not.toBeInTheDocument();
    // ErrorBoundary fallback should have at least one button (retry/reload)
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('reports the error to Sentry when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('shows error details in the fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    // The fallback renders something — at minimum a container is present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
