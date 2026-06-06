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
  border-right: 1px solid rgba(255, 255, 255, 0.06);
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
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={16} />
          </BottomTab>
        );
      })}
    </BottomTabBarContainer>
  );
}
