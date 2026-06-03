# Admin Section Port from Titan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the admin refactoring from Titan's `24-review-and-refactor-admin-section` and `47-improve-admin-login-page-aesthetics-and-ux` branches into `transpiled-web-template`, splitting the monolithic `AdminDashboard.jsx` into a modular system with Firebase auth.

**Architecture:** Replace the 1293-line monolithic `AdminDashboard.jsx` with a thin shell (~270 lines) that composes 7 per-tab components under `src/components/admin/`. All shared styled components go into `AdminDashboard.styles.js` and tab config lives in `adminTabs.js` (single source of truth for sidebar and mobile bar). Firebase auth is gated via `AuthContext` + `RequireAuth` — fails closed when not configured.

**Tech Stack:** React 18, Emotion styled-components, Framer Motion, Firebase Auth, react-i18next, Lucide icons, react-hot-toast

---

## Context

Two Titan branches contain the changes to port:
- `24-review-and-refactor-admin-section` (commit `e6f2253`) — main admin split + Firebase auth
- `47-improve-admin-login-page-aesthetics-and-ux` (commit `a079eee`) — enhanced login page aesthetics + i18n

**Key import path differences (Titan → Template):**
- Titan uses flat `components/Button` → Template uses `components/ui/Button`
- Titan uses flat `components/Input` → Template uses `components/ui/Input`
- Titan uses flat `components/Dialog` → Template uses `components/ui/Dialog`
- Titan's `AdminDashboard.jsx` is at `src/components/` → Template's is at `src/components/admin/` (already inside admin/, so all `./admin/*` imports become `./`)
- Titan's `AdminPagesTab` imports `'../AdminContentEditor'` → Template: `'./AdminContentEditor'` (same dir)

**Template path aliases** (from vite.config.js): `@` → `src/`, `components`, `context`, `config`, `hooks`, `services`, `utils`, etc. all resolve from `src/`.

---

## File Structure

**Create (new files):**
- `src/context/AuthContext.jsx` — Firebase auth provider + `useAuth` hook
- `src/components/admin/adminTabs.js` — Tab config (single source of truth)
- `src/components/admin/AdminDashboard.styles.js` — All shared styled components
- `src/components/admin/AdminLogin.jsx` — Enhanced login with blueprint grid + i18n
- `src/components/admin/RequireAuth.jsx` — Auth route guard (fails closed)
- `src/components/admin/AdminSidebar.jsx` — Desktop sidebar navigation
- `src/components/admin/AdminBottomTabBar.jsx` — Mobile bottom tab bar
- `src/components/admin/AdminDashboardTab.jsx` — Dashboard overview + stats
- `src/components/admin/AdminSettingsTab.jsx` — Site settings CRUD
- `src/components/admin/AdminNavigationTab.jsx` — Navigation items CRUD
- `src/components/admin/AdminPagesTab.jsx` — Pages tab (wraps existing ContentEditor)
- `src/components/admin/AdminPostsTab.jsx` — Blog posts (coming soon state)
- `src/components/admin/AdminMediaTab.jsx` — Media (coming soon state)
- `src/components/admin/AdminAnalyticsTab.jsx` — Analytics (coming soon state)
- `src/components/admin/ConfirmDialog.jsx` — Replaces `window.confirm()`

**Modify (existing files):**
- `src/components/admin/AdminDashboard.jsx` — Replace monolith with thin shell
- `src/App.jsx` — Wrap /admin with `AuthProvider` + `RequireAuth`; toast `position="bottom-right"`
- `src/hooks/useContent.js` — Fix `refreshStats` (was hardcoded; now calls `contentService.getStats()`)
- `src/services/content.js` — Add `getStats()` method
- `src/i18n/locales/en.json` — Add `admin.login` section
- `src/i18n/locales/es.json` — Add `admin.login` section

---

## Pre-work: GitHub Issue & Branch

- [ ] **Create GitHub issue**
```bash
cd /Users/joshua/Development/transpiled-web-template
gh issue create \
  --title "feat(admin): port modular admin dashboard + Firebase auth from Titan" \
  --body "Port the admin section refactoring from Titan's 24-review-and-refactor-admin-section and 47-improve-admin-login-page-aesthetics-and-ux branches.

## Changes
- Split monolithic AdminDashboard.jsx (1293 lines) into thin shell + 7 per-tab components
- Add Firebase email/password auth via AuthContext + RequireAuth (fails closed)
- Add enhanced AdminLogin with blueprint grid background, i18n, theme-aware
- Add AdminDashboard.styles.js centralized styled components
- Add adminTabs.js single source of truth for tab config
- Add AdminSidebar + AdminBottomTabBar responsive navigation
- Add ConfirmDialog replacing window.confirm()
- Fix useCMS.refreshStats (was hardcoded; now uses contentService.getStats())
- Add i18n translations for admin.login (EN + ES)
- Update App.jsx: auth wrapper + toast position bottom-right"
```

- [ ] **Create branch** (replace `<number>` with the issue number)
```bash
gh issue develop <number> --checkout --name "<number>-port-admin-modular-refactor"
```

---

## Task 1: Create AuthContext

**Files:**
- Create: `src/context/AuthContext.jsx`

