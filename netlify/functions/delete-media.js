/**
 * Netlify Function: delete-media
 *
 * Deletes a media asset from Cloudflare R2 and removes its Firestore document.
 * R2 404 (NoSuchKey) is treated as success for idempotency.
 *
 * POST /.netlify/functions/delete-media
 * Authorization: Bearer <Firebase ID token>
 * Body: { docId: string }
 * Response: { ok: true }
 */

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { verifyMediaCaller } from './lib/auth.js';
import { getR2Client, getBucketName } from './lib/r2.js';
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

  const { originalName } = snap.data();
  const ext = originalName?.split('.').pop()?.toLowerCase();

  const r2 = getR2Client();
  const bucket = getBucketName();

  // Delete processed file (may not exist for error-state docs — NoSuchKey is fine)
  try {
    await r2.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: `media/${docId}.webp` }),
    );
  } catch (e) {
    if (e.name !== 'NoSuchKey') {
      return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
  }

  // Delete raw file if it exists (may exist for error/pending-state docs)
  if (ext) {
    try {
      await r2.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: `raw/${docId}.${ext}` }),
      );
    } catch (e) {
      if (e.name !== 'NoSuchKey') {
        // Log but don't fail — processed file is already deleted
        console.error('Failed to delete raw file:', e.message);
      }
    }
  }

  await docRef.delete();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
