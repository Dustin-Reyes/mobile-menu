# API Client

A production-ready HTTP client built for this template. It wraps the native
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) API with
consistent configuration, retry logic, request/response interceptors, and tight
integration with the global error handling system.

---

## Features

- ✅ Automatic base URL resolution using `VITE_API_BASE_URL`
- ✅ Configurable timeouts with abort handling
- ✅ Exponential backoff retries (defaults: 2 retries, jittered delays)
- ✅ Request, response, and error interceptors
- ✅ Centralised error reporting via `globalErrorHandler`
- ✅ Supports JSON, `FormData`, binary payloads, and raw responses
- ✅ Helper methods for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`

---

## Getting Started

```js
import apiClient from 'services';

async function loadProfile() {
  const data = await apiClient.get('/users/me');
  return data;
}
```

> The default export in `services/index.js` is a singleton instance that you can
> import anywhere in the app.

---

## Configuration

Create your own instance when you need different defaults (e.g. alternative
base URL or custom retry behaviour):

```js
import { ApiClient } from 'services';

const billingClient = new ApiClient({
  baseURL: 'https://billing.api.internal',
  timeout: 10_000,
  credentials: 'include',
  retry: {
    retries: 3,
    shouldRetry: (response, error) => {
      if (error?.isNetworkError) return true;
      return response?.status >= 500;
    },
  },
});
```

### Environment variables

| Variable               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `VITE_API_BASE_URL`    | Default base URL for the singleton instance. |
| `VITE_SENTRY_DSN`      | Enables Sentry reporting when set.           |
| `VITE_APP_ENV`         | Passed to Sentry for environment tagging.    |

---

## Interceptors

Interceptors let you centralise cross-cutting concerns such as auth tokens,
telemetry, or response normalisation.

### Request interceptors

```js
const removeAuthInterceptor = apiClient.addRequestInterceptor(async (request) => ({
  ...request,
  options: {
    ...request.options,
    headers: {
      ...request.options.headers,
      Authorization: `Bearer ${await authStore.getAccessToken()}`,
    },
  },
}));
```

### Response interceptors

```js
apiClient.addResponseInterceptor(async (result) => ({
  ...result,
  data: camelizeKeys(result.data),
}));
```

### Error interceptors

```js
apiClient.addErrorInterceptor(async (error, context) => {
  if (error.status === 401) {
    await authStore.logout();
  }

  // Return the original error (or a transformed one)
  return error;
});
```

Calling the unsubscribe function returned by `add*Interceptor` removes the
interceptor.

---

## Retry Behaviour

Retries use exponential backoff with jitter by default:

- Attempts: 1 initial try + 2 retries (configurable via `retry.retries`)
- Delay: 250ms, 500ms, 1s (capped at 2s)
- Retries network errors, aborted requests, `429` and `5xx` responses

Override the behaviour per-request:

```js
await apiClient.get('/reports', {
  retry: { retries: 5 },
  onRetry: ({ attempt, error }) => {
    console.warn('retrying', attempt, error);
  },
});
```

---

## Handling Errors

When a request fails, `ApiClient` throws an `ApiError` instance with:

- `status` / `statusText`
- `data` (parsed JSON or text payload when available)
- `request` metadata (URL, method, headers)
- `response` (native `Response` when present)
- `isNetworkError`
- `retries` (number of attempts made)

```js
try {
  await apiClient.post('/users', formValues);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 422) {
      return setFormErrors(error.data?.errors ?? {});
    }
  }

  throw error; // Let ErrorBoundary/global handler surface the issue
}
```

By default, errors are reported via `globalErrorHandler` (Sentry + dev console).
Suppress reporting when the caller handles the error explicitly:

```js
await apiClient.get('/search', { suppressErrorReporting: true });
```

---

## Working with raw responses

To access the original `Response` object alongside parsed data, set `raw: true`:

```js
const { data, response } = await apiClient.get('/files/report', {
  raw: true,
  parse: (res) => res.blob(),
});
```

---

## Testing Helpers

The `ApiClient` constructor accepts a `fetchImplementation`, making it simple to
inject `jest.fn()` mocks in unit tests:

```js
import { ApiClient } from 'services';

const fetchMock = jest.fn().mockResolvedValue(mockResponse);
const client = new ApiClient({ fetchImplementation: fetchMock });
```

See `tests/services/ApiClient.test.js` for comprehensive examples covering
retries, interceptors, raw responses, and error propagation.

---

## When to create additional instances

- Different base URL (microservices, third-party APIs)
- Alternative credentials (cookies vs. tokens)
- Separate retry policies (idempotent vs. non-idempotent endpoints)
- Custom analytics or logging requirements

Keep shared interceptors (auth, telemetry) within the singleton instance to
avoid duplication.
