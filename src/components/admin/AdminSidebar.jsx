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
