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
