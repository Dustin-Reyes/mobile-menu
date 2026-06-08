/**
 * Cloudflare R2 client singleton.
 *
 * Lazily creates and caches an S3Client configured for the Cloudflare R2
 * endpoint. Accessor functions for bucket name and public URL read from
 * environment variables at call time so they are always current.
 */

import { S3Client } from '@aws-sdk/client-s3';

let _client = null;

export function getR2Client() {
  if (_client) return _client;
  if (!process.env.CLOUDFLARE_ACCOUNT_ID)
    throw new Error('CLOUDFLARE_ACCOUNT_ID is not set');
  if (!process.env.R2_ACCESS_KEY_ID)
    throw new Error('R2_ACCESS_KEY_ID is not set');
  if (!process.env.R2_SECRET_ACCESS_KEY)
    throw new Error('R2_SECRET_ACCESS_KEY is not set');
  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

export const getBucketName = () => process.env.R2_BUCKET_NAME;
export const getPublicUrl = () => process.env.R2_PUBLIC_URL;
