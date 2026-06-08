/**
 * Generic HTTP client built on the Fetch API.
 *
 * Features: request/response/error interceptors, automatic retry with
 * exponential back-off, configurable timeout via `AbortController`, JSON
 * serialisation/deserialisation, query-parameter building, and Sentry
 * breadcrumb integration via `globalErrorHandler`.
 *
 * @module services/ApiClient
 */
import ApiError from './ApiError';
import { delay, exponentialBackoffDelay } from './retry';
import globalErrorHandler from 'utils/errorHandler';

const DEFAULT_TIMEOUT = 15000;
const FALLBACK_BASE_URL =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

const METHOD_WITHOUT_BODY = new Set(['GET', 'HEAD']);

const FormDataCtor = globalThis.FormData;
const URLSearchParamsCtor = globalThis.URLSearchParams;
const BlobCtor = globalThis.Blob;
const HeadersCtor = globalThis.Headers;
const URLCtor = globalThis.URL;
const AbortControllerCtor = globalThis.AbortController;
const DOMExceptionCtor = globalThis.DOMException;

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}

function normalizeHeaders(...sources) {
  const map = new Map();

  sources.forEach((source) => {
    if (!source) {
      return;
    }

    if (HeadersCtor && source instanceof HeadersCtor) {
      source.forEach((value, key) => {
        map.set(key, value);
      });
      return;
    }

    if (typeof source === 'object') {
      Object.entries(source).forEach(([key, value]) => {
        map.set(key, value);
      });
    }
  });

  return map;
}

function isFormData(value) {
  return typeof FormDataCtor !== 'undefined' && value instanceof FormDataCtor;
}

function isURLSearchParams(value) {
  return (
    typeof URLSearchParamsCtor !== 'undefined' &&
    value instanceof URLSearchParamsCtor
  );
}

function isBlob(value) {
  return typeof BlobCtor !== 'undefined' && value instanceof BlobCtor;
}

function shouldTreatAsJson(data) {
  if (data == null) {
    return false;
  }

  if (typeof data === 'string') {
    return false;
  }

  if (isBlob(data) || data instanceof ArrayBuffer) {
    return false;
  }

  if (isFormData(data) || isURLSearchParams(data)) {
    return false;
  }

  return typeof data === 'object';
}

const defaultRetryConfig = {
  retries: 2,
  retryDelay: (attempt) =>
    exponentialBackoffDelay(attempt, { baseDelay: 250, maxDelay: 2000 }),
  shouldRetry: (response, error) => {
    if (error) {
      // Retry network errors and aborted requests (timeout handled separately)
      return error.isNetworkError || error.name === 'AbortError';
    }

    if (!response) {
      return false;
    }

    return response.status >= 500 || response.status === 429;
  },
};

function mergeRetryConfig(base, override = {}) {
  return {
    ...base,
    ...override,
    retryDelay: override.retryDelay || base.retryDelay,
    shouldRetry: override.shouldRetry || base.shouldRetry,
  };
}

/**
 * HTTP client with interceptors, retry logic, and timeout support.
 *
 * @example
 * const client = new ApiClient({ baseURL: 'https://api.example.com' });
 * const data = await client.get('/users');
 */
