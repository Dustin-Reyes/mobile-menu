/**
 * Browser translate service
 *
 * In production: calls /.netlify/functions/translate (CSP-safe, server-side proxy).
 * In development: calls MyMemory directly (no CSP restriction in dev).
 *
 * To swap translation providers, update netlify/functions/translate.js and the
 * LOCALE_MAP + dev path below.
 */

// Maps project locale codes to MyMemory language codes (used in dev only)
const LOCALE_MAP = { en: 'en', es: 'es' };

/**
 * Translate a single string to the target locale.
 * @param {string} text
 * @param {string} targetLang - project locale code (e.g. 'es')
 * @param {string} sourceLang - defaults to 'en'
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang, sourceLang = 'en') {
  if (import.meta.env.DEV) {
    const src = LOCALE_MAP[sourceLang] ?? sourceLang;
    const tgt = LOCALE_MAP[targetLang] ?? targetLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus !== 200) {
      throw new Error(`Translation failed (${data.responseStatus})`);
    }
    return data.responseData.translatedText;
  }

  const response = await fetch('/.netlify/functions/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLang, sourceLang }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Translation failed (${response.status})`);
  }

  return data.translatedText;
}

/**
 * Translate all string values in a flat object.
 * Non-string values (arrays, numbers, objects) are passed through unchanged.
 * @param {Object} fields
 * @param {string} targetLang
 * @param {string} sourceLang - defaults to 'en'
 * @returns {Promise<Object>}
 */
export async function translateFields(fields, targetLang, sourceLang = 'en') {
  const result = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string') {
      result[key] = await translateText(value, targetLang, sourceLang);
    } else {
      result[key] = value;
    }
  }
  return result;
}
