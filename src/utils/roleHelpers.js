/**
 * Role constants, labels, and permission helpers for the admin system.
 *
 * Defines the three built-in roles (`admin`, `site_manager`,
 * `content_manager`) and exports predicate functions used throughout the
 * admin UI and `AuthContext`.
 *
 * @module utils/roleHelpers
 */

/**
 * Canonical role identifier strings.
 *
 * @type {{ ADMIN: string, SITE_MANAGER: string, CONTENT_MANAGER: string }}
 */
export const ROLES = {
  ADMIN: 'admin',
  SITE_MANAGER: 'site_manager',
  CONTENT_MANAGER: 'content_manager',
};

/**
 * Human-readable labels for each role, keyed by role ID.
 *
 * @type {Record<string, string>}
 */
export const ROLE_LABELS = {
  admin: 'Admin',
  site_manager: 'Site Manager',
  content_manager: 'Content Manager',
};

/**
 * All valid role keys in display order (highest authority first).
 *
 * @type {string[]}
 */
export const ALL_ROLES = [
  ROLES.ADMIN,
  ROLES.SITE_MANAGER,
  ROLES.CONTENT_MANAGER,
];

/**
 * Numeric authority level for each role — lower number = higher authority.
 *
 * @type {Record<string, number>}
 */
export const ROLE_LEVELS = {
  [ROLES.ADMIN]: 0,
  [ROLES.SITE_MANAGER]: 1,
  [ROLES.CONTENT_MANAGER]: 2,
};

/**
 * Returns whether the given role has user-management permissions.
 *
 * @param {string | null} role
 * @returns {boolean}
 */
export const canManageUsers = (role) =>
  role === ROLES.ADMIN || role === ROLES.SITE_MANAGER;

/**
 * Returns whether the given role can edit CMS content (any authenticated role).
 *
 * @param {string | null} role
 * @returns {boolean}
 */
export const canEditContent = (role) => !!role;

/**
 * Returns `true` when `callerRole` has strictly higher authority than `targetRole`.
 *
 * @param {string | null} callerRole
 * @param {string | null} targetRole
 * @returns {boolean}
 */
export const canActOnUser = (callerRole, targetRole) => {
  const callerLevel = ROLE_LEVELS[callerRole] ?? 99;
  const targetLevel = ROLE_LEVELS[targetRole] ?? 99;
  return callerLevel < targetLevel;
};

/**
 * Returns the subset of roles that `myRole` is permitted to assign to other users.
 *
 * @param {string | null} myRole - The caller's current role.
 * @returns {string[]} Array of assignable role keys.
 */
export const getAssignableRoles = (myRole) => {
  if (myRole === ROLES.ADMIN) return ALL_ROLES;
  if (myRole === ROLES.SITE_MANAGER)
    return [ROLES.SITE_MANAGER, ROLES.CONTENT_MANAGER];
  return [];
};

/**
 * Determines whether an admin tab should be visible for the given role.
 *
 * @param {{ enabled: boolean, requiredRoles?: string[] }} tab - Tab config object.
 * @param {string | null} role - Current user's role.
 * @returns {boolean}
 */
export const isTabVisible = (tab, role) => {
  if (!tab.enabled) return false;
  if (!tab.requiredRoles) return true;
  return tab.requiredRoles.includes(role);
};