- [ ] **Create the file**

```jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from 'config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const isAuthAvailable = !!auth;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isAuthAvailable);

  useEffect(() => {
    if (!isAuthAvailable) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAuthAvailable]);

  const signIn = useCallback(
    (email, password) => {
      if (!isAuthAvailable) {
        return Promise.reject(new Error('Authentication is not available'));
      }
      return signInWithEmailAndPassword(auth, email, password).then(
        (credential) => credential.user,
      );
    },
    [isAuthAvailable],
  );

  const logout = useCallback(() => {
    if (!isAuthAvailable) {
      return Promise.resolve();
    }
    return signOut(auth);
  }, [isAuthAvailable]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthAvailable,
      isAuthenticated: !!user,
      signIn,
      logout,
    }),
    [user, loading, isAuthAvailable, signIn, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

- [ ] **Commit**
```bash
git add src/context/AuthContext.jsx
git commit -m "feat(admin): add Firebase AuthContext provider"
```

---

## Task 2: Create adminTabs.js

**Files:**
- Create: `src/components/admin/adminTabs.js`

- [ ] **Create the file**

```js
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
```

- [ ] **Commit**
```bash
git add src/components/admin/adminTabs.js
git commit -m "feat(admin): add adminTabs config (single source of truth)"
```

---

## Task 3: Create AdminDashboard.styles.js

**Files:**
- Create: `src/components/admin/AdminDashboard.styles.js`

- [ ] **Create the file**

```js
import styled from '@emotion/styled';
import * as RadixSeparator from '@radix-ui/react-separator';

// ─── Layout ──────────────────────────────────────────────────────────────────

export const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  display: flex;
  margin-top: 10rem;

  @media (max-width: 768px) {
    padding-bottom: 56px;
  }
`;

export const Sidebar = styled.div`
  position: fixed;
  top: 10rem;
  left: 0;
  width: 160px;
  height: calc(100vh - 10rem);
  background: ${(p) => p.theme.colors.background};
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  color: ${(p) => (p.active ? p.theme.colors.primary : p.theme.colors.text)};
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}1a` : 'transparent'};

  &:hover {
    background: ${(p) =>
      p.active ? `${p.theme.colors.primary}1a` : 'rgba(255,255,255,0.04)'};
    color: ${(p) =>
      p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.7)'};
  }
`;

export const SidebarDivider = styled(RadixSeparator.Root)`
  margin: 12px 0;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.06);
`;

export const SidebarSpacer = styled.div`
  flex: 1;
`;

export const MainContent = styled.div`
  flex: 1;
  margin-left: 160px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// ─── Page header ───────────────────────────────────────────────────────────

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const PageTitle = styled.h1`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 3px;
`;

export const PageSubtitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
`;

export const CmsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${(p) =>
    p.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${(p) => (p.active ? '#4ade80' : '#f87171')};
  border: 1px solid
    ${(p) => (p.active ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)')};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  padding: 3px 8px;
  border-radius: 9999px;
`;

export const CmsDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;

export const ActivityDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}80;
  flex-shrink: 0;
`;

// ─── Shared card primitives ──────────────────────────────────────────────────

export const SectionCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 16px;
  margin-bottom: 12px;
`;

export const FlushSectionCard = styled(SectionCard)`
  padding: 0;
  overflow: hidden;
`;

export const SectionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: rgba(255, 255, 255, 0.7);
`;

export const GhostTealButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  padding: 4px 10px;
  background: ${(p) => p.theme.colors.primary}1a;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}40;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background: ${(p) => p.theme.colors.primary}2a;
  }
`;

export const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 5px;
  color: rgba(255, 255, 255, 0.25);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

export const CompactEmptyIcon = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  margin-bottom: 2px;
`;

// ─── Stat cards ──────────────────────────────────────────────────────────────

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 14px 16px;
`;

export const StatValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.primary};
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 5px;
`;

export const StatLabelInline = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
`;

// ─── Navigation tab cards ────────────────────────────────────────────────────

export const NavigationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const NavigationItemCard = styled.div`
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavigationActions = styled.div`
  display: flex;
  gap: 4px;
`;

export const NavigationItemTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
`;

export const NavigationItemPath = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
  margin-top: 2px;
`;

export const IconButton = styled.button`
  padding: 5px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primary}1a;
  }
`;

// ─── Form primitives ─────────────────────────────────────────────────────────

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const FormLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  display: block;
`;

export const StyledTextarea = styled.textarea`
  padding: ${(p) => p.theme.spacing.s2} ${(p) => p.theme.spacing.s3};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}1a;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
`;

// ─── Settings view ───────────────────────────────────────────────────────────

export const SettingsViewGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const SettingsLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 2px;
`;

export const SettingsValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) =>
    p.hasValue ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)'};
`;

// ─── Dashboard tab ───────────────────────────────────────────────────────────

export const QuickActionsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

// ─── Analytics tab ───────────────────────────────────────────────────────────

export const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.5);
`;

export const ActivityTime = styled.span`
  margin-left: auto;
  color: rgba(255, 255, 255, 0.25);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

// ─── Posts tab ───────────────────────────────────────────────────────────────

export const PostsList = styled.div`
  display: grid;
  gap: 6px;
