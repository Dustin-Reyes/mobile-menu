import { translateText, translateFields } from '../../src/services/translate';

beforeEach(() => {
  global.fetch = jest.fn();
  // Tests exercise the production path (Netlify function proxy)
  import.meta.env.DEV = false;
});

afterEach(() => {
  import.meta.env.DEV = true;
  jest.resetAllMocks();
});

describe('translateText', () => {
  it('calls the Netlify function with correct payload and returns translated text', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ translatedText: 'Hola mundo' }),
    });

    const result = await translateText('Hello world', 'es');

    expect(result).toBe('Hola mundo');
    expect(fetch).toHaveBeenCalledWith(
      '/.netlify/functions/translate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello world',
          targetLang: 'es',
          sourceLang: 'en',
        }),
      }),
    );
  });

  it('respects an explicit sourceLang', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ translatedText: 'Hello world' }),
    });

    await translateText('Hola mundo', 'en', 'es');

    expect(fetch).toHaveBeenCalledWith(
      '/.netlify/functions/translate',
      expect.objectContaining({
        body: JSON.stringify({
          text: 'Hola mundo',
          targetLang: 'en',
          sourceLang: 'es',
        }),
      }),
    );
  });

  it('throws when the function returns a non-ok response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'rate limit' }),
    });

    await expect(translateText('Hello', 'es')).rejects.toThrow('rate limit');
  });
});

describe('translateFields', () => {
  it('translates all string fields and passes through non-string values', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ translatedText: 'translated' }),
    });

    const input = { title: 'Hello', count: 5, tags: ['a', 'b'] };
    const result = await translateFields(input, 'es');

    expect(result.title).toBe('translated');
    expect(result.count).toBe(5);
    expect(result.tags).toEqual(['a', 'b']);
  });

  it('calls translateText once per string field', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ translatedText: 'ok' }),
    });

    await translateFields({ a: 'one', b: 'two', c: 3 }, 'es');

    // 2 string fields → 2 fetch calls
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
