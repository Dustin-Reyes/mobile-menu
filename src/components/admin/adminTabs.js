import {
  BarChart3,
  Settings,
  FileText,
  Newspaper,
  Image,
  Navigation,
  TrendingUp,
} from 'lucide-react';

export const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dash', icon: BarChart3 },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
  { id: 'pages', label: 'Pages', shortLabel: 'Pages', icon: FileText },
  { id: 'posts', label: 'Blog Posts', shortLabel: 'Posts', icon: Newspaper },
  { id: 'media', label: 'Media', shortLabel: 'Media', icon: Image },
  {
    id: 'navigation',
    label: 'Navigation',
    shortLabel: 'Nav',
    icon: Navigation,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    shortLabel: 'Analytics',
    icon: TrendingUp,
  },
];

// Visual groupings for the desktop sidebar (dividers rendered between groups).
export const ADMIN_TAB_GROUPS = [
  ['dashboard', 'settings'],
  ['pages', 'posts', 'media'],
  ['navigation', 'analytics'],
];

// Tabs surfaced in the mobile bottom bar (space constrained).
export const BOTTOM_TAB_IDS = [
  'dashboard',
  'settings',
  'pages',
  'posts',
  'navigation',
];

export const getAdminTab = (id) => ADMIN_TABS.find((tab) => tab.id === id);