`;

// ─── Misc ────────────────────────────────────────────────────────────────────

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ─── Mobile bottom tab bar ───────────────────────────────────────────────────

export const BottomTabBar = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: ${(p) => p.theme.colors.background};
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    z-index: ${(p) => p.theme.zIndex.sticky};
  }
`;

export const BottomTab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.3)'};
  transition: color ${(p) => p.theme.transitions.fast};
`;
```

- [ ] **Commit**
```bash
git add src/components/admin/AdminDashboard.styles.js
git commit -m "feat(admin): add shared AdminDashboard styled components"
```

---

## Task 4: Create AdminLogin.jsx (enhanced version)

**Files:**
- Create: `src/components/admin/AdminLogin.jsx`

Note: Uses `components/ui/Button` and `components/ui/Input` (template path). Uses i18n keys from Task 11.

- [ ] **Create the file**

```jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useAuth } from 'context/AuthContext';
import { Form, FormGroup, FormLabel } from './AdminDashboard.styles';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${(p) => p.theme.colors.background};
  background-image:
    linear-gradient(
      ${(p) =>
          p.theme.mode === 'dark'
            ? 'rgba(100, 100, 100, 0.15)'
            : 'rgba(0, 0, 0, 0.05)'}
        1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      ${(p) =>
          p.theme.mode === 'dark'
            ? 'rgba(100, 100, 100, 0.15)'
            : 'rgba(0, 0, 0, 0.05)'}
        1px,
      transparent 1px
    );
  background-size: 40px 40px;

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding: 2rem 1rem;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s3};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.6s ease-out;
  backdrop-filter: blur(10px);

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding: 40px;
    gap: 24px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  padding-bottom: 20px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding-bottom: 24px;
  }
`;

const CenteredTitle = styled.h2`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    font-size: ${(p) => p.theme.typography.fontSizes.s5};
  }
`;

const ErrorMessage = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.error};
  padding: 12px;
  background: ${(p) =>
    p.theme.mode === 'dark'
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(239, 68, 68, 0.08)'};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  border: 1px solid ${(p) => p.theme.colors.error}33;
  text-align: center;
`;

export default function AdminLogin() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signIn(email, password);
    } catch {
      setError(t('admin.login.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <HeaderSection>
          <CenteredTitle>{t('admin.login.title')}</CenteredTitle>
        </HeaderSection>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>{t('admin.login.email')}</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('admin.login.emailPlaceholder')}
              autoComplete="username"
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>{t('admin.login.password')}</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin.login.passwordPlaceholder')}
              autoComplete="current-password"
              required
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={submitting}>
            {submitting ? t('admin.login.signingIn') : t('admin.login.signIn')}
          </Button>
        </Form>
      </Card>
    </Wrapper>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/admin/AdminLogin.jsx
git commit -m "feat(admin): add enhanced AdminLogin with blueprint grid + i18n"
```

---

## Task 5: Create RequireAuth.jsx

**Files:**
- Create: `src/components/admin/RequireAuth.jsx`

- [ ] **Create the file**

```jsx
import styled from '@emotion/styled';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import AdminLogin from './AdminLogin';
import { LoadingSpinner } from './AdminDashboard.styles';

const CenteredMessage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 2rem;
  text-align: center;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const MessageTitle = styled.h1`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

const MessageBody = styled.p`
  max-width: 420px;
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

export default function RequireAuth({ children }) {
  const { loading, isAuthAvailable, isAuthenticated } = useAuth();

  if (!isAuthAvailable) {
    return (
      <CenteredMessage>
        <ShieldAlert size={32} />
        <MessageTitle>Admin unavailable</MessageTitle>
        <MessageBody>
          Authentication is not configured. Set the Firebase environment
          variables (and <code>VITE_CMS_ENABLED=true</code>) to enable the admin
          dashboard.
        </MessageBody>
      </CenteredMessage>
    );
  }

  if (loading) {
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return children;
}
```

- [ ] **Commit**
```bash
git add src/components/admin/RequireAuth.jsx
git commit -m "feat(admin): add RequireAuth route guard (fails closed)"
```

---

## Task 6: Create AdminSidebar and AdminBottomTabBar

**Files:**
- Create: `src/components/admin/AdminSidebar.jsx`
- Create: `src/components/admin/AdminBottomTabBar.jsx`

- [ ] **Create AdminSidebar.jsx**

```jsx
import { Fragment } from 'react';
import { LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarItem,
  SidebarDivider,
  SidebarSpacer,
} from './AdminDashboard.styles';
import { ADMIN_TAB_GROUPS, getAdminTab } from './adminTabs';

export default function AdminSidebar({ activeTab, onTabChange, onSignOut }) {
  return (
    <Sidebar>
      {ADMIN_TAB_GROUPS.map((group, groupIndex) => (
        <Fragment key={group.join('-')}>
          {groupIndex > 0 && <SidebarDivider />}
          {group.map((tabId) => {
            const tab = getAdminTab(tabId);
            const Icon = tab.icon;
            return (
              <SidebarItem
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon size={14} />
                {tab.label}
              </SidebarItem>
            );
          })}
        </Fragment>
      ))}

      {onSignOut && (
        <>
          <SidebarSpacer />
          <SidebarItem onClick={onSignOut}>
            <LogOut size={14} />
            Sign Out
          </SidebarItem>
        </>
      )}
    </Sidebar>
  );
}
```

- [ ] **Create AdminBottomTabBar.jsx**

```jsx
import { BottomTabBar, BottomTab } from './AdminDashboard.styles';
import { BOTTOM_TAB_IDS, getAdminTab } from './adminTabs';

export default function AdminBottomTabBar({ activeTab, onTabChange }) {
  return (
    <BottomTabBar>
      {BOTTOM_TAB_IDS.map((tabId) => {
        const tab = getAdminTab(tabId);
        const Icon = tab.icon;
        return (
          <BottomTab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={16} />
            {tab.shortLabel}
          </BottomTab>
        );
      })}
    </BottomTabBar>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/admin/AdminSidebar.jsx src/components/admin/AdminBottomTabBar.jsx
git commit -m "feat(admin): add AdminSidebar and AdminBottomTabBar navigation components"
```

---

## Task 7: Create ConfirmDialog.jsx

**Files:**
- Create: `src/components/admin/ConfirmDialog.jsx`

Note: Uses `components/ui/Button` and `components/ui/Dialog` (template paths).

- [ ] **Create the file**

```jsx
import styled from '@emotion/styled';
import Button from 'components/ui/Button';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from 'components/ui/Dialog';

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const DestructiveButton = styled(Button)`
  background: ${(p) => p.theme.colors.error};
  border-color: ${(p) => p.theme.colors.error};
  color: #fff;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.error};
    opacity: 0.9;
  }
