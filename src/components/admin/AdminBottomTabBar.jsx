import { BottomTabBar, BottomTab } from './AdminDashboard.styles';
import { BOTTOM_TAB_IDS, getAdminTab } from './adminTabs';
import { isTabVisible } from 'utils/roleHelpers';

export default function AdminBottomTabBar({
  activeTab,
  onTabChange,
  userRole,
}) {
  return (
    <BottomTabBar>
      {BOTTOM_TAB_IDS.map((tabId) => {
        const tab = getAdminTab(tabId);
        if (!tab || !isTabVisible(tab, userRole)) return null;
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
