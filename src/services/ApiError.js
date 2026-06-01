class ApiError extends Error {
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
