import { translateText, translateFields } from 'services/translate';

// Mock config/firebase so we can control auth.currentUser per test
jest.mock('config/firebase', () => ({
  auth: { currentUser: null },
}));

import { auth } from 'config/firebase';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockMyMemoryResponse(translatedText = 'hola') {
  return {
    json: async () => ({
      responseStatus: 200,
      responseData: { translatedText },
    }),
  };
}

function mockFunctionResponse({
  ok = true,
  body = { translatedText: 'hola' },
} = {}) {
  return {
    ok,
    status: ok ? 200 : 401,
    json: async () => body,
  };
}

// ─── Production mode (DEV = false) ────────────────────────────────────────────

describe('translateText — production mode', () => {
  beforeEach(() => {
    global['import'].meta.env.DEV = false;
    global.fetch = jest.fn();
    auth.currentUser = null;
  });

  afterEach(() => {
    global['import'].meta.env.DEV = true;
  });

  it('throws if no user is authenticated', async () => {
    auth.currentUser = null;
    await expect(translateText('hello', 'es')).rejects.toThrow(
      'Not authenticated',
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends an Authorization Bearer token from the current user', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('test-id-token'),
    };
    global.fetch.mockResolvedValueOnce(mockFunctionResponse());

    await translateText('hello', 'es');

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/.netlify/functions/translate');
    expect(options.headers['Authorization']).toBe('Bearer test-id-token');
  });

  it('sends the text, targetLang, and sourceLang in the request body', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('token'),
    };
    global.fetch.mockResolvedValueOnce(mockFunctionResponse());

    await translateText('good morning', 'es', 'en');

    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body).toEqual({
      text: 'good morning',
      targetLang: 'es',
      sourceLang: 'en',
    });
  });

  it('returns the translatedText from the function response', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('token'),
    };
    global.fetch.mockResolvedValueOnce(
      mockFunctionResponse({ body: { translatedText: 'buenos días' } }),
    );

    const result = await translateText('good morning', 'es');
    expect(result).toBe('buenos días');
  });

  it('throws with the error message when the function returns a non-ok response', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('token'),
    };
    global.fetch.mockResolvedValueOnce(
      mockFunctionResponse({ ok: false, body: { error: 'Unauthorized' } }),
    );

    await expect(translateText('hello', 'es')).rejects.toThrow('Unauthorized');
  });
});

// ─── Dev mode (DEV = true) ────────────────────────────────────────────────────

describe('translateText — dev mode', () => {
  beforeEach(() => {
    global['import'].meta.env.DEV = true;
    global.fetch = jest.fn();
  });

  it('calls MyMemory directly without hitting the Netlify function', async () => {
    global.fetch.mockResolvedValueOnce(mockMyMemoryResponse('hola'));

    await translateText('hello', 'es');

    const [url] = global.fetch.mock.calls[0];
    expect(url).toContain('api.mymemory.translated.net');
    expect(url).not.toContain('netlify');
  });

  it('does not send an Authorization header in dev mode', async () => {
    global.fetch.mockResolvedValueOnce(mockMyMemoryResponse('hola'));

    await translateText('hello', 'es');

    const [, options] = global.fetch.mock.calls[0];
    expect(options?.headers?.Authorization).toBeUndefined();
  });

  it('returns the translatedText from MyMemory', async () => {
    global.fetch.mockResolvedValueOnce(mockMyMemoryResponse('buenas noches'));

    const result = await translateText('good night', 'es');
    expect(result).toBe('buenas noches');
  });

  it('throws when MyMemory returns a non-200 responseStatus', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ responseStatus: 429, responseData: {} }),
    });

    await expect(translateText('hello', 'es')).rejects.toThrow('429');
  });
});

// ─── translateFields ───────────────────────────────────────────────────────────

describe('translateFields — dev mode', () => {
  beforeEach(() => {
    global['import'].meta.env.DEV = true;
    global.fetch = jest.fn();
  });

  it('translates each string value in a flat object', async () => {
    global.fetch
      .mockResolvedValueOnce(mockMyMemoryResponse('Hola'))
      .mockResolvedValueOnce(mockMyMemoryResponse('Mundo'));

    const result = await translateFields(
      { greeting: 'Hello', noun: 'World' },
      'es',
    );
    expect(result).toEqual({ greeting: 'Hola', noun: 'Mundo' });
  });

  it('passes non-string values through unchanged', async () => {
    global.fetch.mockResolvedValueOnce(mockMyMemoryResponse('Hola'));

    const result = await translateFields(
      { greeting: 'Hello', count: 42, tags: ['a', 'b'] },
      'es',
    );
    expect(result.count).toBe(42);
    expect(result.tags).toEqual(['a', 'b']);
    expect(result.greeting).toBe('Hola');
  });
});
