import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useCMS, useSettings, usePosts } from 'hooks/useContent';
import PROJECT_CONFIG from 'config/project';
import { toast } from '@/utils/toast';
import AdminSidebar from './AdminSidebar';
import AdminBottomTabBar from './AdminBottomTabBar';
import AdminDashboardTab from './AdminDashboardTab';
import AdminSettingsTab from './AdminSettingsTab';
import AdminPagesTab from './AdminPagesTab';
import AdminPostsTab from './AdminPostsTab';
import AdminMediaTab from './AdminMediaTab';
import AdminProfileTab from './AdminProfileTab';
import {
  AdminContainer,
  MainContent,
  TabContent,
} from './AdminDashboard.styles';

export default function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || 'dashboard',
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
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        title: settings.title || '',
        description: settings.description || '',
        author: settings.author || '',
        url: settings.url || '',
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
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <MainContent>
        <TabContent>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                isCMSEnabled={isCMSEnabled}
                stats={calculatedStats}
                settings={settings}
                postsEnabled={PROJECT_CONFIG.features.posts}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsTab
                settings={settings}
                settingsForm={settingsForm}
                setSettingsForm={setSettingsForm}
                editingSettings={editingSettings}
                setEditingSettings={setEditingSettings}
                loading={loading}
                onSubmit={handleSettingsSubmit}
              />
            )}

            {activeTab === 'pages' && <AdminPagesTab />}
            {activeTab === 'posts' && <AdminPostsTab />}
            {activeTab === 'media' && <AdminMediaTab />}
            {activeTab === 'profile' && <AdminProfileTab />}
          </AnimatePresence>
        </TabContent>
      </MainContent>

      <AdminBottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </AdminContainer>
  );
}
