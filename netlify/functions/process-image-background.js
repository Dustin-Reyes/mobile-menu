/**
 * Netlify Background Function: process-image-background
 *
 * Downloads the raw image from R2, generates thumbnail/gallery/hero WebP
 * variants, uploads them to media/<docId>/<size>.webp, deletes the raw file,
 * and updates the Firestore doc with status "ready" and a urls map.
 * On error, sets status: "error" so the UI can surface it.
 *
 * POST /.netlify/functions/process-image-background
 * Authorization: Bearer <Firebase ID token>
 * Body: { key: string, docId: string }
 * Response: 202 (async — Netlify background function)
 */

import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { verifyMediaCaller } from './lib/auth.js';
import {
  getR2Client,
  getBucketName,
  getPublicUrl,
  getKeyPrefix,
} from './lib/r2.js';
import { adminDb } from './lib/firebase-admin.js';
import { PRESETS } from './lib/presets.js';

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

  const { key, docId } = body;
  if (!key || !docId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'key and docId are required' }),
    };
  }

  const db = adminDb();
  const docRef = db.collection('media').doc(docId);

  try {
    const snap = await docRef.get();
    if (!snap.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Media doc not found' }),
      };
    }

    const r2 = getR2Client();
    const bucket = getBucketName();

    const { Body } = await r2.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const chunks = [];
    for await (const chunk of Body) chunks.push(chunk);
    const inputBuffer = Buffer.concat(chunks);

    const urls = {};
    for (const [sizeName, { width, height, quality, fit }] of Object.entries(
      PRESETS,
    )) {
      const { data: outputBuffer } = await sharp(inputBuffer)
        .resize(width, height, { fit, position: 'center' })
        .webp({ quality })
        .withMetadata(false)
        .toBuffer({ resolveWithObject: true });

      const processedKey = `${getKeyPrefix()}media/${docId}/${sizeName}.webp`;
      await r2.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: processedKey,
          Body: outputBuffer,
          ContentType: 'image/webp',
        }),
      );
      urls[sizeName] = `${getPublicUrl()}/${processedKey}`;
    }

    await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

    await docRef.update({
      status: 'ready',
      urls,
      processedAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    await docRef
      .update({ status: 'error', errorMessage: error.message })
      .catch(() => {});
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
