/**
 * Admin-specific user helper utilities.
 *
 * These are distinct from `utils/userHelpers.js` which contains general
 * display utilities. This module handles Firebase Admin API calls and
 * user-status derivation for the admin dashboard.
 *
 * @module utils/admin/userHelpers
 */

/**
 * Returns the display status of a Firebase user record.
 *
 * @param {{ disabled: boolean }} u - Firebase user record.
 * @returns {'active' | 'disabled'}
 */
export function getUserStatus(u) {
  return u.disabled ? 'disabled' : 'active';
}

/**
 * Returns a human-readable label for the primary authentication provider.
 *
 * @param {string[]} [providers=[]] - Array of provider IDs from the Firebase user record (e.g. `['google.com']`).
 * @returns {string} `'Google'`, `'Password'`, the first provider ID, or `'Unknown'`.
 */
export function getProviderLabel(providers = []) {
  if (providers.includes('google.com')) return 'Google';
  if (providers.includes('password')) return 'Password';
  return providers[0] ?? 'Unknown';
}

/**
 * Calls the Netlify `user-management` serverless function.
 *
 * Authenticates using the current user's Firebase ID token and dispatches
 * the requested action. Uses GET for read operations and POST for mutations.
 *
 * @param {string} action - Action identifier (e.g. `'list'`, `'setRole'`, `'disable'`).
 * @param {import('firebase/auth').User} user - Authenticated Firebase user for token retrieval.
 * @param {Object | null} [body=null] - Request body for POST actions; `null` for GET.
 * @returns {Promise<Object>} Parsed JSON response from the function.
 * @throws {Error} When the function returns a non-OK HTTP status.
 */
export async function callUserManagement(action, user, body = null) {
  const idToken = await user.getIdToken();
  const res = await fetch(
    `/.netlify/functions/user-management?action=${action}`,
    {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data;
}
