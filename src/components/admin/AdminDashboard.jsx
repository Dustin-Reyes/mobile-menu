import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCMS, useSettings, useNavigation, usePosts } from 'hooks/useContent';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import AdminSidebar from './AdminSidebar';
import AdminBottomTabBar from './AdminBottomTabBar';
import AdminDashboardTab from './AdminDashboardTab';
import AdminSettingsTab from './AdminSettingsTab';
import AdminNavigationTab from './AdminNavigationTab';
import AdminPagesTab from './AdminPagesTab';
import AdminPostsTab from './AdminPostsTab';
import AdminMediaTab from './AdminMediaTab';
import {
  AdminContainer,
  MainContent,
  TabContent,
} from './AdminDashboard.styles';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingSettings, setEditingSettings] = useState(false);
  const [editingNavigation, setEditingNavigation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingNavItem, setEditingNavItem] = useState(null);

  const { isCMSEnabled, clearCache, stats } = useCMS();
  const { settings, updateSettings } = useSettings('site');
  const {
    navigation,
    loading: navigationLoading,
    updateNavigation,
  } = useNavigation();
  const { posts } = usePosts();
  const { logout } = useAuth();

  const [settingsForm, setSettingsForm] = useState({
    title: '',
    description: '',
    author: '',
    url: '',
  });

  const [navigationForm, setNavigationForm] = useState({
    label: '',
    path: '',
    order: 1,
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

  const handleNavigationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedNav = editingNavItem
        ? navigation.map((item) =>
            item.id === editingNavItem.id
              ? { ...item, ...navigationForm }
              : item,
          )
        : [...navigation, { ...navigationForm, id: Date.now().toString() }];
      await updateNavigation(updatedNav);
      setEditingNavigation(false);
      setEditingNavItem(null);
      setNavigationForm({ label: '', path: '', order: 1 });
      toast.success('Navigation updated successfully!');
    } catch {
      toast.error('Failed to update navigation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNavigation = async (id) => {
    try {
      const updatedNav = navigation.filter((item) => item.id !== id);
      await updateNavigation(updatedNav);
      toast.success('Navigation item deleted successfully!');
    } catch {
      toast.error('Failed to delete navigation item');
    }
  };

  const handleEditNavigation = (item) => {
    setEditingNavItem(item);
    setNavigationForm({
      label: item.label,
      path: item.path,
      order: item.order,
    });
    setEditingNavigation(true);
  };

  const handleCancelNavigation = () => {
    setEditingNavigation(false);
    setEditingNavItem(null);
    setNavigationForm({ label: '', path: '', order: 1 });
  };

  const handleClearCache = async () => {
    try {
      await clearCache();
      toast.success('Cache cleared successfully!');
    } catch {
      toast.error('Failed to clear cache');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const calculatedStats = useMemo(
    () => ({
      pages: stats?.pages || 1,
      posts: posts?.length || 0,
      navItems: navigation?.length || 0,
      cacheSize: stats?.cacheSize || 0,
    }),
    [stats, posts, navigation],
  );

  return (
    <AdminContainer>
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
      />

      <MainContent>
        <TabContent>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                isCMSEnabled={isCMSEnabled}
                stats={calculatedStats}
                onTabChange={setActiveTab}
                onClearCache={handleClearCache}
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

            {activeTab === 'navigation' && (
              <AdminNavigationTab
                navigation={navigation}
                navigationLoading={navigationLoading}
                editingNavigation={editingNavigation}
                setEditingNavigation={setEditingNavigation}
                editingNavItem={editingNavItem}
                navigationForm={navigationForm}
                setNavigationForm={setNavigationForm}
                loading={loading}
                onSubmit={handleNavigationSubmit}
                onEdit={handleEditNavigation}
                onDelete={handleDeleteNavigation}
                onCancel={handleCancelNavigation}
              />
            )}

            {activeTab === 'pages' && <AdminPagesTab />}
            {activeTab === 'posts' && <AdminPostsTab />}
            {activeTab === 'media' && <AdminMediaTab />}
          </AnimatePresence>
        </TabContent>
      </MainContent>

      <AdminBottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </AdminContainer>
  );
}
