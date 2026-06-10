/**
 * Netlify Function: rename-media
 *
 * Updates the originalName field on a media Firestore document.
 *
 * POST /.netlify/functions/rename-media
 * Authorization: Bearer <Firebase ID token>
 * Body: { docId: string, name: string }
 * Response: { ok: true }
 */

import { verifyMediaCaller } from './lib/auth.js';
import { adminDb } from './lib/firebase-admin.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    await verifyMediaCaller(event);
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
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { docId, name } = body;
  if (!docId || !name?.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'docId and name are required' }),
    };
  }

  const db = adminDb();
  const docRef = db.collection('media').doc(docId);
  const snap = await docRef.get();

  if (!snap.exists) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Media doc not found' }),
    };
  }

  await docRef.update({ originalName: name.trim() });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
