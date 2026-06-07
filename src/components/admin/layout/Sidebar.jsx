import { Fragment, useMemo } from 'react';
import styled from '@emotion/styled';
import * as RadixSeparator from '@radix-ui/react-separator';
import { ChevronDown } from 'lucide-react';
import { getAdminTab, getVisibleTabGroups } from '../tabs/adminTabsConfig';
import { pageSchema } from '../../../content/schema';

const SidebarContainer = styled.div`
  position: fixed;
  top: 67px;
  left: 0;
  width: 200px;
  height: calc(100vh - 67px);
  background: ${(p) => p.theme.colors.background};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  padding: 60px 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  z-index: ${(p) => p.theme.zIndex.sticky - 1};

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarItem = styled.div`
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
      p.active
        ? `${p.theme.colors.primary}1a`
        : p.theme.colors.secondaryBackground};
    color: ${(p) => (p.active ? p.theme.colors.primary : p.theme.colors.text)};
  }
`;

const SidebarDivider = styled(RadixSeparator.Root)`
  margin: 12px 0;
  height: 1px;
  background-color: ${(p) => p.theme.colors.border};
`;

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
    p.active ? p.theme.colors.primary : p.theme.colors.textMuted};

  &:hover {
    background: ${(p) =>
      p.active
        ? `${p.theme.colors.primary}18`
        : p.theme.colors.secondaryBackground};
    color: ${(p) => (p.active ? p.theme.colors.primary : p.theme.colors.text)};
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

export default function Sidebar({
  activeTab,
  onTabChange,
  selectedPage,
  onPageChange,
  userRole,
}) {
  const pagesOpen = activeTab === 'content';
  const pages = useMemo(() => Object.entries(pageSchema), []);
  const visibleGroups = useMemo(
    () => getVisibleTabGroups(userRole),
    [userRole],
  );

  return (
    <SidebarContainer>
      {visibleGroups.map((group, groupIndex) => (
        <Fragment key={group.join('-')}>
          {groupIndex > 0 && <SidebarDivider />}
          {group.map((tabId) => {
            const tab = getAdminTab(tabId);
            if (!tab) return null;
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
                  {tab.id === 'content' && (
                    <ChevronWrap open={pagesOpen}>
                      <ChevronDown size={12} />
                    </ChevronWrap>
                  )}
                </SidebarItem>

                {tab.id === 'content' && pagesOpen && (
                  <PageSubList>
                    {pages.map(([pageId, page]) => (
                      <PageSubItem
                        key={pageId}
                        active={selectedPage === pageId}
                        onClick={() => {
                          onPageChange(pageId);
                          onTabChange('content');
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
    </SidebarContainer>
  );
}
