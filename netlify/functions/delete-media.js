/**
 * Netlify Function: delete-media
 *
 * Deletes a media asset from Cloudflare R2 and removes its Firestore document.
 * Removes all three size variants (thumbnail/gallery/hero) plus the raw file.
 * R2 404 (NoSuchKey) is treated as success for idempotency.
 *
 * POST /.netlify/functions/delete-media
 * Authorization: Bearer <Firebase ID token>
 * Body: { docId: string }
 * Response: { ok: true }
 */

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { verifyMediaCaller } from './lib/auth.js';
import { getR2Client, getBucketName, getKeyPrefix } from './lib/r2.js';
import { adminDb } from './lib/firebase-admin.js';

const SIZE_NAMES = ['thumbnail', 'gallery', 'hero'];

async function tryDelete(r2, bucket, key) {
  try {
    await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (e) {
    if (e.name !== 'NoSuchKey') throw e;
  }
}

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

  const { docId } = body;
  if (!docId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'docId is required' }),
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

  const { rawExt, originalName } = snap.data();
  // rawExt is set on new uploads; fall back to parsing originalName for old docs
  const ext = rawExt ?? originalName?.split('.').pop()?.toLowerCase();

  const r2 = getR2Client();
  const bucket = getBucketName();
  const prefix = getKeyPrefix();

  try {
    // Delete all three processed size variants
    for (const sizeName of SIZE_NAMES) {
      await tryDelete(r2, bucket, `${prefix}media/${docId}/${sizeName}.webp`);
    }
    // Backwards compat: old uploads stored a single media/<docId>.webp
    await tryDelete(r2, bucket, `${prefix}media/${docId}.webp`);

    // Delete raw file (may already be gone if processing completed)
    if (ext) {
      await tryDelete(r2, bucket, `${prefix}raw/${docId}.${ext}`);
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }

  await docRef.delete();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
