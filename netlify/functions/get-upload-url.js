/**
 * Netlify Function: get-upload-url
 *
 * Generates a pre-signed R2 PUT URL for a direct client upload, creates a
 * Firestore `media` document with `status: "pending"`, and returns the upload
 * URL, object key, and document ID to the caller.
 *
 * POST /api/get-upload-url
 * Authorization: Bearer <Firebase ID token>
 * Body: { filename: string, preset: string, mimeType: string }
 * Response: { uploadUrl: string, key: string, docId: string }
 */

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { verifyMediaCaller } from './lib/auth.js';
import { getR2Client, getBucketName } from './lib/r2.js';
import { adminDb } from './lib/firebase-admin.js';
import { VALID_PRESETS } from './lib/presets.js';

const VALID_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

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

  const { filename, preset, mimeType } = body;

  if (!filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'filename is required' }),
    };
  }
  if (!VALID_PRESETS.includes(preset)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `preset must be one of: ${VALID_PRESETS.join(', ')}`,
      }),
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
  const ext = filename.split('.').pop().toLowerCase();
  const key = `raw/${docId}.${ext}`;

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
      preset,
      originalName: filename,
      mimeType,
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
