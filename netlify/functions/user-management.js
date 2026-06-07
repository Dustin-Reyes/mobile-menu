/**
 * Netlify Function: user-management
 *
 * Manages Firebase Auth users server-side using the Admin SDK.
 * All requests must include: Authorization: Bearer <idToken>
 * Caller must have role 'admin' or 'site_manager' (verified via custom claims).
 *
 * GET  ?action=list           → { users: [...] }
 * POST ?action=create         ← { email, password, role, sendWelcomeEmail? }
 * POST ?action=update-role    ← { uid, role }
 * POST ?action=delete         ← { uid }
 * POST ?action=reset-password ← { email }
 * POST ?action=disable        ← { uid }
 * POST ?action=enable         ← { uid }
 */

import * as Sentry from '@sentry/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// ─── Sentry ───────────────────────────────────────────────────────────────────

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
});

// ─── Init ─────────────────────────────────────────────────────────────────────

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!serviceAccountB64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set');
  }
  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountB64, 'base64').toString('utf8'),
  );
  return initializeApp({ credential: cert(serviceAccount) });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALLOWED_ROLES = ['admin', 'site_manager', 'content_manager'];
const ROLE_LEVELS = { admin: 0, site_manager: 1, content_manager: 2 };

// Returns an error response if callerRole cannot act on the target uid, else null
async function checkHierarchy(adminAuth, callerRole, targetUid) {
  const targetRecord = await adminAuth.getUser(targetUid);
  const targetRole = targetRecord.customClaims?.role ?? null;
  const callerLevel = ROLE_LEVELS[callerRole] ?? -1;
  const targetLevel = ROLE_LEVELS[targetRole] ?? 99;
  if (callerLevel >= targetLevel) {
    return err(403, 'You do not have permission to act on this user');
  }
  return null;
}

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const err = (statusCode, message) => json(statusCode, { error: message });

// Verify the caller's ID token and return decoded claims
async function verifyCallerToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing Bearer token'), { status: 401 });
  }
  const idToken = authHeader.slice(7);
  const adminAuth = getAuth(getAdminApp());
  const decoded = await adminAuth.verifyIdToken(idToken);
  return decoded;
}

// Format a UserRecord for the response
function formatUser(userRecord) {
  return {
    uid: userRecord.uid,
    email: userRecord.email ?? '',
    displayName: userRecord.displayName ?? null,
    photoURL: userRecord.photoURL ?? null,
    role: userRecord.customClaims?.role ?? null,
    disabled: userRecord.disabled,
    providers: userRecord.providerData.map((p) => p.providerId),
    createdAt: userRecord.metadata.creationTime,
    lastLoginAt: userRecord.metadata.lastSignInTime,
  };
}

// ─── Action handlers ──────────────────────────────────────────────────────────

async function listUsers(adminAuth) {
  const result = await adminAuth.listUsers(1000);
  return json(200, { users: result.users.map(formatUser) });
}

async function createUser(adminAuth, body, callerRole) {
  const { email, displayName, password, role, sendWelcomeEmail } = body;

  if (!email || !password || !role) {
    return err(400, 'email, password, and role are required');
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return err(
      400,
      `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}`,
    );
  }
  // site_manager cannot create admins
  if (callerRole === 'site_manager' && role === 'admin') {
    return err(403, 'Site managers cannot assign the admin role');
  }

  const userRecord = await adminAuth.createUser({
    email,
    password,
    ...(displayName ? { displayName } : {}),
  });
  await adminAuth.setCustomUserClaims(userRecord.uid, { role });

  if (sendWelcomeEmail) {
    try {
      await adminAuth.generatePasswordResetLink(email);
      // generatePasswordResetLink just returns the link; sending is done via
      // Firebase's email action settings in the console.
    } catch {
      // Non-fatal — user was still created
    }
  }

  return json(201, {
    user: formatUser(await adminAuth.getUser(userRecord.uid)),
  });
}

