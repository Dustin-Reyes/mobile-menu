import ApiError from 'services/ApiError';

describe('ApiError constructor', () => {
  it('is an instance of Error and ApiError', () => {
    const err = new ApiError('something failed');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('something failed');
  });

  it('stores all option fields with defaults', () => {
    const err = new ApiError('msg');
    expect(err.status).toBeNull();
    expect(err.statusText).toBe('');
    expect(err.data).toBeNull();
    expect(err.request).toBeNull();
    expect(err.response).toBeNull();
    expect(err.isNetworkError).toBe(false);
    expect(err.retries).toBe(0);
  });

  it('stores provided options', () => {
    const request = { url: '/test' };
    const err = new ApiError('not found', {
      status: 404,
      statusText: 'Not Found',
      data: { error: 'missing' },
      request,
      isNetworkError: false,
      retries: 2,
    });
    expect(err.status).toBe(404);
    expect(err.statusText).toBe('Not Found');
    expect(err.data).toEqual({ error: 'missing' });
    expect(err.request).toBe(request);
    expect(err.retries).toBe(2);
  });
});

describe('ApiError.fromResponse', () => {
  function makeResponse({ status, contentType, body }) {
    return {
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: { get: (key) => (key === 'content-type' ? contentType : null) },
      clone: () => ({
        json: async () => (typeof body === 'object' ? body : JSON.parse(body)),
        text: async () => String(body),
      }),
    };
  }

  it('creates ApiError with status and JSON data', async () => {
    const response = makeResponse({
      status: 422,
      contentType: 'application/json',
      body: { error: 'invalid input' },
    });
    const err = await ApiError.fromResponse(response, {}, 0);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(422);
    expect(err.data).toEqual({ error: 'invalid input' });
    expect(err.isNetworkError).toBe(false);
    expect(err.message).toContain('422');
  });

  it('creates ApiError with text data for non-JSON response', async () => {
    const response = makeResponse({
      status: 500,
      contentType: 'text/plain',
      body: 'Internal Server Error',
    });
    const err = await ApiError.fromResponse(response, {}, 0);
    expect(err.data).toBe('Internal Server Error');
  });

  it('stores retries count', async () => {
    const response = makeResponse({
      status: 503,
      contentType: 'text/plain',
      body: '',
    });
    const err = await ApiError.fromResponse(response, {}, 3);
    expect(err.retries).toBe(3);
  });
});

describe('ApiError.fromNetworkError', () => {
  it('creates ApiError with isNetworkError=true', () => {
    const networkErr = new TypeError('Failed to fetch');
    const err = ApiError.fromNetworkError(networkErr, {}, 0);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.isNetworkError).toBe(true);
    expect(err.message).toBe('Failed to fetch');
    expect(err.status).toBeNull();
    expect(err.response).toBeNull();
  });

  it('stores retries count', () => {
    const err = ApiError.fromNetworkError(new Error('net'), {}, 2);
    expect(err.retries).toBe(2);
  });
});
