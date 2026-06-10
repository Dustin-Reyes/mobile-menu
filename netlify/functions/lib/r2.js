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
    forcePathStyle: true,
    // R2 does not support the CRC32 checksums that AWS SDK v3 adds by default
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

export const getBucketName = () => {
  if (!process.env.R2_BUCKET_NAME) throw new Error('R2_BUCKET_NAME is not set');
  return process.env.R2_BUCKET_NAME;
};

export const getPublicUrl = () => {
  if (!process.env.R2_PUBLIC_URL) throw new Error('R2_PUBLIC_URL is not set');
  return process.env.R2_PUBLIC_URL;
};

// Optional prefix applied to all R2 keys (e.g. "production/images/my-site/").
// Defaults to empty string — no prefix. Must end with "/" if set.
export const getKeyPrefix = () => process.env.R2_KEY_PREFIX ?? '';
