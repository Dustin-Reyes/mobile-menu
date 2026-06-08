/**
 * Structured error class for HTTP and network failures.
 *
 * Thrown by `ApiClient` on non-2xx responses and network errors.
 * Carries the HTTP status code, parsed response body, original request
 * context, and a flag distinguishing network failures from HTTP errors.
 *
 * @module services/ApiError
 */

/**
 * Represents an API request failure.
 *
 * @extends {Error}
 */
class ApiError extends Error {
  /**
   * @param {string} message - Human-readable error description.
   * @param {Object} [options={}]
   * @param {number | null} [options.status] - HTTP status code.
   * @param {string} [options.statusText] - HTTP status text.
   * @param {unknown} [options.data] - Parsed response body.
   * @param {Object | null} [options.request] - Original request context.
   * @param {Response | null} [options.response] - Raw Fetch `Response`.
   * @param {boolean} [options.isNetworkError=false] - `true` for network-level failures.
   * @param {number} [options.retries=0] - Number of retries attempted.
   */
  constructor(message, options = {}) {
    super(message);

    const {
      status = null,
      statusText = '',
      data = null,
      request = null,
      response = null,
      isNetworkError = false,
      retries = 0,
    } = options;

    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.request = request;
    this.response = response;
    this.isNetworkError = isNetworkError;
    this.retries = retries;
  }

  /**
   * Constructs an `ApiError` from a non-2xx `Response`.
   * Attempts to parse the body as JSON; falls back to text.
   *
   * @param {Response} response - The failed Fetch response.
   * @param {Object} request - Original request context.
   * @param {number} [retries=0] - Number of retries that were attempted.
   * @returns {Promise<ApiError>}
   */
  static async fromResponse(response, request, retries = 0) {
    let payload = null;

    try {
      // Attempt to parse response as JSON, otherwise fallback to text
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        payload = await response.clone().json();
      } else {
        payload = await response.clone().text();
      }
    } catch (error) {
      payload = null;

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('ApiError: failed to parse error payload', error);
      }
    }

    const message = `Request failed with status ${response.status}`;
    return new ApiError(message, {
      status: response.status,
      statusText: response.statusText,
      data: payload,
      request,
      response,
      isNetworkError: false,
      retries,
    });
  }

  /**
   * Constructs an `ApiError` from a network-level error (e.g. no connection, AbortError).
   *
   * @param {Error} error - The original network error.
   * @param {Object} request - Original request context.
   * @param {number} [retries=0] - Number of retries that were attempted.
   * @returns {ApiError}
   */
  static fromNetworkError(error, request, retries = 0) {
    return new ApiError(error.message, {
      request,
      response: null,
      status: null,
      statusText: '',
      data: null,
      isNetworkError: true,
      retries,
    });
  }
}

export default ApiError;
