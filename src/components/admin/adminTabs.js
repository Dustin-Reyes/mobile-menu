import {
  BarChart3,
  Settings,
  FileText,
  Newspaper,
  Image,
  User,
} from 'lucide-react';
import PROJECT_CONFIG from 'config/project';

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
  ['dashboard', 'settings', 'profile'],
  ['pages', 'posts', 'media'],
];

// Tabs surfaced in the mobile bottom bar (space constrained).
export const BOTTOM_TAB_IDS = ['dashboard', 'pages', 'posts', 'settings'];

export const getAdminTab = (id) => ADMIN_TABS.find((tab) => tab.id === id);
