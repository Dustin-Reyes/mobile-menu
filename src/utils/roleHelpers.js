export const ROLES = {
  ADMIN: 'admin',
  SITE_MANAGER: 'site_manager',
  CONTENT_MANAGER: 'content_manager',
};

export const ROLE_LABELS = {
  admin: 'Admin',
  site_manager: 'Site Manager',
  content_manager: 'Content Manager',
};

// All valid role keys in display order
export const ALL_ROLES = [
  ROLES.ADMIN,
  ROLES.SITE_MANAGER,
  ROLES.CONTENT_MANAGER,
];

// Numeric authority level — lower number = higher authority
export const ROLE_LEVELS = {
  [ROLES.ADMIN]: 0,
  [ROLES.SITE_MANAGER]: 1,
  [ROLES.CONTENT_MANAGER]: 2,
};

export const canManageUsers = (role) =>
  role === ROLES.ADMIN || role === ROLES.SITE_MANAGER;

export const canEditContent = (role) => !!role;

// Returns true if callerRole has authority strictly above targetRole
export const canActOnUser = (callerRole, targetRole) => {
  const callerLevel = ROLE_LEVELS[callerRole] ?? 99;
  const targetLevel = ROLE_LEVELS[targetRole] ?? 99;
  return callerLevel < targetLevel;
};

// Returns the role keys the current user is allowed to assign
export const getAssignableRoles = (myRole) => {
  if (myRole === ROLES.ADMIN) return ALL_ROLES;
  if (myRole === ROLES.SITE_MANAGER)
    return [ROLES.SITE_MANAGER, ROLES.CONTENT_MANAGER];
  return [];
};

// Returns true when a tab should be visible for the given role
export const isTabVisible = (tab, role) => {
  if (!tab.enabled) return false;
  if (!tab.requiredRoles) return true;
  return tab.requiredRoles.includes(role);
};
