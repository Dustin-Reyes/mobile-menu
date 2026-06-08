/**
 * Global error handler — Sentry integration and unhandled error capture.
 *
 * Sentry is initialised in `main.jsx` with `enabled: !!VITE_SENTRY_DSN`.
 * All `Sentry.*` calls here are safe to make unconditionally because Sentry
 * no-ops when the DSN is absent.
 *
 * Exports a singleton `globalErrorHandler` instance that is imported by
 * hooks, services, and the context layer.
 *
 * @module utils/errorHandler
 */
import * as Sentry from '@sentry/react';

/**
 * Captures unhandled promise rejections and uncaught errors, and exposes
 * helpers for manual error and message reporting.
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

  /**
   * Manually reports an error to Sentry with optional extra context.
   *
   * @param {Error} error - The error to report.
   * @param {Record<string, unknown>} [context={}] - Additional key-value context attached as Sentry extras.
   */
  reportError(error, context = {}) {
    Sentry.captureException(error, { extra: context });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Manual error report:', error, context);
    }
  }

  /**
   * Sends a custom message event to Sentry.
   *
   * @param {string} message - The message to capture.
   * @param {'fatal'|'error'|'warning'|'info'|'debug'} [level='info'] - Sentry severity level.
   * @param {Record<string, unknown>} [context={}] - Extra context.
   */
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

  /**
   * Associates a user with subsequent Sentry events.
   *
   * @param {{ id: string, email?: string }} user
   */
  setUser(user) {
    Sentry.setUser(user);
  }

  /** Clears the active Sentry user context. */
  clearUser() {
    Sentry.setUser(null);
  }

  /**
   * Appends a breadcrumb to the Sentry event trail.
   *
   * @param {import('@sentry/react').Breadcrumb} breadcrumb
   */
  addBreadcrumb(breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }
}

const globalErrorHandler = new GlobalErrorHandler();

export default globalErrorHandler;
