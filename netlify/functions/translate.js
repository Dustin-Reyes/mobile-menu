/**
 * Netlify Function: translate
 *
 * POST { text, targetLang, sourceLang? }
 * → { translatedText }
 *
 * Requires: Authorization: Bearer <Firebase ID token>
 * Any authenticated Firebase user may call this endpoint.
 *
 * Proxies to the MyMemory free translation API.
 * MyMemory signals rate limits via responseStatus in the body (not HTTP status).
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Maps project locale codes to MyMemory language codes
const LOCALE_MAP = {
  en: 'en',
  es: 'es',
};

// ─── Firebase Admin ────────────────────────────────────────────────────────────

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!serviceAccountB64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set');
  }
  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountB64, 'base64').toString('utf8'),
  );
  return initializeApp({ credential: cert(serviceAccount) });
}

async function verifyCallerToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing Bearer token'), { status: 401 });
  }
  const idToken = authHeader.slice(7);
  const adminAuth = getAuth(getAdminApp());
  return adminAuth.verifyIdToken(idToken);
}

// ─── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    await verifyCallerToken(event);
  } catch (e) {
    return {
      statusCode: e.status ?? 401,
      body: JSON.stringify({ error: e.message }),
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