`;

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  const ConfirmButton = destructive ? DestructiveButton : Button;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          <Actions>
            <Button variant="secondary" onClick={() => onOpenChange?.(false)}>
              {cancelLabel}
            </Button>
            <ConfirmButton onClick={handleConfirm}>
              {confirmLabel}
            </ConfirmButton>
          </Actions>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/admin/ConfirmDialog.jsx
git commit -m "feat(admin): add ConfirmDialog replacing window.confirm()"
```

---

## Task 8: Create Per-Tab Components

**Files:**
- Create: `src/components/admin/AdminDashboardTab.jsx`
- Create: `src/components/admin/AdminSettingsTab.jsx`
- Create: `src/components/admin/AdminNavigationTab.jsx`
- Create: `src/components/admin/AdminPagesTab.jsx`
- Create: `src/components/admin/AdminPostsTab.jsx`
- Create: `src/components/admin/AdminMediaTab.jsx`
- Create: `src/components/admin/AdminAnalyticsTab.jsx`

Note: `AdminSettingsTab` and `AdminNavigationTab` use `components/ui/Button` and `components/ui/Input`. `AdminPagesTab` imports `AdminContentEditor` from the same directory (`'./AdminContentEditor'` — already in template at that path).

- [ ] **Create AdminDashboardTab.jsx**

```jsx
import { motion } from 'framer-motion';
import { Settings, Navigation, FileText, RefreshCw } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  CmsBadge,
  CmsDot,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  GhostTealButton,
  QuickActionsRow,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminDashboardTab({
  isCMSEnabled,
  stats,
  onTabChange,
  onClearCache,
}) {
  return (
    <motion.div key="dashboard" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <PageSubtitle>Overview of your site</PageSubtitle>
        </div>
        <CmsBadge active={isCMSEnabled}>
          <CmsDot />
          {isCMSEnabled ? 'Firebase Active' : 'Local Mode'}
        </CmsBadge>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.pages}</StatValue>
          <StatLabel>Pages</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.posts}</StatValue>
          <StatLabel>Posts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.navItems}</StatValue>
          <StatLabel>Nav Items</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.cacheSize}</StatValue>
          <StatLabel>Cached</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <RefreshCw size={12} />
            Quick Actions
          </SectionCardTitle>
        </SectionCardHeader>
        <QuickActionsRow>
          <GhostTealButton onClick={() => onTabChange('settings')}>
            <Settings size={12} />
            Edit Settings
          </GhostTealButton>
          <GhostTealButton onClick={() => onTabChange('navigation')}>
            <Navigation size={12} />
            Manage Navigation
          </GhostTealButton>
          <GhostTealButton onClick={() => onTabChange('pages')}>
            <FileText size={12} />
            Manage Pages
          </GhostTealButton>
          <GhostTealButton onClick={onClearCache}>
            <RefreshCw size={12} />
            Clear Cache
          </GhostTealButton>
        </QuickActionsRow>
      </SectionCard>
    </motion.div>
  );
}
```

- [ ] **Create AdminSettingsTab.jsx**

