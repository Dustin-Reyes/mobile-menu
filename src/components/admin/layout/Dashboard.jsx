import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { useCMS, useSettings, usePosts } from 'hooks/useContent';
import PROJECT_CONFIG from 'config/project';
import { toast } from '@/utils/toast';
import { useAuth } from 'context/AuthContext';
import { pageSchema } from '../../../content/schema';
import Sidebar from './Sidebar';
import BottomTabBar from './BottomTabBar';
import DashboardTab from '../tabs/DashboardTab';
import SettingsTab from '../tabs/SettingsTab';
import PagesTab from '../tabs/PagesTab';
import PostsTab from '../tabs/PostsTab';
import MediaTab from '../tabs/MediaTab';
import ProfileTab from '../tabs/ProfileTab';
import UsersTab from '../users/UsersTab';

const AdminContainer = styled.div`
  height: calc(100vh - 67px);
  overflow: hidden;
  background: ${(p) => p.theme.colors.background};
  display: flex;

  @media (max-width: 768px) {
    padding-bottom: 60px;
  }
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
  padding: ${(p) => (p.flush ? '0' : '60px 20px 16px')};
  display: flex;
  flex-direction: column;
`;

export default function Dashboard() {
  const location = useLocation();
  const { userRole } = useAuth();
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

  const [editingSettings, setEditingSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isCMSEnabled, stats } = useCMS();
  const { settings, updateSettings } = useSettings('site');
  const { posts } = usePosts();

  const [settingsForm, setSettingsForm] = useState({
    title: '',
    description: '',
    author: '',
    url: '',
    tagline: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    github: '',
    youtube: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        title: settings.title || '',
        description: settings.description || '',
        author: settings.author || '',
        url: settings.url || '',
        tagline: settings.tagline || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        twitter: settings.twitter || '',
        linkedin: settings.linkedin || '',
        github: settings.github || '',
        youtube: settings.youtube || '',
        contactPhone: settings.contactPhone || '',
        contactEmail: settings.contactEmail || '',
        address: settings.address || '',
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

  const calculatedStats = useMemo(
    () => ({
      pages: stats?.pages || 1,
      posts: posts?.length || 0,
      cacheSize: stats?.cacheSize || 0,
    }),
    [stats, posts],
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
        <TabContent flush={activeTab === 'pages'}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardTab
                isCMSEnabled={isCMSEnabled}
                stats={calculatedStats}
                settings={settings}
                postsEnabled={PROJECT_CONFIG.features.posts}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                settings={settings}
                settingsForm={settingsForm}
                setSettingsForm={setSettingsForm}
                editingSettings={editingSettings}
                setEditingSettings={setEditingSettings}
                loading={loading}
                onSubmit={handleSettingsSubmit}
              />
            )}

            {activeTab === 'pages' && (
              <PagesTab
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

      <BottomTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
      />
    </AdminContainer>
  );
}
