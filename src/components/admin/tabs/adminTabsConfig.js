/**
 * @module components/admin/tabs/adminTabsConfig
 * @description Configuration and helpers for the admin panel tab system. Defines
 * all available tabs, their visual groupings, and role-based visibility rules.
 */

import {
  BarChart3,
  Settings,
  FileText,
  Newspaper,
  Image,
  User,
  Users,
} from 'lucide-react';
import PROJECT_CONFIG from 'config/project';
import { isTabVisible } from 'utils/roleHelpers';

const { posts: postsEnabled } = PROJECT_CONFIG.features;

/**
 * Full list of admin tabs with their metadata and optional role restrictions.
 * @type {Array<{id: string, label: string, shortLabel: string, icon: React.ComponentType, enabled: boolean, requiredRoles?: string[]}>}
 */
export const ADMIN_TABS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    shortLabel: 'Dash',
    icon: BarChart3,
    enabled: true,
  },
  {
    id: 'users',
    label: 'Users',
    shortLabel: 'Users',
    icon: Users,
    enabled: true,
    requiredRoles: ['admin', 'site_manager'],
  },
  {
    id: 'settings',
    label: 'Settings',
    shortLabel: 'Settings',
    icon: Settings,
    enabled: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    shortLabel: 'Profile',
    icon: User,
    enabled: true,
  },
  {
    id: 'content',
    label: 'Content',
    shortLabel: 'Content',
    icon: FileText,
    enabled: true,
  },
  {
    id: 'posts',
    label: 'Posts',
    shortLabel: 'Posts',
    icon: Newspaper,
    enabled: postsEnabled,
  },
  {
    id: 'media',
    label: 'Media',
    shortLabel: 'Media',
    icon: Image,
    enabled: true,
  },
];

/**
 * Visual groupings for the desktop sidebar. Dividers are rendered between groups.
 * @type {Array<string[]>}
 */
export const ADMIN_TAB_GROUPS = [
  ['dashboard', 'users', 'settings', 'profile'],
  ['content', 'posts', 'media'],
];

/**
 * Tab IDs surfaced in the mobile bottom bar (space-constrained — Users omitted).
 * @type {string[]}
 */
export const BOTTOM_TAB_IDS = ['dashboard', 'content', 'posts', 'media'];

/**
 * Returns the tab config object for the given tab ID.
 * @param {string} id - Tab identifier.
 * @returns {{id: string, label: string, shortLabel: string, icon: React.ComponentType, enabled: boolean, requiredRoles?: string[]} | undefined}
 */
export const getAdminTab = (id) => ADMIN_TABS.find((tab) => tab.id === id);

/**
 * Returns only the tabs that are visible to the given role.
 * @param {string} role - The caller's role identifier.
 * @returns {Array<{id: string, label: string, shortLabel: string, icon: React.ComponentType, enabled: boolean, requiredRoles?: string[]}>}
 */
export const getVisibleTabs = (role) =>
  ADMIN_TABS.filter((tab) => isTabVisible(tab, role));

/**
 * Returns tab groups with invisible tabs filtered out; empty groups are omitted.
 * @param {string} role - The caller's role identifier.
 * @returns {Array<string[]>}
 */
export const getVisibleTabGroups = (role) =>
  ADMIN_TAB_GROUPS.map((group) =>
    group.filter((id) => {
      const tab = getAdminTab(id);
      return tab && isTabVisible(tab, role);
    }),
  ).filter((group) => group.length > 0);
