/**
 * Password strength utilities.
 *
 * @module utils/passwordStrength
 */

/**
 * Returns a strength rating for a given password.
 *
 * Strength is determined by length and the number of distinct character
 * classes present (lowercase, uppercase, digit, symbol):
 * - `'strong'` — ≥ 12 chars and ≥ 3 classes
 * - `'medium'` — ≥ 8 chars and ≥ 2 classes
 * - `'weak'`   — everything else
 *
 * @param {string} password - The password to evaluate.
 * @returns {'strong' | 'medium' | 'weak' | null} Strength label, or `null` if the input is empty.
 */
export function getPasswordStrength(password) {
  if (!password) return null;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const mixed = [hasLower, hasUpper, hasDigit, hasSymbol].filter(
    Boolean,
  ).length;
  if (password.length >= 12 && mixed >= 3) return 'strong';
  if (password.length >= 8 && mixed >= 2) return 'medium';
  return 'weak';
}
