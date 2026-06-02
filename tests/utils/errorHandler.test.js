import * as Sentry from '@sentry/react';
import globalErrorHandler from 'utils/errorHandler';

describe('globalErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reportError calls Sentry.captureException with the error', () => {
    const err = new Error('test error');
    globalErrorHandler.reportError(err, { url: '/test' });
    expect(Sentry.captureException).toHaveBeenCalledWith(
      err,
      expect.objectContaining({ extra: { url: '/test' } })
    );
  });

  it('reportMessage calls Sentry.captureMessage with message and level', () => {
    globalErrorHandler.reportMessage('something happened', 'warning', { page: 'home' });
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'something happened',
      expect.objectContaining({ level: 'warning', extra: { page: 'home' } })
    );
  });

  it('reportMessage defaults to info level', () => {
    globalErrorHandler.reportMessage('info message');
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'info message',
      expect.objectContaining({ level: 'info' })
    );
  });

  it('setUser calls Sentry.setUser', () => {
    const user = { id: '123', email: 'alice@example.com' };
    globalErrorHandler.setUser(user);
    expect(Sentry.setUser).toHaveBeenCalledWith(user);
  });

  it('clearUser calls Sentry.setUser(null)', () => {
    globalErrorHandler.clearUser();
    expect(Sentry.setUser).toHaveBeenCalledWith(null);
  });

  it('addBreadcrumb calls Sentry.addBreadcrumb', () => {
    const crumb = { category: 'ui', message: 'click' };
    globalErrorHandler.addBreadcrumb(crumb);
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(crumb);
  });
});
