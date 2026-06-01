# Error Handling System

This document describes the comprehensive error handling system implemented in the SPA template.

## Overview

The template includes a robust error handling system with:

- **React Error Boundary** - Catches React component errors
- **Global Error Handler** - Handles unhandled promises and errors
- **Sentry Integration** - Automatic error reporting and tracking
- **Graceful Fallback UI** - User-friendly error recovery

## Components

### 1. ErrorBoundary Component

Located at `src/components/ErrorBoundary.jsx`

The ErrorBoundary component wraps your React application and catches JavaScript errors in their child component tree.

**Features:**
- Catches React rendering errors
- Displays user-friendly fallback UI
- Integrates with Sentry for error tracking
- Provides error recovery options (retry/reload)
- Shows detailed error information in development

**Usage:**
```jsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourAppComponents />
    </ErrorBoundary>
  );
}
```

### 2. Global Error Handler

Located at `src/utils/errorHandler.js`

Handles errors that occur outside of React's error boundary scope.

**Features:**
- Catches unhandled promise rejections
- Catches uncaught JavaScript errors
- Automatic Sentry reporting
- Manual error reporting utilities
- User context management

**Usage:**
```jsx
import globalErrorHandler from './utils/errorHandler';

// Manual error reporting
globalErrorHandler.reportError(new Error('Something went wrong'), {
  component: 'UserProfile',
  action: 'save',
});

// Set user context
globalErrorHandler.setUser({
  id: '123',
  email: 'user@example.com',
});

// Add breadcrumb for debugging
globalErrorHandler.addBreadcrumb({
  message: 'User clicked save button',
  category: 'user',
  level: 'info',
});
```

## Error Recovery

### Automatic Recovery

The ErrorBoundary provides two recovery options:

1. **Try Again** - Resets the error boundary and re-renders the component
2. **Reload Page** - Performs a full page reload

### Manual Error Reporting

For non-React errors or custom error scenarios:

```jsx
import globalErrorHandler from './utils/errorHandler';

// Report errors with context
globalErrorHandler.reportError(error, {
  userId: '123',
  action: 'api_call',
  endpoint: '/api/data',
});

// Report informational messages
globalErrorHandler.reportMessage('User completed onboarding', 'info', {
  userId: '123',
  timestamp: Date.now(),
});
```

## Development vs Production

### Development Mode

- Shows detailed error information in the fallback UI
- Logs errors to console with full stack traces
- Includes component stack information

### Production Mode

- Shows user-friendly error messages only
- Errors are automatically sent to Sentry
- No sensitive information exposed to users

## Sentry Integration

The template is pre-configured with Sentry for error tracking:

### Environment Variables

```bash
# .env
VITE_SENTRY_DSN=your-sentry-dsn-here
VITE_APP_ENV=production
```

### Automatic Error Capture

- React errors via ErrorBoundary
- Unhandled promise rejections
- Uncaught JavaScript errors
- Manual error reports

### User Context

Set user context for better error tracking:

```jsx
globalErrorHandler.setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'johndoe',
});

// Clear user context on logout
globalErrorHandler.clearUser();
```

## Testing

Error Boundary tests are included in `tests/components/ErrorBoundary.test.jsx`.

Run tests:
```bash
yarn test ErrorBoundary.test.jsx
```

## Best Practices

### 1. Strategic Error Boundary Placement

Wrap major application sections:
```jsx
<ErrorBoundary>
  <Router>
    <ErrorBoundary>
      <Header />
    </ErrorBoundary>
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
    <ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  </Router>
</ErrorBoundary>
```

### 2. Async Error Handling

Always handle promise rejections:
```jsx
// Bad - unhandled rejection
fetch('/api/data').then(data => setData(data));

// Good - handle errors
fetch('/api/data')
  .then(data => setData(data))
  .catch(error => globalErrorHandler.reportError(error, { action: 'fetch_data' }));
```

### 3. User Context

Set user context early in the app lifecycle:
```jsx
// In your auth flow
function handleLogin(user) {
  globalErrorHandler.setUser(user);
  // ... rest of login logic
}
```

### 4. Error Boundaries for Features

Wrap feature-specific components:
```jsx
<ErrorBoundary fallback={<CustomErrorFallback />}>
  <ComplexFeature />
</ErrorBoundary>
```

## Troubleshooting

### Common Issues

1. **Error not caught by ErrorBoundary**
   - Check if error occurs in event handlers
   - Ensure async errors are properly handled
   - Verify ErrorBoundary wraps the correct components

2. **Sentry not receiving errors**
   - Verify `VITE_SENTRY_DSN` is set
   - Check network connectivity
   - Ensure Sentry DSN is valid

3. **Development errors not showing details**
   - Verify `import.meta.env.DEV` is true
   - Check if running in development mode

### Debug Mode

Enable additional logging:
```jsx
// In development, you can temporarily add more logging
if (import.meta.env.DEV) {
  window.globalErrorHandler = globalErrorHandler;
}
```

## Migration Guide

### From Basic Error Handling

If you're migrating from basic error handling:

1. Replace try-catch blocks with ErrorBoundary where appropriate
2. Add global error handler initialization
3. Configure Sentry integration
4. Update error reporting to use globalErrorHandler

### Example Migration

**Before:**
```jsx
function Component() {
  try {
    // risky code
  } catch (error) {
    console.error(error);
  }
}
```

**After:**
```jsx
function Component() {
  // risky code - errors caught by ErrorBoundary
}

// Or for async operations:
function Component() {
  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      globalErrorHandler.reportError(error, { component: 'Component' });
    }
  };
}
```

This comprehensive error handling system ensures your application provides a better user experience even when things go wrong.