class ApiClient {
  /**
   * @param {Object} [options={}]
   * @param {string} [options.baseURL] - Base URL prepended to all relative paths. Defaults to `VITE_API_BASE_URL`.
   * @param {Record<string, string>} [options.defaultHeaders] - Headers included on every request.
   * @param {number} [options.timeout=15000] - Request timeout in milliseconds.
   * @param {Object} [options.retry] - Retry configuration overrides.
   * @param {Function} [options.fetchImplementation] - Custom fetch function (useful for testing).
   * @param {RequestCredentials} [options.credentials] - Default credentials mode.
   */
  constructor(options = {}) {
    const {
      baseURL = import.meta.env.VITE_API_BASE_URL || '',
      defaultHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout = DEFAULT_TIMEOUT,
      retry = {},
      fetchImplementation,
      credentials,
    } = options;

    this.baseURL = baseURL;
    this.defaultHeaders = { ...defaultHeaders };
    this.timeout = timeout;
    this.retryConfig = mergeRetryConfig(defaultRetryConfig, retry);
    this.fetch =
      fetchImplementation ||
      (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    this.defaultCredentials = credentials;

    this.interceptors = {
      request: [],
      response: [],
      error: [],
    };

    if (!this.fetch) {
      throw new Error(
        'ApiClient requires a fetch implementation in this environment.',
      );
    }
  }

  /**
   * Registers a request interceptor. Returns a function that removes it.
   *
   * @param {Function} interceptor - Receives `(requestConfig, options)` and returns the (optionally modified) config.
   * @returns {() => void} Cleanup function that removes the interceptor.
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
    return () => {
      this.interceptors.request = this.interceptors.request.filter(
        (fn) => fn !== interceptor,
      );
    };
  }

  /**
   * Registers a response interceptor. Returns a function that removes it.
   *
   * @param {Function} interceptor - Receives `(result, options)` and returns the (optionally modified) result.
   * @returns {() => void} Cleanup function that removes the interceptor.
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
    return () => {
      this.interceptors.response = this.interceptors.response.filter(
        (fn) => fn !== interceptor,
      );
    };
  }

  /**
   * Registers an error interceptor. Returns a function that removes it.
   *
   * @param {Function} interceptor - Receives `(error, context, options)` and returns the (optionally modified) error.
   * @returns {() => void} Cleanup function that removes the interceptor.
   */
  addErrorInterceptor(interceptor) {
    this.interceptors.error.push(interceptor);
    return () => {
      this.interceptors.error = this.interceptors.error.filter(
        (fn) => fn !== interceptor,
      );
    };
  }

  /**
   * Core request method. Handles retries, interceptors, and error normalisation.
   *
   * @param {string} method - HTTP method (e.g. `'GET'`, `'POST'`).
   * @param {string} path - URL path or absolute URL.
   * @param {Object} [options={}] - Request options.
   * @returns {Promise<unknown>} Parsed response body (or full result when `options.raw` is true).
   * @throws {ApiError} On non-2xx responses or unrecoverable network errors.
   */
  async request(method, path, options = {}) {
    const requestContext = await this.prepareRequest(method, path, options);
    const retryConfig = mergeRetryConfig(this.retryConfig, options.retry);
    const maxAttempts = retryConfig.retries + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const attemptContext = { ...requestContext, attempt };

      try {
        const response = await this.performFetch(attemptContext);

        if (!response.ok) {
          const error = await ApiError.fromResponse(
            response,
            attemptContext,
            attempt,
          );
          const shouldRetry =
            attempt < retryConfig.retries &&
            (await retryConfig.shouldRetry(
              response,
              null,
              attempt,
              attemptContext,
            ));

          if (shouldRetry) {
            await this.handleRetry(retryConfig, options, attempt, {
              response,
              error,
              request: attemptContext,
            });
            continue;
          }

          const finalError = await this.handleError(
            error,
            options,
            attemptContext,
            attempt,
            response,
          );
          throw finalError;
        }

        const data = await this.parseResponse(response.clone(), options.parse);
        const processed = await this.applyResponseInterceptors(
          { data, response, request: attemptContext, attempt },
          options,
        );

        return processed;
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : ApiError.fromNetworkError(error, attemptContext, attempt);

        const shouldRetry =
          attempt < retryConfig.retries &&
          (await retryConfig.shouldRetry(
            apiError.response,
            apiError,
            attempt,
            attemptContext,
          ));

        if (shouldRetry) {
          await this.handleRetry(retryConfig, options, attempt, {
            error: apiError,
            request: attemptContext,
          });
          continue;
        }

        const finalError = await this.handleError(
          apiError,
          options,
          attemptContext,
          attempt,
          apiError.response,
        );
        throw finalError;
      }
    }

    throw new Error(
      'ApiClient: exhausted retry attempts without returning or throwing.',
    );
  }

