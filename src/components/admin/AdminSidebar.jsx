import { Fragment } from 'react';
import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';
import { Sidebar, SidebarItem, SidebarDivider } from './AdminDashboard.styles';
import { ADMIN_TAB_GROUPS, getAdminTab } from './adminTabs';
import { pageSchema } from '../../content/schema';

const PageSubList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 2px 0 4px 24px;
`;

const PageSubItem = styled('button', {
  shouldForwardProp: (p) => p !== 'active',
})`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 10px;
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: all ${(p) => p.theme.transitions.fast};
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}18` : 'transparent'};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.45)'};

  &:hover {
    background: ${(p) =>
      p.active ? `${p.theme.colors.primary}18` : 'rgba(255,255,255,0.04)'};
    color: ${(p) =>
      p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.7)'};
  }
`;

const ChevronWrap = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  opacity: 0.4;
  transform: rotate(${(p) => (p.open ? '0deg' : '-90deg')});
  transition: transform 0.15s;
`;

export default function AdminSidebar({
  activeTab,
  onTabChange,
  selectedPage,
  onPageChange,
}) {
  const pagesOpen = activeTab === 'pages';
  const pages = Object.entries(pageSchema);

  return (
    <Sidebar>
      {ADMIN_TAB_GROUPS.map((group, groupIndex) => (
        <Fragment key={group.join('-')}>
          {groupIndex > 0 && <SidebarDivider />}
          {group.map((tabId) => {
            const tab = getAdminTab(tabId);
            if (!tab?.enabled) return null;
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Fragment key={tab.id}>
                <SidebarItem
                  active={isActive}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon size={14} />
                  {tab.label}
                  {tab.id === 'pages' && (
                    <ChevronWrap open={pagesOpen}>
                      <ChevronDown size={12} />
                    </ChevronWrap>
                  )}
                </SidebarItem>

                {tab.id === 'pages' && pagesOpen && (
                  <PageSubList>
                    {pages.map(([pageId, page]) => (
                      <PageSubItem
                        key={pageId}
                        active={selectedPage === pageId}
                        onClick={() => {
                          onPageChange(pageId);
                          onTabChange('pages');
                        }}
                      >
                        {page.label}
                      </PageSubItem>
                    ))}
                  </PageSubList>
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </Sidebar>
  );
}
