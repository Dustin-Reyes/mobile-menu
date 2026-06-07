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
    id: 'pages',
    label: 'Pages',
    shortLabel: 'Pages',
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

// Visual groupings for the desktop sidebar (dividers rendered between groups).
export const ADMIN_TAB_GROUPS = [
  ['dashboard', 'users', 'settings', 'profile'],
  ['pages', 'posts', 'media'],
];

// Tabs surfaced in the mobile bottom bar (space constrained — Users omitted).
export const BOTTOM_TAB_IDS = ['dashboard', 'pages', 'posts', 'media'];

export const getAdminTab = (id) => ADMIN_TABS.find((tab) => tab.id === id);

// Returns only the tabs visible to the given role
export const getVisibleTabs = (role) =>
  ADMIN_TABS.filter((tab) => isTabVisible(tab, role));

// Returns tab groups with invisible tabs filtered out (empty groups omitted)
export const getVisibleTabGroups = (role) =>
  ADMIN_TAB_GROUPS.map((group) =>
    group.filter((id) => {
      const tab = getAdminTab(id);
      return tab && isTabVisible(tab, role);
    }),
  ).filter((group) => group.length > 0);