  /**
   * Sends a GET request and returns the parsed response body.
   *
   * @param {string} path - URL path.
   * @param {Object} [options] - Request options.
   * @returns {Promise<unknown>}
   * @throws {ApiError}
   */
  async get(path, options) {
    const result = await this.request('GET', path, options);
    return options && options.raw ? result : result.data;
  }

  /**
   * Sends a DELETE request and returns the parsed response body.
   *
   * @param {string} path - URL path.
   * @param {Object} [options] - Request options.
   * @returns {Promise<unknown>}
   * @throws {ApiError}
   */
  async delete(path, options) {
    const result = await this.request('DELETE', path, options);
    return options && options.raw ? result : result.data;
  }

  /**
   * Sends a POST request with `data` as the body and returns the parsed response.
   *
   * @param {string} path - URL path.
   * @param {unknown} data - Request body.
   * @param {Object} [options={}] - Request options.
   * @returns {Promise<unknown>}
   * @throws {ApiError}
   */
  async post(path, data, options = {}) {
    const result = await this.request('POST', path, { ...options, data });
    return options && options.raw ? result : result.data;
  }

  /**
   * Sends a PUT request with `data` as the body and returns the parsed response.
   *
   * @param {string} path - URL path.
   * @param {unknown} data - Request body.
   * @param {Object} [options={}] - Request options.
   * @returns {Promise<unknown>}
   * @throws {ApiError}
   */
  async put(path, data, options = {}) {
    const result = await this.request('PUT', path, { ...options, data });
    return options && options.raw ? result : result.data;
  }

  /**
   * Sends a PATCH request with `data` as the body and returns the parsed response.
   *
   * @param {string} path - URL path.
   * @param {unknown} data - Request body.
   * @param {Object} [options={}] - Request options.
   * @returns {Promise<unknown>}
   * @throws {ApiError}
   */
  async patch(path, data, options = {}) {
    const result = await this.request('PATCH', path, { ...options, data });
    return options && options.raw ? result : result.data;
  }

  async prepareRequest(method, path, options) {
    const {
      params,
      headers = {},
      data,
      baseURL,
      timeout,
      signal,
      credentials,
      fetchOptions = {},
      context = {},
      raw,
    } = options;

    const resolvedMethod = method.toUpperCase();
    const resolvedBaseURL = baseURL ?? this.baseURL;
    const url = this.buildURL(path, params, resolvedBaseURL);

    const headerMap = normalizeHeaders(
      this.defaultHeaders,
      headers,
      fetchOptions.headers,
    );

    let body = fetchOptions.body;
    const canHaveBody = !METHOD_WITHOUT_BODY.has(resolvedMethod);

    if (canHaveBody && data !== undefined) {
      if (
        isFormData(data) ||
        isBlob(data) ||
        data instanceof ArrayBuffer ||
        isURLSearchParams(data)
      ) {
        body = data;
        if (isFormData(data)) {
          headerMap.delete('Content-Type');
        }
      } else if (shouldTreatAsJson(data)) {
        body = JSON.stringify(data);
        if (!headerMap.has('Content-Type')) {
          headerMap.set('Content-Type', 'application/json');
        }
      } else {
        body = data;
      }
    }

    if (!canHaveBody && (body === undefined || body === null)) {
      headerMap.delete('Content-Type');
    }

    const finalHeaders = Object.fromEntries(headerMap.entries());

    const requestConfig = {
      url,
      options: {
        method: resolvedMethod,
        headers: finalHeaders,
        body,
        credentials: credentials ?? this.defaultCredentials,
        ...fetchOptions,
      },
      context: {
        ...context,
        raw: Boolean(raw),
        timeout: timeout ?? this.timeout,
      },
    };

    if (signal) {
      requestConfig.options.signal = signal;
    }

    return this.applyRequestInterceptors(requestConfig, options);
  }

  async applyRequestInterceptors(request, options) {
    let current = request;

    for (const interceptor of this.interceptors.request) {
      current = (await interceptor(current, options)) || current;
    }

    return current;
  }

