/**
 * Top-level admin dashboard that composes the sidebar, content area, and all admin tab views.
 * @module components/admin/layout/Dashboard
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { useCMS, useSettings, usePosts } from 'hooks/useContent';
import PROJECT_CONFIG from 'config/project';
import { useAuth } from 'context/AuthContext';
import { callUserManagement } from 'utils/admin/userHelpers';
import { pageSchema } from '../../../content/schema';
import Sidebar from './Sidebar';
import DashboardTab from '../tabs/DashboardTab';
import SettingsTab from '../tabs/SettingsTab';
import ContentTab from '../tabs/ContentTab';
import PostsTab from '../tabs/PostsTab';
import MediaTab from '../tabs/MediaTab';
import ProfileTab from '../tabs/ProfileTab';
import UsersTab from '../users/UsersTab';

const AdminContainer = styled.div`
  height: calc(100vh - 67px);
  overflow: hidden;
  background: ${(p) => p.theme.colors.background};
  display: flex;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TabContent = styled('div', {
  shouldForwardProp: (p) => p !== 'flush',
})`
  flex: 1;
  overflow-y: ${(p) => (p.flush ? 'hidden' : 'auto')};
  overflow-x: hidden;
  padding: ${(p) => (p.flush ? '0' : '60px 20px 16px')};
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: ${(p) => (p.flush ? '0' : '24px 16px 16px')};
  }
`;

/**
 * Admin dashboard shell that manages active tab state and renders the appropriate tab content.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const location = useLocation();
  const { user, userRole } = useAuth();
  const [userCount, setUserCount] = useState(null);
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || 'dashboard',
  );
  const [selectedPage, setSelectedPage] = useState(
    () => Object.keys(pageSchema)[0],
  );

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state?.tab]);

  const { isCMSEnabled, stats } = useCMS();
  const { settings, updateSettings } = useSettings('site');
  const { posts } = usePosts();

  const fetchUserCount = useCallback(async () => {
    if (!user) return;
    try {
      const data = await callUserManagement('list', user);
      setUserCount(data.users?.length ?? 0);
    } catch {
      setUserCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchUserCount();
  }, [fetchUserCount]);

  const calculatedStats = useMemo(
    () => ({
      pages: stats?.pages || 1,
      posts: posts?.length || 0,
      cacheSize: stats?.cacheSize || 0,
      users: userCount,
    }),
    [stats, posts, userCount],
  );

  return (
    <AdminContainer>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedPage={selectedPage}
        onPageChange={setSelectedPage}
        userRole={userRole}
      />

      <MainContent>
        <TabContent flush={activeTab === 'content'}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardTab
                isCMSEnabled={isCMSEnabled}
                stats={calculatedStats}
                settings={settings}
                postsEnabled={PROJECT_CONFIG.features.posts}
                onTabChange={setActiveTab}
                loading={userCount === null}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                settings={settings}
                updateSettings={updateSettings}
              />
            )}

            {activeTab === 'content' && (
              <ContentTab
                selectedPage={selectedPage}
                onPageChange={setSelectedPage}
              />
            )}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'posts' && <PostsTab />}
            {activeTab === 'media' && <MediaTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </AnimatePresence>
        </TabContent>
      </MainContent>
    </AdminContainer>
  );
}