async function updateRole(adminAuth, body, callerRole) {
  const { uid, role } = body;

  if (!uid || !role) return err(400, 'uid and role are required');
  if (!ALLOWED_ROLES.includes(role)) {
    return err(
      400,
      `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}`,
    );
  }
  // Cannot act on a user above or at your own level
  const hierarchyErr = await checkHierarchy(adminAuth, callerRole, uid);
  if (hierarchyErr) return hierarchyErr;
  // Cannot assign a role at or above your own level
  const callerLevel = ROLE_LEVELS[callerRole] ?? -1;
  const newRoleLevel = ROLE_LEVELS[role] ?? 99;
  if (newRoleLevel <= callerLevel) {
    return err(403, 'You cannot assign a role equal to or above your own');
  }

  await adminAuth.setCustomUserClaims(uid, { role });
  return json(200, { user: formatUser(await adminAuth.getUser(uid)) });
}

async function deleteUser(adminAuth, body, callerRole) {
  const { uid } = body;
  if (!uid) return err(400, 'uid is required');
  const hierarchyErr = await checkHierarchy(adminAuth, callerRole, uid);
  if (hierarchyErr) return hierarchyErr;
  await adminAuth.deleteUser(uid);
  return json(200, { deleted: uid });
}

async function resetPassword(adminAuth, body, callerRole) {
  const { email } = body;
  if (!email) return err(400, 'email is required');
  const userRecord = await adminAuth.getUserByEmail(email);
  const hierarchyErr = await checkHierarchy(
    adminAuth,
    callerRole,
    userRecord.uid,
  );
  if (hierarchyErr) return hierarchyErr;
  const link = await adminAuth.generatePasswordResetLink(email);
  return json(200, { resetLink: link });
}

async function setDisabled(adminAuth, body, disabled, callerRole) {
  const { uid } = body;
  if (!uid) return err(400, 'uid is required');
  const hierarchyErr = await checkHierarchy(adminAuth, callerRole, uid);
  if (hierarchyErr) return hierarchyErr;
  await adminAuth.updateUser(uid, { disabled });
  return json(200, { user: formatUser(await adminAuth.getUser(uid)) });
}

async function updateProfile(adminAuth, body, callerRole, callerUid) {
  const { uid, displayName } = body;
  if (!uid) return err(400, 'uid is required');
  // Allow self-edit; otherwise enforce hierarchy
  if (uid !== callerUid) {
    const hierarchyErr = await checkHierarchy(adminAuth, callerRole, uid);
    if (hierarchyErr) return hierarchyErr;
  }
  const updates = {};
  if (displayName !== undefined) updates.displayName = displayName || null;
  await adminAuth.updateUser(uid, updates);
  return json(200, { user: formatUser(await adminAuth.getUser(uid)) });
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const action = event.queryStringParameters?.action;
  if (!action) return err(400, 'action query parameter is required');

  let caller;
  try {
    caller = await verifyCallerToken(event);
  } catch (e) {
    return err(e.status ?? 401, e.message);
  }

  const callerRole = caller.role ?? null;
  if (callerRole !== 'admin' && callerRole !== 'site_manager') {
    return err(403, 'Insufficient permissions');
  }

  let adminAuth;
  try {
    adminAuth = getAuth(getAdminApp());
  } catch (e) {
    Sentry.captureException(e, { extra: { context: 'firebase-admin-init' } });
    return err(500, `Firebase Admin init failed: ${e.message}`);
  }

  let body = {};
  if (event.httpMethod === 'POST' && event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      return err(400, 'Invalid JSON body');
    }
  }

  try {
    switch (action) {
      case 'list':
        return await listUsers(adminAuth);
      case 'create':
        return await createUser(adminAuth, body, callerRole);
      case 'update-role':
        return await updateRole(adminAuth, body, callerRole);
      case 'delete':
        return await deleteUser(adminAuth, body, callerRole);
      case 'reset-password':
        return await resetPassword(adminAuth, body, callerRole);
      case 'disable':
        return await setDisabled(adminAuth, body, true, callerRole);
      case 'enable':
        return await setDisabled(adminAuth, body, false, callerRole);
      case 'update-profile':
        return await updateProfile(adminAuth, body, callerRole, caller.uid);
      default:
        return err(400, `Unknown action: ${action}`);
    }
  } catch (e) {
    const isFirebaseError = e.code?.startsWith('auth/');
    if (!isFirebaseError) {
      Sentry.captureException(e, { extra: { action, callerRole } });
    }
    return err(isFirebaseError ? 400 : 500, e.message);
  }
};
