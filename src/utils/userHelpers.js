/**
 * User display utilities.
 *
 * @module utils/userHelpers
 */

/**
 * Derives a two-letter avatar initials string from a Firebase user's email.
 *
 * @param {string | null | undefined} email - User email address.
 * @returns {string} Up to two uppercase letters from the local part of the email.
 */
export function getUserInitials(email) {
  const username = (email || '').split('@')[0] || '';
  return username.slice(0, 2).toUpperCase();
}

/**
 * Derives a capitalised display name from a Firebase user's email.
 *
 * @param {string | null | undefined} email - User email address.
 * @returns {string} Username portion with the first letter capitalised.
 */
export function getUserDisplayName(email) {
  const username = (email || '').split('@')[0] || '';
  return username.charAt(0).toUpperCase() + username.slice(1);
}