  async applyResponseInterceptors(result, options) {
    let current = result;

    for (const interceptor of this.interceptors.response) {
      current = (await interceptor(current, options)) || current;
    }

    return current;
  }

  async applyErrorInterceptors(error, context, options) {
    let currentError = error;

    for (const interceptor of this.interceptors.error) {
      const interceptedError = await interceptor(
        currentError,
        context,
        options,
      );
      if (interceptedError instanceof Error) {
        currentError = interceptedError;
      } else if (interceptedError !== undefined && interceptedError !== null) {
        currentError = interceptedError;
      }
    }

    return currentError;
  }

  buildURL(path, params, baseURL) {
    const base = baseURL || FALLBACK_BASE_URL;

    if (isAbsoluteUrl(path)) {
      if (!URLCtor) {
        throw new Error('ApiClient requires URL support in this environment.');
      }

      return this.appendQueryParameters(new URLCtor(path), params).toString();
    }

    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

    if (!URLCtor) {
      throw new Error('ApiClient requires URL support in this environment.');
    }

    const url = new URLCtor(normalizedPath, normalizedBase);

    return this.appendQueryParameters(url, params).toString();
  }

  appendQueryParameters(url, params) {
    if (!params) {
      return url;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            url.searchParams.append(key, item);
          }
        });
        return;
      }
      url.searchParams.append(key, value);
    });

    return url;
  }

  async performFetch(request) {
    const { url, options: fetchOptions, context } = request;
    const timeout = context.timeout ?? this.timeout;

    const controller =
      typeof AbortControllerCtor !== 'undefined'
        ? new AbortControllerCtor()
        : null;
    let timeoutId;

    if (controller) {
      if (fetchOptions.signal) {
        if (fetchOptions.signal.aborted) {
          controller.abort(fetchOptions.signal.reason);
        } else {
          fetchOptions.signal.addEventListener(
            'abort',
            () => {
              controller.abort(fetchOptions.signal.reason);
            },
            { once: true },
          );
        }
      }

      fetchOptions.signal = controller.signal;
    }

    if (controller && timeout && Number.isFinite(timeout)) {
      timeoutId = setTimeout(() => {
        if (typeof controller.abort === 'function') {
          const abortReason =
            typeof DOMExceptionCtor !== 'undefined'
              ? new DOMExceptionCtor('Request timed out', 'AbortError')
              : new Error('Request timed out');
          controller.abort(abortReason);
        }
      }, timeout);
    }

    try {
      globalErrorHandler.addBreadcrumb?.({
        category: 'api',
        message: `${fetchOptions.method} ${url}`,
        level: 'info',
      });

      return await this.fetch(url, fetchOptions);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  async parseResponse(response, parse) {
    if (typeof parse === 'function') {
      return parse(response);
    }

    if (response.status === 204 || response.status === 205) {
      return null;
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return response.json();
    }

    if (contentType.includes('text/')) {
      return response.text();
    }

    if (contentType.includes('application/octet-stream')) {
      return response.arrayBuffer();
    }

    return response.blob();
  }

  async handleRetry(retryConfig, options, attempt, context) {
    const delayMs = retryConfig.retryDelay(attempt, context);

    if (typeof options.onRetry === 'function') {
      await options.onRetry({ attempt: attempt + 1, ...context });
    }

    if (delayMs && delayMs > 0) {
      await delay(delayMs);
    }
  }

  async handleError(error, options, requestContext, attempt, response) {
    const context = {
      request: requestContext,
      attempt,
      response,
    };

    const processedError = await this.applyErrorInterceptors(
      error,
      context,
      options,
    );
    const finalError = processedError instanceof Error ? processedError : error;

    if (!options.suppressErrorReporting) {
      globalErrorHandler.reportError?.(finalError, {
        url: requestContext.url,
        method: requestContext.options.method,
        status: finalError.status,
        isNetworkError: finalError.isNetworkError,
        retries: attempt,
      });
    }

    return finalError;
  }
}

export default ApiClient;
