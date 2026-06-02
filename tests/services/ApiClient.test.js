import ApiClient from 'services/ApiClient';
import ApiError from 'services/ApiError';

jest.mock('utils/errorHandler', () => ({
  addBreadcrumb: jest.fn(),
  reportError: jest.fn(),
}));

function makeResponse({ status = 200, body = {}, contentType = 'application/json' } = {}) {
  const clone = () => makeResponse({ status, body, contentType });
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : `Error ${status}`,
    headers: {
      get: (key) => {
        if (key === 'content-type') return contentType;
        if (key === 'content-length') return null;
        return null;
      },
    },
    json: async () => body,
    text: async () => String(body),
    blob: async () => new Blob([String(body)]),
    clone,
  };
}

function makeClient(options = {}) {
  return new ApiClient({
    baseURL: 'https://api.example.com',
    retry: { retries: 0 },
    ...options,
  });
}

describe('ApiClient — basic HTTP methods', () => {
  let mockFetch;
  let client;

  beforeEach(() => {
    mockFetch = jest.fn();
    client = makeClient({ fetchImplementation: mockFetch });
  });

  it('get() makes a GET request and returns parsed data', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ body: { id: 1 } }));
    const data = await client.get('/users/1');
    expect(data).toEqual({ id: 1 });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('post() sends JSON body', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ status: 201, body: { id: 2 } }));
    const data = await client.post('/users', { name: 'Alice' });
    expect(data).toEqual({ id: 2 });
    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ name: 'Alice' });
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('put() sends JSON body', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ body: { updated: true } }));
    await client.put('/users/1', { name: 'Bob' });
    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('PUT');
  });

  it('patch() sends JSON body', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ body: {} }));
    await client.patch('/users/1', { active: false });
    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('PATCH');
  });

  it('delete() makes a DELETE request', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ status: 204, contentType: 'text/plain', body: '' }));
    await client.delete('/users/1');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('DELETE');
  });

  it('throws ApiError on 4xx response', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ status: 404, body: { error: 'not found' } }));
    await expect(client.get('/missing')).rejects.toThrow(ApiError);
  });

  it('throws ApiError on 5xx response', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ status: 500, body: 'error' }));
    await expect(client.get('/broken')).rejects.toThrow(ApiError);
  });

  it('does not include body for GET requests', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ body: [] }));
    await client.get('/items');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.body).toBeUndefined();
  });
});

describe('ApiClient — URL building', () => {
  let mockFetch;
  let client;

  beforeEach(() => {
    mockFetch = jest.fn().mockResolvedValue(makeResponse({ body: [] }));
    client = makeClient({ fetchImplementation: mockFetch });
  });

  it('appends scalar query params', async () => {
    await client.get('/items', { params: { page: 1, limit: 10 } });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('page=1');
    expect(url).toContain('limit=10');
  });

  it('appends array query params as repeated keys', async () => {
    await client.get('/items', { params: { ids: [1, 2, 3] } });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('ids=1');
    expect(url).toContain('ids=2');
    expect(url).toContain('ids=3');
  });

  it('omits null and undefined params', async () => {
    await client.get('/items', { params: { a: null, b: undefined, c: 'keep' } });
    const [url] = mockFetch.mock.calls[0];
    expect(url).not.toContain('a=');
    expect(url).not.toContain('b=');
    expect(url).toContain('c=keep');
  });
});

describe('ApiClient — retry logic', () => {
  it('retries on 500 and succeeds on second attempt', async () => {
    const mockFetch = jest.fn()
      .mockResolvedValueOnce(makeResponse({ status: 500, body: 'error' }))
      .mockResolvedValueOnce(makeResponse({ body: { ok: true } }));
    const client = makeClient({
      fetchImplementation: mockFetch,
      retry: { retries: 1, retryDelay: () => 0 },
    });
    const data = await client.get('/flaky');
    expect(data).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('retries on 429', async () => {
    const mockFetch = jest.fn()
      .mockResolvedValueOnce(makeResponse({ status: 429, body: '' }))
      .mockResolvedValueOnce(makeResponse({ body: {} }));
    const client = makeClient({
      fetchImplementation: mockFetch,
      retry: { retries: 1, retryDelay: () => 0 },
    });
    await client.get('/rate-limited');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry on 4xx (non-429)', async () => {
    const mockFetch = jest.fn()
      .mockResolvedValue(makeResponse({ status: 404, body: {} }));
    const client = makeClient({
      fetchImplementation: mockFetch,
      retry: { retries: 2, retryDelay: () => 0 },
    });
    await expect(client.get('/gone')).rejects.toThrow(ApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('calls onRetry callback on each retry', async () => {
    const onRetry = jest.fn();
    const mockFetch = jest.fn()
      .mockResolvedValueOnce(makeResponse({ status: 500, body: '' }))
      .mockResolvedValueOnce(makeResponse({ body: {} }));
    const client = makeClient({
      fetchImplementation: mockFetch,
      retry: { retries: 1, retryDelay: () => 0 },
    });
    await client.get('/flaky', { onRetry });
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({ attempt: 1 }));
  });
});

describe('ApiClient — interceptors', () => {
  it('request interceptor can add a custom header', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeResponse({ body: {} }));
    const client = makeClient({ fetchImplementation: mockFetch });
    client.addRequestInterceptor((req) => ({
      ...req,
      options: { ...req.options, headers: { ...req.options.headers, 'X-Trace-Id': 'abc123' } },
    }));
    await client.get('/test');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['X-Trace-Id']).toBe('abc123');
  });

  it('removing interceptor via returned unsubscribe stops it running', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeResponse({ body: {} }));
    const client = makeClient({ fetchImplementation: mockFetch });
    const interceptor = jest.fn((req) => req);
    const unsubscribe = client.addRequestInterceptor(interceptor);
    unsubscribe();
    await client.get('/test');
    expect(interceptor).not.toHaveBeenCalled();
  });

  it('response interceptor receives parsed data', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeResponse({ body: { raw: true } }));
    const client = makeClient({ fetchImplementation: mockFetch });
    const responseInterceptor = jest.fn((result) => result);
    client.addResponseInterceptor(responseInterceptor);
    await client.get('/test');
    expect(responseInterceptor).toHaveBeenCalledWith(
      expect.objectContaining({ data: { raw: true } }),
      expect.anything()
    );
  });
});
