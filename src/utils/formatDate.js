/**
 * Date formatting utility.
 *
 * @module utils/formatDate
 */

/**
 * Formats an ISO 8601 date string as a localised short date.
 *
 * Returns `'—'` when `iso` is falsy.
 *
 * @param {string | null | undefined} iso - ISO date string (e.g. `'2024-03-15T00:00:00.000Z'`).
 * @returns {string} Localised date string (e.g. `'Mar 15, 2024'`) or `'—'`.
 */
export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
