/**
 * Mobile-only fixed bottom navigation bar for the admin panel.
 * @module components/admin/layout/BottomTabBar
 */

import { useMemo } from 'react';
import styled from '@emotion/styled';
import { BOTTOM_TAB_IDS, getAdminTab } from '../tabs/adminTabsConfig';
import { isTabVisible } from 'utils/roleHelpers';

const BottomTabBarContainer = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: ${(p) => p.theme.colors.surface};
    border-top: 1px solid ${(p) => p.theme.colors.border};
    z-index: ${(p) => p.theme.zIndex.sticky};
  }
`;

const BottomTab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 0;
  background: transparent;
  border: none;
  border-right: 1px solid ${(p) => p.theme.colors.border};
  cursor: pointer;
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : p.theme.colors.textSecondary};
  transition: color ${(p) => p.theme.transitions.fast};

  &:last-child {
    border-right: none;
  }
`;

/**
 * Fixed bottom tab bar rendered only on mobile, showing role-filtered admin navigation tabs.
 * @param {Object} props
 * @param {string} props.activeTab - ID of the currently active tab.
 * @param {function} props.onTabChange - Callback invoked with the new tab ID when a tab is pressed.
 * @param {string} props.userRole - Current user's role, used to filter visible tabs.
 * @returns {JSX.Element}
 */
export default function BottomTabBar({ activeTab, onTabChange, userRole }) {
  const visibleTabs = useMemo(
    () =>
      BOTTOM_TAB_IDS.map((tabId) => {
        const tab = getAdminTab(tabId);
        if (!tab || !isTabVisible(tab, userRole)) return null;
        return tab;
      }).filter(Boolean),
    [userRole],
  );

  return (
    <BottomTabBarContainer>
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <BottomTab
            key={tab.id}
            active={activeTab === tab.id}
            data-testid={`${tab.id}-tab`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={16} />
            {tab.shortLabel}
          </BottomTab>
        );
      })}
    </BottomTabBarContainer>
  );
}
