/**
 * Firebase Admin singleton initialiser.
 *
 * Lazily initialises the Firebase Admin app from the base64-encoded service
 * account stored in FIREBASE_SERVICE_ACCOUNT_BASE64, then exposes thin
 * accessor functions for Auth and Firestore so callers always get the same
 * app instance regardless of import order.
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set');
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 contains invalid JSON');
  }
  return initializeApp({ credential: cert(serviceAccount) });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
