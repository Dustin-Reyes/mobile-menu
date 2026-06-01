import * as Sentry from '@sentry/react';
import globalErrorHandler from '../../src/utils/errorHandler';

describe('GlobalErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  // ─── Window event handlers ───────────────────────────────────────────────────

  describe('handleUnhandledRejection', () => {
    it('reports to Sentry with unhandledRejection tag', () => {
      const error = new Error('Unhandled rejection');
      const event = {
        reason: error,
        promise: Promise.resolve(),
        preventDefault: jest.fn(),
      };

      globalErrorHandler.handleUnhandledRejection(event);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        tags: { errorType: 'unhandledRejection' },
        extra: { promise: event.promise },
      });
    });

    it('calls event.preventDefault()', () => {
      const event = {
        reason: new Error('test'),
        promise: Promise.resolve(),
        preventDefault: jest.fn(),
      };

      globalErrorHandler.handleUnhandledRejection(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('handleUncaughtError', () => {
    it('reports to Sentry with uncaughtError tag and location info', () => {
      const error = new Error('Uncaught error');
      const event = {
        error,
        filename: 'app.js',
        lineno: 42,
        colno: 7,
      };

      globalErrorHandler.handleUncaughtError(event);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        tags: { errorType: 'uncaughtError' },
        extra: { filename: 'app.js', lineno: 42, colno: 7 },
      });
    });
  });

  // ─── reportError ─────────────────────────────────────────────────────────────

  describe('reportError', () => {
    it('reports to Sentry with extra context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent', action: 'save' };

      globalErrorHandler.reportError(error, context);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        extra: context,
      });
    });

    it('works without a context argument', () => {
      const error = new Error('Test error');

      globalErrorHandler.reportError(error);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        extra: {},
      });
    });
  });

  // ─── reportMessage ────────────────────────────────────────────────────────────

  describe('reportMessage', () => {
    it('reports to Sentry with level and extra context', () => {
      globalErrorHandler.reportMessage('Test message', 'warning', {
        key: 'value',
      });

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Test message', {
        level: 'warning',
        extra: { key: 'value' },
      });
    });

    it('defaults to info level when no level is provided', () => {
      globalErrorHandler.reportMessage('Info message');

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Info message', {
        level: 'info',
        extra: {},
      });
    });
  });

  // ─── setUser / clearUser ──────────────────────────────────────────────────────

  describe('setUser', () => {
    it('sets user context in Sentry', () => {
      const user = { id: '123', email: 'test@example.com' };

      globalErrorHandler.setUser(user);

      expect(Sentry.setUser).toHaveBeenCalledWith(user);
    });
  });

  describe('clearUser', () => {
    it('clears user context in Sentry', () => {
      globalErrorHandler.clearUser();

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });
  });

  // ─── addBreadcrumb ────────────────────────────────────────────────────────────

  describe('addBreadcrumb', () => {
    it('adds breadcrumb to Sentry', () => {
      const breadcrumb = {
        message: 'User clicked save button',
        category: 'user',
        level: 'info',
      };

      globalErrorHandler.addBreadcrumb(breadcrumb);

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(breadcrumb);
    });
  });
});
