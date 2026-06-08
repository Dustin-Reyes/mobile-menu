/**
 * Shared auth helper for media Netlify functions.
 *
 * verifyMediaCaller extracts and verifies the Firebase ID token from the
 * Authorization header, then asserts that the decoded token contains a
 * custom `role` claim (set server-side for privileged users).
 */

import { adminAuth } from './firebase-admin.js';

export async function verifyMediaCaller(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing Bearer token'), { status: 401 });
  }
  const idToken = authHeader.slice(7);
  const decoded = await adminAuth().verifyIdToken(idToken);
  if (!decoded.role) {
    throw Object.assign(new Error('Insufficient permissions'), { status: 403 });
  }
  return decoded;
}
