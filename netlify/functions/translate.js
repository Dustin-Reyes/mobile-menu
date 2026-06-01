/**
 * Netlify Function: translate
 *
 * POST { text, targetLang, sourceLang? }
 * → { translatedText }
 *
 * Proxies to the MyMemory free translation API.
 * MyMemory signals rate limits via responseStatus in the body (not HTTP status).
 */

// Maps project locale codes to MyMemory language codes
const LOCALE_MAP = {
  en: 'en',
  es: 'es',
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { text, targetLang, sourceLang = 'en' } = body;

  if (!targetLang) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'targetLang is required' }),
    };
  }

  if (text == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'text is required' }),
    };
  }

  const src = LOCALE_MAP[sourceLang] ?? sourceLang;
  const tgt = LOCALE_MAP[targetLang] ?? targetLang;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // MyMemory returns 200 HTTP even on rate-limit — check body status
    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory error (${data.responseStatus})`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        translatedText: data.responseData.translatedText,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
