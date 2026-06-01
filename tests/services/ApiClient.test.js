import { TextEncoder } from 'util';
import ApiClient from '../../src/services/ApiClient';
import ApiError from '../../src/services/ApiError';

jest.mock('../../src/services/retry', () => ({
  delay: jest.fn(() => Promise.resolve()),
  exponentialBackoffDelay: jest.fn((attempt) => 100 * attempt + 50),
}));

jest.mock('utils/errorHandler', () => ({
  __esModule: true,
  default: {
    addBreadcrumb: jest.fn(),
    reportError: jest.fn(),
  },
}));

describe('ApiClient', () => {
  const { delay } = jest.requireMock('../../src/services/retry');
  const mockErrorHandler = jest.requireMock('utils/errorHandler').default;

  const createHeaders = (init = {}) => {
    const store = new Map();
    Object.entries(init).forEach(([key, value]) => {
      store.set(key.toLowerCase(), value);
    });

    return {
      get: (name) => store.get(name.toLowerCase()) ?? null,
      forEach: (callback) => {
        store.forEach((value, key) => {
          callback(value, key);
        });
      },
      set: (name, value) => {
        store.set(name.toLowerCase(), value);
      },
      delete: (name) => {
        store.delete(name.toLowerCase());
      },
    };
  };

  const createResponse = (body, init = {}) => {
    const headers = createHeaders(init.headers || {});
    const serialized =
      typeof body === 'string' ? body : JSON.stringify(body ?? {});

    const response = {
      ok: init.status ? init.status >= 200 && init.status < 300 : true,
      status: init.status ?? 200,
      statusText: init.statusText ?? 'OK',
      headers,
      clone: () => createResponse(body, init),
      json: async () => (typeof body === 'string' ? JSON.parse(body) : body),
      text: async () => serialized,
      arrayBuffer: async () => new TextEncoder().encode(serialized).buffer,
      blob: async () => ({
        size: serialized.length,
        type: headers.get('content-type') || 'application/octet-stream',
      }),
    };

    return response;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockErrorHandler.addBreadcrumb.mockReset();
    mockErrorHandler.reportError.mockReset();
  });

  const createClient = (fetchImpl, options = {}) =>
    new ApiClient({
      fetchImplementation: fetchImpl,
      retry: { retries: 2 },
      ...options,
    });

  it('performs GET request and returns parsed data', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      createResponse(
        { id: 1, name: 'Alice' },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const client = createClient(fetchMock, {
      baseURL: 'https://api.example.com',
    });

    const result = await client.get('/users/1', {
      parse: (response) => response.json(),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/users/1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Accept: 'application/json',
        }),
        body: undefined,
        credentials: undefined,
      }),
    );

    expect(result).toEqual({ id: 1, name: 'Alice' });
  });

  it('retries failed requests before succeeding', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        createResponse(
          { message: 'server error' },
          {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
      .mockResolvedValueOnce(
        createResponse(
          { id: 2 },
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

    const onRetry = jest.fn();
    const client = createClient(fetchMock);

    const result = await client.get('/users/2', {
      parse: (response) => response.json(),
      onRetry,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(delay).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(
      expect.objectContaining({ attempt: 1, response: expect.any(Object) }),
    );
    expect(result).toEqual({ id: 2 });
  });

  it('serializes query parameters correctly', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(
        createResponse(
          { results: [1, 2, 3] },
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

    const client = createClient(fetchMock, {
      baseURL: 'https://api.example.com',
    });

    await client.get('/search', {
      params: {
        term: 'widgets',
        limit: 10,
        filter: ['new', 'popular'],
        empty: null,
      },
      parse: (response) => response.json(),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/search?term=widgets&limit=10&filter=new&filter=popular',
      expect.any(Object),
    );
  });

  it('applies request and response interceptors', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(
        createResponse(
          { ok: true },
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

    const client = createClient(fetchMock);

    client.addRequestInterceptor(async (request) => ({
      ...request,
      options: {
        ...request.options,
        headers: {
          ...request.options.headers,
          Authorization: 'Bearer token',
        },
      },
    }));

    client.addResponseInterceptor(async (result) => ({
      ...result,
      data: { ...result.data, intercepted: true },
    }));

    const data = await client.post(
      '/do-something',
      { value: 42 },
      {
        parse: (response) => response.json(),
      },
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/do-something',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
    expect(data).toEqual({ ok: true, intercepted: true });
  });

  it('returns raw response payload when requested', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(
        createResponse(
          { value: 123 },
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

    const client = createClient(fetchMock);

    const result = await client.get('/raw', {
      raw: true,
      parse: (response) => response.json(),
    });

    expect(result).toEqual(
      expect.objectContaining({
        data: { value: 123 },
        response: expect.objectContaining({ status: 200 }),
        request: expect.objectContaining({ url: 'http://localhost/raw' }),
      }),
    );
  });

  it('invokes error interceptors and reports errors', async () => {
    const networkError = new Error('Network down');
    const fetchMock = jest.fn().mockRejectedValue(networkError);

    const client = createClient(fetchMock, { retry: { retries: 0 } });

    const transformedError = new ApiError('Transformed error');
    client.addErrorInterceptor(async (error) => {
      expect(error).toBeInstanceOf(ApiError);
      return transformedError;
    });

    await expect(
      client.get('/fail', {
        parse: (response) => response.json(),
      }),
    ).rejects.toBe(transformedError);

    expect(mockErrorHandler.reportError).toHaveBeenCalledWith(
      transformedError,
      expect.objectContaining({
        isNetworkError: false,
        method: 'GET',
        retries: 0,
        status: null,
        url: 'http://localhost/fail',
      }),
    );
  });

  it('suppresses error reporting when suppressErrorReporting is true', async () => {
    const errorResponse = createResponse(
      { message: 'bad request' },
      {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const fetchMock = jest.fn().mockResolvedValue(errorResponse);
    const client = createClient(fetchMock, { retry: { retries: 0 } });

    await expect(
      client.get('/bad', {
        suppressErrorReporting: true,
        parse: (response) => response.json(),
      }),
    ).rejects.toBeInstanceOf(ApiError);

    expect(mockErrorHandler.reportError).not.toHaveBeenCalled();
  });
});
