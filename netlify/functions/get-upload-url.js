/**
 * Netlify Function: get-upload-url
 *
 * Generates a pre-signed R2 PUT URL for a direct client upload, creates a
 * Firestore `media` document with `status: "pending"`, and returns the upload
 * URL, object key, and document ID to the caller.
 *
 * POST /api/get-upload-url
 * Authorization: Bearer <Firebase ID token>
 * Body: { displayName: string, mimeType: string }
 * Response: { uploadUrl: string, key: string, docId: string }
 */

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { verifyMediaCaller } from './lib/auth.js';
import { getR2Client, getBucketName, getKeyPrefix } from './lib/r2.js';
import { adminDb } from './lib/firebase-admin.js';

const VALID_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

const EXT_FROM_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let caller;
  try {
    caller = await verifyMediaCaller(event);
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

  const { displayName, mimeType } = body;

  if (!displayName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'displayName is required' }),
    };
  }
  if (!VALID_MIME_TYPES.has(mimeType)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Invalid mimeType — accepted: image/jpeg, image/png, image/webp, image/avif, image/gif',
      }),
    };
  }

  const docId = randomUUID();
  const ext = EXT_FROM_MIME[mimeType];
  const key = `${getKeyPrefix()}raw/${docId}.${ext}`;

  try {
    const r2 = getR2Client();
    const command = new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ContentType: mimeType,
    });
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    const db = adminDb();
    await db.collection('media').doc(docId).set({
      status: 'pending',
      originalName: displayName,
      mimeType,
      rawExt: ext,
      uploadedBy: caller.uid,
      createdAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadUrl, key, docId }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
