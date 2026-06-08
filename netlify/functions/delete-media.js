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

  const r2 = getR2Client();
  const key = `media/${docId}.webp`;

  try {
    await r2.send(
      new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
  } catch (e) {
    if (e.name !== 'NoSuchKey') {
      return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
  }

  await docRef.delete();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