```jsx
import { motion } from 'framer-motion';
import { Settings, Edit2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  GhostTealButton,
  Form,
  FormGroup,
  FormLabel,
  StyledTextarea,
  ActionButtons,
  SettingsViewGrid,
  SettingsLabel,
  SettingsValue,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminSettingsTab({
  settings,
  settingsForm,
  setSettingsForm,
  editingSettings,
  setEditingSettings,
  loading,
  onSubmit,
}) {
  return (
    <motion.div key="settings" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>Site-wide configuration</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Settings size={12} />
            Site Settings
          </SectionCardTitle>
          {!editingSettings && (
            <GhostTealButton onClick={() => setEditingSettings(true)}>
              <Edit2 size={12} />
              Edit
            </GhostTealButton>
          )}
        </SectionCardHeader>

        {editingSettings ? (
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel>Site Title</FormLabel>
              <Input
                value={settingsForm.title}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, title: e.target.value })
                }
                placeholder="Enter site title"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Site Description</FormLabel>
              <StyledTextarea
                value={settingsForm.description}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter site description"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Author</FormLabel>
              <Input
                value={settingsForm.author}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, author: e.target.value })
                }
                placeholder="Enter author name"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Site URL</FormLabel>
              <Input
                value={settingsForm.url}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, url: e.target.value })
                }
                placeholder="https://example.com"
                type="url"
              />
            </FormGroup>
            <ActionButtons>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingSettings(false)}
              >
                Cancel
              </Button>
            </ActionButtons>
          </Form>
        ) : (
          <SettingsViewGrid>
            {[
              ['Title', settings?.title],
              ['Description', settings?.description],
              ['Author', settings?.author],
              ['URL', settings?.url],
            ].map(([label, value]) => (
              <div key={label}>
                <SettingsLabel>{label}</SettingsLabel>
                <SettingsValue hasValue={!!value}>
                  {value || 'Not set'}
                </SettingsValue>
              </div>
            ))}
          </SettingsViewGrid>
        )}
      </SectionCard>
    </motion.div>
  );
}
```

- [ ] **Create AdminNavigationTab.jsx**

```jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Plus, Edit2, Trash2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import ConfirmDialog from './ConfirmDialog';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  GhostTealButton,
  Form,
  FormGroup,
  FormLabel,
  ActionButtons,
  NavigationList,
  NavigationItemCard,
  NavigationItemTitle,
  NavigationItemPath,
  NavigationActions,
  IconButton,
  CompactEmptyState,
  CompactEmptyIcon,
  LoadingSpinner,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminNavigationTab({
  navigation,
  navigationLoading,
  editingNavigation,
  setEditingNavigation,
  editingNavItem,
  navigationForm,
  setNavigationForm,
  loading,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);

  const confirmDelete = () => {
    if (pendingDelete) {
      onDelete(pendingDelete.id);
    }
  };

  return (
    <motion.div key="navigation" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Navigation</PageTitle>
          <PageSubtitle>Manage site navigation items</PageSubtitle>
        </div>
      </PageHeader>

      {editingNavigation ? (
        <SectionCard>
          <SectionCardHeader>
            <SectionCardTitle>
              <Navigation size={12} />
              {editingNavItem ? 'Edit Item' : 'Add Item'}
            </SectionCardTitle>
          </SectionCardHeader>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel>Label</FormLabel>
              <Input
                value={navigationForm.label}
                onChange={(e) =>
                  setNavigationForm({
                    ...navigationForm,
                    label: e.target.value,
                  })
                }
                placeholder="Enter navigation label"
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Path</FormLabel>
              <Input
                value={navigationForm.path}
                onChange={(e) =>
                  setNavigationForm({ ...navigationForm, path: e.target.value })
                }
                placeholder="/path"
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Order</FormLabel>
              <Input
                type="number"
                value={navigationForm.order}
                onChange={(e) =>
                  setNavigationForm({
                    ...navigationForm,
                    order: parseInt(e.target.value),
                  })
                }
                min="1"
                required
              />
            </FormGroup>
            <ActionButtons>
              <Button type="submit" disabled={loading}>
                {loading
                  ? 'Saving...'
                  : editingNavItem
                    ? 'Update Item'
                    : 'Add Item'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </ActionButtons>
          </Form>
        </SectionCard>
      ) : (
        <SectionCard>
          <SectionCardHeader>
            <SectionCardTitle>
              <Navigation size={12} />
              Navigation Items
            </SectionCardTitle>
            <GhostTealButton onClick={() => setEditingNavigation(true)}>
              <Plus size={12} />
              Add Item
            </GhostTealButton>
          </SectionCardHeader>
          {navigationLoading ? (
            <LoadingSpinner />
          ) : navigation?.length > 0 ? (
            <NavigationList>
              {navigation.map((item) => (
                <NavigationItemCard key={item.id}>
                  <div>
                    <NavigationItemTitle>{item.label}</NavigationItemTitle>
                    <NavigationItemPath>
                      {item.path} · Order {item.order}
                    </NavigationItemPath>
                  </div>
                  <NavigationActions>
                    <IconButton onClick={() => onEdit(item)} title="Edit">
                      <Edit2 size={14} />
                    </IconButton>
                    <IconButton
                      onClick={() => setPendingDelete(item)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </NavigationActions>
                </NavigationItemCard>
              ))}
            </NavigationList>
          ) : (
            <CompactEmptyState>
              <CompactEmptyIcon>≡</CompactEmptyIcon>
              No navigation items yet
            </CompactEmptyState>
          )}
        </SectionCard>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete navigation item?"
        description={
          pendingDelete
            ? `"${pendingDelete.label}" will be removed from the site navigation. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
}
```

- [ ] **Create AdminPagesTab.jsx**

```jsx
import { motion } from 'framer-motion';
import { ContentEditor } from './AdminContentEditor';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  FlushSectionCard,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminPagesTab() {
  return (
    <motion.div key="pages" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Pages</PageTitle>
          <PageSubtitle>Manage site pages</PageSubtitle>
        </div>
      </PageHeader>

      <FlushSectionCard>
        <ContentEditor />
      </FlushSectionCard>
    </motion.div>
  );
}
```

- [ ] **Create AdminPostsTab.jsx**

```jsx
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  CompactEmptyState,
  CompactEmptyIcon,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminPostsTab() {
  return (
    <motion.div key="posts" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Blog Posts</PageTitle>
          <PageSubtitle>Manage blog posts and articles</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Newspaper size={12} />
            Blog Posts
          </SectionCardTitle>
        </SectionCardHeader>
        <CompactEmptyState>
          <CompactEmptyIcon>📝</CompactEmptyIcon>
          Blog post management is coming soon
        </CompactEmptyState>
      </SectionCard>
    </motion.div>
  );
}
```

- [ ] **Create AdminMediaTab.jsx**

```jsx
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  CompactEmptyState,
  CompactEmptyIcon,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminMediaTab() {
  return (
    <motion.div key="media" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Media Library</PageTitle>
          <PageSubtitle>Manage images, videos and files</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Image size={12} />
            Media Library
          </SectionCardTitle>
        </SectionCardHeader>
        <CompactEmptyState>
          <CompactEmptyIcon>🖼️</CompactEmptyIcon>
          Media management is coming soon
        </CompactEmptyState>
      </SectionCard>
    </motion.div>
  );
}
```

- [ ] **Create AdminAnalyticsTab.jsx**

```jsx
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  CompactEmptyState,
  CompactEmptyIcon,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminAnalyticsTab() {
  return (
    <motion.div key="analytics" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Analytics</PageTitle>
          <PageSubtitle>Traffic and performance overview</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <TrendingUp size={12} />
            Analytics
          </SectionCardTitle>
        </SectionCardHeader>
        <CompactEmptyState>
          <CompactEmptyIcon>📊</CompactEmptyIcon>
          No analytics data yet · connect an analytics source to see traffic and
          performance metrics
        </CompactEmptyState>
      </SectionCard>
    </motion.div>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/admin/AdminDashboardTab.jsx \
        src/components/admin/AdminSettingsTab.jsx \
        src/components/admin/AdminNavigationTab.jsx \
        src/components/admin/AdminPagesTab.jsx \
        src/components/admin/AdminPostsTab.jsx \
        src/components/admin/AdminMediaTab.jsx \
        src/components/admin/AdminAnalyticsTab.jsx
git commit -m "feat(admin): add per-tab components (dashboard, settings, navigation, pages, posts, media, analytics)"
```

---

## Task 9: Replace AdminDashboard.jsx with thin shell

**Files:**
- Modify: `src/components/admin/AdminDashboard.jsx` (replace all 1293 lines)

Note: Import paths differ from Titan because the file is already inside `admin/`:
- `'./admin/AdminSidebar'` → `'./AdminSidebar'`
- `'./admin/AdminDashboard.styles'` → `'./AdminDashboard.styles'`
- `{ toast } from '@/utils/toast'` — same alias works in template

- [ ] **Replace the file**

```jsx
import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCMS, useSettings, useNavigation, usePosts } from 'hooks/useContent';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import AdminSidebar from './AdminSidebar';
import AdminBottomTabBar from './AdminBottomTabBar';
import AdminDashboardTab from './AdminDashboardTab';
import AdminSettingsTab from './AdminSettingsTab';
import AdminNavigationTab from './AdminNavigationTab';
import AdminPagesTab from './AdminPagesTab';
import AdminPostsTab from './AdminPostsTab';
import AdminMediaTab from './AdminMediaTab';
import AdminAnalyticsTab from './AdminAnalyticsTab';
import {
  AdminContainer,
  MainContent,
  TabContent,
} from './AdminDashboard.styles';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingSettings, setEditingSettings] = useState(false);
  const [editingNavigation, setEditingNavigation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingNavItem, setEditingNavItem] = useState(null);

  const { isCMSEnabled, clearCache, stats } = useCMS();
  const { settings, updateSettings } = useSettings('site');
  const {
    navigation,
    loading: navigationLoading,
    updateNavigation,
  } = useNavigation();
  const { posts } = usePosts();
  const { logout } = useAuth();

  const [settingsForm, setSettingsForm] = useState({
    title: '',
    description: '',
    author: '',
    url: '',
  });

  const [navigationForm, setNavigationForm] = useState({
    label: '',
    path: '',
    order: 1,
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        title: settings.title || '',
        description: settings.description || '',
        author: settings.author || '',
        url: settings.url || '',
      });
    }
  }, [settings]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(settingsForm);
      setEditingSettings(false);
      toast.success('Settings updated successfully!');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedNav = editingNavItem
        ? navigation.map((item) =>
            item.id === editingNavItem.id
              ? { ...item, ...navigationForm }
              : item,
          )
        : [...navigation, { ...navigationForm, id: Date.now().toString() }];
      await updateNavigation(updatedNav);
      setEditingNavigation(false);
      setEditingNavItem(null);
      setNavigationForm({ label: '', path: '', order: 1 });
      toast.success('Navigation updated successfully!');
    } catch {
      toast.error('Failed to update navigation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNavigation = async (id) => {
    try {
      const updatedNav = navigation.filter((item) => item.id !== id);
      await updateNavigation(updatedNav);
      toast.success('Navigation item deleted successfully!');
    } catch {
      toast.error('Failed to delete navigation item');
    }
  };

  const handleEditNavigation = (item) => {
    setEditingNavItem(item);
    setNavigationForm({
      label: item.label,
      path: item.path,
      order: item.order,
    });
    setEditingNavigation(true);
  };

  const handleCancelNavigation = () => {
    setEditingNavigation(false);
    setEditingNavItem(null);
    setNavigationForm({ label: '', path: '', order: 1 });
  };

  const handleClearCache = async () => {
    try {
      await clearCache();
      toast.success('Cache cleared successfully!');
    } catch {
      toast.error('Failed to clear cache');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const calculatedStats = useMemo(
    () => ({
      pages: stats?.pages || 1,
      posts: posts?.length || 0,
      navItems: navigation?.length || 0,
      cacheSize: stats?.cacheSize || 0,
    }),
    [stats, posts, navigation],
  );

  return (
    <AdminContainer>
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
      />

      <MainContent>
        <TabContent>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                isCMSEnabled={isCMSEnabled}
                stats={calculatedStats}
                onTabChange={setActiveTab}
                onClearCache={handleClearCache}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsTab
                settings={settings}
                settingsForm={settingsForm}
                setSettingsForm={setSettingsForm}
                editingSettings={editingSettings}
                setEditingSettings={setEditingSettings}
                loading={loading}
                onSubmit={handleSettingsSubmit}
              />
            )}

            {activeTab === 'navigation' && (
              <AdminNavigationTab
                navigation={navigation}
                navigationLoading={navigationLoading}
                editingNavigation={editingNavigation}
                setEditingNavigation={setEditingNavigation}
                editingNavItem={editingNavItem}
                navigationForm={navigationForm}
                setNavigationForm={setNavigationForm}
                loading={loading}
                onSubmit={handleNavigationSubmit}
                onEdit={handleEditNavigation}
                onDelete={handleDeleteNavigation}
                onCancel={handleCancelNavigation}
              />
            )}

            {activeTab === 'pages' && <AdminPagesTab />}
            {activeTab === 'posts' && <AdminPostsTab />}
            {activeTab === 'media' && <AdminMediaTab />}
            {activeTab === 'analytics' && <AdminAnalyticsTab />}
          </AnimatePresence>
        </TabContent>
      </MainContent>

      <AdminBottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </AdminContainer>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/admin/AdminDashboard.jsx
git commit -m "refactor(admin): replace monolithic AdminDashboard with thin shell"
```

---

## Task 10: Update App.jsx

**Files:**
- Modify: `src/App.jsx`

Two changes:
1. Add `AuthProvider` + `RequireAuth` wrapper around `/admin` route
2. Add `position="bottom-right"` to `ToastProvider`
3. Change AdminDashboard import to stay at `components/admin/AdminDashboard` (already correct in template)

- [ ] **Edit src/App.jsx** — add two new imports after existing ones:

```jsx
import { AuthProvider } from 'context/AuthContext';
import RequireAuth from 'components/admin/RequireAuth';
```

- [ ] **Update the /admin route** — replace:
```jsx
<Route
  path="/admin"
  element={
    <Suspense fallback={<div>Loading admin...</div>}>
      <AdminDashboard />
    </Suspense>
  }
/>
```
with:
```jsx
<Route
  path="/admin"
  element={
    <AuthProvider>
      <RequireAuth>
        <Suspense fallback={<div>Loading admin...</div>}>
          <AdminDashboard />
        </Suspense>
      </RequireAuth>
    </AuthProvider>
  }
/>
```

- [ ] **Update ToastProvider** — replace `<ToastProvider />` with `<ToastProvider position="bottom-right" />`

- [ ] **Commit**
```bash
git add src/App.jsx
git commit -m "feat(admin): wrap /admin route with AuthProvider + RequireAuth"
```

---

## Task 11: Fix useContent.js refreshStats

**Files:**
- Modify: `src/hooks/useContent.js`

Replace the hardcoded `refreshStats` body (lines 329–344) with a real call to `contentService.getStats()`.

- [ ] **Edit the refreshStats callback** in `useCMS()` — replace:

```js
const refreshStats = useCallback(async () => {
  if (!isCMSEnabled) return;

  try {
    // Get current stats from content service
    const cacheSize = contentService.getCacheSize
      ? contentService.getCacheSize()
      : 0;

    setStats({
      pages: 1, // We know we have at least the home page
      posts: 0, // No posts yet
      navItems: 2, // We have home and demo navigation
      cacheSize,
    });
  } catch (error) {
    console.error('Failed to refresh stats:', error);
  }
}, [isCMSEnabled]);
```

with:

```js
const refreshStats = useCallback(async () => {
  if (!isCMSEnabled) return;

  try {
    const nextStats = await contentService.getStats();
    setStats(nextStats);
  } catch (error) {
    console.error('Failed to refresh stats:', error);
  }
}, [isCMSEnabled]);
```

- [ ] **Commit**
```bash
git add src/hooks/useContent.js
git commit -m "fix(admin): refreshStats now derives real stats from contentService"
```

---

## Task 12: Add getStats to content service

**Files:**
- Modify: `src/services/content.js`

Add `getStats()` method to the `ContentService` class, before `isCMSEnabled()`. Also add a named export at the bottom.

- [ ] **Add getStats method** inside the `ContentService` class, before `isCMSEnabled()`:

```js
async getStats(locale = 'en') {
  const [navItems, posts] = await Promise.all([
    this.getNavigation('main', locale),
    this.getPosts(),
  ]);

  return {
    pages: Object.keys(pageSchema).length,
    posts: posts.length,
    navItems: navItems.length,
    cacheSize: this.getCacheSize(),
  };
}
```

Note: `pageSchema` is already imported at the top of the file via `import { pages, settings, navigation, pageSchema } from '../content';` — verify this import exists; add `pageSchema` to it if missing.

- [ ] **Add named export** at the bottom of the file with existing exports:

```js
export const getStats = (...args) => contentService.getStats(...args);
```

- [ ] **Commit**
```bash
git add src/services/content.js
git commit -m "feat(admin): add contentService.getStats() for real dashboard stats"
```

---

## Task 13: Add i18n translations

**Files:**
- Modify: `src/i18n/locales/en.json`
- Modify: `src/i18n/locales/es.json`

- [ ] **Add to en.json** — add the `"admin"` key at the end of the JSON object (before the closing `}`):

```json
"admin": {
  "login": {
    "title": "Admin Sign In",
    "email": "Email",
    "emailPlaceholder": "you@example.com",
    "password": "Password",
    "passwordPlaceholder": "••••••••",
    "error": "Invalid email or password.",
    "signingIn": "Signing in...",
    "signIn": "Sign In"
  }
}
```

- [ ] **Add to es.json** — add the `"admin"` key at the end of the JSON object:

```json
"admin": {
  "login": {
    "title": "Iniciar Sesión",
    "email": "Correo electrónico",
    "emailPlaceholder": "tu@ejemplo.com",
    "password": "Contraseña",
    "passwordPlaceholder": "••••••••",
    "error": "Correo electrónico o contraseña incorrectos.",
    "signingIn": "Iniciando sesión...",
    "signIn": "Iniciar Sesión"
  }
}
```

- [ ] **Commit**
```bash
git add src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "feat(admin): add i18n translations for admin login (EN + ES)"
```

---

## Task 14: Verify pageSchema import in content.js

**Files:**
- Verify: `src/services/content.js` (content import line)
- Verify: `src/content/index.js` (exports `pageSchema`)

- [ ] **Check content/index.js** exports `pageSchema`:
```bash
grep "pageSchema" /Users/joshua/Development/transpiled-web-template/src/content/index.js
```

- [ ] **Check content.js** already imports `pageSchema`:
```bash
grep "pageSchema" /Users/joshua/Development/transpiled-web-template/src/services/content.js | head -3
```

If `pageSchema` is not in the import, update the import line in `content.js` to include it.

---

## Task 15: Quality check and format

- [ ] **Run format + lint**
```bash
cd /Users/joshua/Development/transpiled-web-template
yarn format && yarn lint
```

Fix any lint errors before proceeding.

- [ ] **Run tests**
```bash
yarn test
```

- [ ] **Start dev server and verify manually**
```bash
./dev.sh
```

Open `http://localhost:5173/admin`:
- With `VITE_CMS_ENABLED=false` (default): should show "Admin unavailable" message
- With `VITE_CMS_ENABLED=true` + Firebase vars: should show login form with blueprint grid background
- After login: should show Dashboard tab with modular layout
- Desktop: sidebar navigation visible
- Mobile (resize to <768px): bottom tab bar visible, sidebar hidden
- Navigate all 7 tabs: Dashboard, Settings, Navigation, Pages, Blog Posts, Media, Analytics
- Pages tab: should render the existing ContentEditor component
- Navigation tab: Add/Edit/Delete items; confirm dialog appears for delete
- Sign Out button: appears in sidebar

- [ ] **🛑 Get developer approval before committing**

- [ ] **Create PR**
```bash
gh pr create --fill
```

---

## Verification

End-to-end test checklist:
1. `/admin` with no Firebase config → "Admin unavailable" block screen
2. `/admin` with Firebase configured → Login form with blueprint grid
3. Login with valid credentials → Dashboard
4. Dashboard tab shows real stats (pages, posts, nav items, cache size)
5. Settings tab: view → edit → save updates settings
6. Navigation tab: add → edit → delete (with confirm dialog)
7. Pages tab: renders ContentEditor for multilingual page editing
8. Blog Posts, Media, Analytics: show "coming soon" empty states
9. Sign Out → redirects back to login form
10. Mobile: bottom tab bar renders with correct 5 tabs
11. Desktop: sidebar renders with grouped tabs + dividers
12. Toast notifications appear bottom-right
