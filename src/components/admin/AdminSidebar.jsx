import { Fragment } from 'react';
import { Sidebar, SidebarItem, SidebarDivider } from './AdminDashboard.styles';
import { ADMIN_TAB_GROUPS, getAdminTab } from './adminTabs';

export default function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <Sidebar>
      {ADMIN_TAB_GROUPS.map((group, groupIndex) => (
        <Fragment key={group.join('-')}>
          {groupIndex > 0 && <SidebarDivider />}
          {group.map((tabId) => {
            const tab = getAdminTab(tabId);
            if (!tab?.enabled) return null;
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
    </Sidebar>
  );
}
