import * as Sentry from '@sentry/react';

/**
 * Global error handler for unhandled promise rejections and errors.
 * Sentry is already initialised in main.jsx with `enabled: !!VITE_SENTRY_DSN`,
 * so all capture calls are safe to make unconditionally — Sentry no-ops when
 * disabled.
 */
class GlobalErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event);
    });

    window.addEventListener('error', (event) => {
      this.handleUncaughtError(event);
    });
  }

  handleUnhandledRejection(event) {
    const error = event.reason;

    Sentry.captureException(error, {
      tags: { errorType: 'unhandledRejection' },
      extra: { promise: event.promise },
    });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Unhandled promise rejection:', error);
    }

    event.preventDefault();
  }

  handleUncaughtError(event) {
    const error = event.error;

    Sentry.captureException(error, {
      tags: { errorType: 'uncaughtError' },
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Uncaught error:', error);
    }
  }

  reportError(error, context = {}) {
    Sentry.captureException(error, { extra: context });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Manual error report:', error, context);
    }
  }

  reportMessage(message, level = 'info', context = {}) {
    Sentry.captureMessage(message, { level, extra: context });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(
        `[${level.toUpperCase()}] Manual message report:`,
        message,
        context,
      );
    }
  }

  setUser(user) {
    Sentry.setUser(user);
  }

  clearUser() {
    Sentry.setUser(null);
  }

  addBreadcrumb(breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }
}

const globalErrorHandler = new GlobalErrorHandler();

export default globalErrorHandler;
