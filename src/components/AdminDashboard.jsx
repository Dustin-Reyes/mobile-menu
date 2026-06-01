/**
 * 🚀 Enterprise Admin Dashboard - Professional CMS Interface
 *
 * A modern, scalable, and beautiful admin interface for managing
 * Firebase CMS content with advanced features and stunning UX.
 */

import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS, useSettings, useNavigation, usePosts } from 'hooks/useContent';
import { ContentEditor } from './AdminContentEditor';
import { toast } from '@/utils/toast';
import Button from 'components/Button';
import Input from 'components/Input';
import * as Separator from '@radix-ui/react-separator';
import {
  Settings,
  Navigation,
  FileText,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Image,
  Newspaper,
} from 'lucide-react';

// ─── Styled Components ───────────────────────────────────────────────────────

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  display: flex;
  margin-top: 10rem;

  @media (max-width: 768px) {
    padding-bottom: 56px;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 10rem;
  left: 0;
  width: 160px;
  height: calc(100vh - 10rem);
  background: ${(p) => p.theme.colors.background};
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;

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
      p.active ? `${p.theme.colors.primary}1a` : 'rgba(255,255,255,0.04)'};
    color: ${(p) =>
      p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.7)'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 160px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 3px;
`;

const PageSubtitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
`;

const CmsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${(p) =>
    p.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${(p) => (p.active ? '#4ade80' : '#f87171')};
  border: 1px solid
    ${(p) => (p.active ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)')};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  padding: 3px 8px;
  border-radius: 9999px;
`;

const CmsDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;

const ActivityDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}80;
  flex-shrink: 0;
`;

/* ── Shared card primitives ── */

const SectionCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 16px;
  margin-bottom: 12px;
`;

const SectionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: rgba(255, 255, 255, 0.7);
`;

const GhostTealButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  padding: 4px 10px;
  background: ${(p) => p.theme.colors.primary}1a;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}40;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background: ${(p) => p.theme.colors.primary}2a;
  }
`;

const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 5px;
  color: rgba(255, 255, 255, 0.25);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

const CompactEmptyIcon = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  margin-bottom: 2px;
`;

/* ── Stat cards ── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 14px 16px;
`;

const StatValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.primary};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 5px;
`;

/* ── Navigation tab cards ── */

const NavigationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NavigationItemCard = styled.div`
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavigationActions = styled.div`
  display: flex;
  gap: 4px;
`;

const IconButton = styled.button`
  padding: 5px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primary}1a;
  }
`;

/* ── Form primitives (Settings / Navigation edit forms) ── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FormLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  display: block;
`;

const StyledTextarea = styled.textarea`
  padding: ${(p) => p.theme.spacing.s2} ${(p) => p.theme.spacing.s3};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}1a;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
`;

/* ── Bottom tab bar (mobile only) ── */

const BottomTabBar = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: ${(p) => p.theme.colors.background};
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    z-index: ${(p) => p.theme.zIndex.sticky};
  }
`;

const BottomTab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.3)'};
  transition: color ${(p) => p.theme.transitions.fast};
`;

/* ── Loading spinner (kept for Navigation tab) ── */

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ─── Additional Styled Components for Inline Typography ───────────────────────────────

const SettingsLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 2px;
`;

const SettingsValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) =>
    p.hasValue ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)'};
`;

const NavigationItemTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
`;

const NavigationItemPath = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
  margin-top: 2px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.5);
`;

const ActivityTime = styled.span`
  margin-left: auto;
  color: rgba(255, 255, 255, 0.25);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

const StatLabelInline = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
`;

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingSettings, setEditingSettings] = useState(false);
  const [editingNavigation, setEditingNavigation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingNavItem, setEditingNavItem] = useState(null);

  // CMS hooks
  const { isCMSEnabled, clearCache, stats } = useCMS();
  const { settings, updateSettings } = useSettings('site');
  const {
    navigation,
    loading: navigationLoading,
    updateNavigation,
  } = useNavigation();
  const { posts } = usePosts();
  // Form states
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

  // Initialize settings form
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

  // Handlers
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

  const handleClearCache = async () => {
    try {
      await clearCache();
      toast.success('Cache cleared successfully!');
    } catch {
      toast.error('Failed to clear cache');
    }
  };

  // Button click handlers for content management
  const handleButtonClick = (action, item = null) => {
    switch (action) {
      case 'view-page':
        if (item === 'home') {
          window.open('/', '_blank');
        } else if (item === 'about') {
          window.open('/about', '_blank');
        } else {
          toast.info(`View ${item} page feature coming soon!`);
        }
        break;
      case 'create-post':
        toast.info('Create post feature coming soon!');
        break;
      case 'edit-post':
        toast.info('Edit post feature coming soon!');
        break;
      case 'view-post':
        toast.info('View post feature coming soon!');
        break;
      case 'delete-post':
        if (window.confirm('Are you sure you want to delete this post?')) {
          toast.info('Delete post feature coming soon!');
        }
        break;
      case 'upload-media':
        toast.info('Media upload feature coming soon!');
        break;
      default:
        toast.info('Feature coming soon!');
    }
  };

  // Calculate stats
  const calculatedStats = useMemo(() => {
    return {
      pages: stats?.pages || 1,
      posts: posts?.length || 0,
      navItems: navigation?.length || 0,
      cacheSize: stats?.cacheSize || 0,
    };
  }, [stats, posts, navigation]);

  return (
    <AdminContainer>
      {/* ── Desktop Sidebar ── */}
      <Sidebar>
        <SidebarItem
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={14} />
          Dashboard
        </SidebarItem>
        <SidebarItem
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={14} />
          Settings
        </SidebarItem>

        <Separator.Root
          style={{
            margin: '12px 0',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          }}
        />
        <SidebarItem
          active={activeTab === 'pages'}
          onClick={() => setActiveTab('pages')}
        >
          <FileText size={14} />
          Pages
        </SidebarItem>
        <SidebarItem
          active={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
        >
          <Newspaper size={14} />
          Blog Posts
        </SidebarItem>
        <SidebarItem
          active={activeTab === 'media'}
          onClick={() => setActiveTab('media')}
        >
          <Image size={14} />
          Media
        </SidebarItem>

        <Separator.Root
          style={{
            margin: '12px 0',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          }}
        />

        <SidebarItem
          active={activeTab === 'navigation'}
          onClick={() => setActiveTab('navigation')}
        >
          <Navigation size={14} />
          Navigation
        </SidebarItem>
        <SidebarItem
          active={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp size={14} />
          Analytics
        </SidebarItem>
      </Sidebar>

      {/* ── Main content ── */}
      <MainContent>
        <TabContent>
          <AnimatePresence mode="wait">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PageHeader>
                  <div>
                    <PageTitle>Dashboard</PageTitle>
                    <PageSubtitle>Overview of your site</PageSubtitle>
                  </div>
                  <CmsBadge active={isCMSEnabled}>
                    <CmsDot />
                    {isCMSEnabled ? 'Firebase Active' : 'Local Mode'}
                  </CmsBadge>
                </PageHeader>

                <StatsGrid>
                  <StatCard>
                    <StatValue>{calculatedStats.pages}</StatValue>
                    <StatLabel>Pages</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{calculatedStats.posts}</StatValue>
                    <StatLabel>Posts</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{calculatedStats.navItems}</StatValue>
                    <StatLabel>Nav Items</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{calculatedStats.cacheSize}</StatValue>
                    <StatLabel>Cached</StatLabel>
                  </StatCard>
                </StatsGrid>

                <SectionCard>
                  <SectionCardHeader>
                    <SectionCardTitle>
                      <RefreshCw size={12} />
                      Quick Actions
                    </SectionCardTitle>
                  </SectionCardHeader>
                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    <GhostTealButton onClick={() => setActiveTab('settings')}>
                      <Settings size={12} />
                      Edit Settings
                    </GhostTealButton>
                    <GhostTealButton onClick={() => setActiveTab('navigation')}>
                      <Navigation size={12} />
                      Manage Navigation
                    </GhostTealButton>
                    <GhostTealButton onClick={() => setActiveTab('pages')}>
                      <FileText size={12} />
                      Manage Pages
                    </GhostTealButton>
                    <GhostTealButton onClick={handleClearCache}>
                      <RefreshCw size={12} />
                      Clear Cache
                    </GhostTealButton>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PageHeader>
                  <div>
                    <PageTitle>Settings</PageTitle>
                    <PageSubtitle>Site-wide configuration</PageSubtitle>
                  </div>
                </PageHeader>

                <SectionCard>
                  <SectionCardHeader>
                    <SectionCardTitle>
                      <Settings size={12} />
                      Site Settings
                    </SectionCardTitle>
                    {!editingSettings && (
                      <GhostTealButton onClick={() => setEditingSettings(true)}>
                        <Edit2 size={12} />
                        Edit
                      </GhostTealButton>
                    )}
                  </SectionCardHeader>

                  {editingSettings ? (
                    <Form onSubmit={handleSettingsSubmit}>
                      <FormGroup>
                        <FormLabel>Site Title</FormLabel>
                        <Input
                          value={settingsForm.title}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter site title"
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Site Description</FormLabel>
                        <StyledTextarea
                          value={settingsForm.description}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter site description"
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Author</FormLabel>
                        <Input
                          value={settingsForm.author}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              author: e.target.value,
                            })
                          }
                          placeholder="Enter author name"
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Site URL</FormLabel>
                        <Input
                          value={settingsForm.url}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              url: e.target.value,
                            })
                          }
                          placeholder="https://example.com"
                          type="url"
                        />
                      </FormGroup>
                      <ActionButtons>
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setEditingSettings(false)}
                        >
                          Cancel
                        </Button>
                      </ActionButtons>
                    </Form>
                  ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {[
                        ['Title', settings?.title],
                        ['Description', settings?.description],
                        ['Author', settings?.author],
                        ['URL', settings?.url],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <SettingsLabel>{label}</SettingsLabel>
                          <SettingsValue hasValue={!!value}>
                            {value || 'Not set'}
                          </SettingsValue>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* Navigation Tab */}
            {activeTab === 'navigation' && (
              <motion.div
                key="navigation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PageHeader>
                  <div>
                    <PageTitle>Navigation</PageTitle>
                    <PageSubtitle>Manage site navigation items</PageSubtitle>
                  </div>
                </PageHeader>

                {editingNavigation ? (
                  <SectionCard>
                    <SectionCardHeader>
                      <SectionCardTitle>
                        <Navigation size={12} />
                        {editingNavItem ? 'Edit Item' : 'Add Item'}
                      </SectionCardTitle>
                    </SectionCardHeader>
                    <Form onSubmit={handleNavigationSubmit}>
                      <FormGroup>
                        <FormLabel>Label</FormLabel>
                        <Input
                          value={navigationForm.label}
                          onChange={(e) =>
                            setNavigationForm({
                              ...navigationForm,
                              label: e.target.value,
                            })
                          }
                          placeholder="Enter navigation label"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Path</FormLabel>
                        <Input
                          value={navigationForm.path}
                          onChange={(e) =>
                            setNavigationForm({
                              ...navigationForm,
                              path: e.target.value,
                            })
                          }
                          placeholder="/path"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Order</FormLabel>
                        <Input
                          type="number"
                          value={navigationForm.order}
                          onChange={(e) =>
                            setNavigationForm({
                              ...navigationForm,
                              order: parseInt(e.target.value),
                            })
                          }
                          min="1"
                          required
                        />
                      </FormGroup>
                      <ActionButtons>
                        <Button type="submit" disabled={loading}>
                          {loading
                            ? 'Saving...'
                            : editingNavItem
                              ? 'Update Item'
                              : 'Add Item'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setEditingNavigation(false);
                            setEditingNavItem(null);
                            setNavigationForm({
                              label: '',
                              path: '',
                              order: 1,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </ActionButtons>
                    </Form>
                  </SectionCard>
                ) : (
                  <SectionCard>
                    <SectionCardHeader>
                      <SectionCardTitle>
                        <Navigation size={12} />
                        Navigation Items
                      </SectionCardTitle>
                      <GhostTealButton
                        onClick={() => setEditingNavigation(true)}
                      >
                        <Plus size={12} />
                        Add Item
                      </GhostTealButton>
                    </SectionCardHeader>
                    {navigationLoading ? (
                      <LoadingSpinner />
                    ) : navigation?.length > 0 ? (
                      <NavigationList>
                        {navigation.map((item) => (
                          <NavigationItemCard key={item.id}>
                            <div>
                              <NavigationItemTitle>
                                {item.label}
                              </NavigationItemTitle>
                              <NavigationItemPath>
                                {item.path} · Order {item.order}
                              </NavigationItemPath>
                            </div>
                            <NavigationActions>
                              <IconButton
                                onClick={() => handleEditNavigation(item)}
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteNavigation(item.id)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </IconButton>
                            </NavigationActions>
                          </NavigationItemCard>
                        ))}
                      </NavigationList>
                    ) : (
                      <CompactEmptyState>
                        <CompactEmptyIcon>≡</CompactEmptyIcon>
                        No navigation items yet
                      </CompactEmptyState>
                    )}
                  </SectionCard>
                )}
              </motion.div>
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <motion.div
                key="pages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PageHeader>
                  <div>
                    <PageTitle>Pages</PageTitle>
                    <PageSubtitle>Manage site pages</PageSubtitle>
                  </div>
                </PageHeader>

                {/* Pages — ContentEditor wrapped for visual consistency */}
                <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
                  <ContentEditor />
                </SectionCard>
              </motion.div>
            )}

            {/* Blog Posts Tab */}
            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PageHeader>
                  <div>
                    <PageTitle>Blog Posts</PageTitle>
                    <PageSubtitle>Manage blog posts and articles</PageSubtitle>
                  </div>
                  <GhostTealButton
                    onClick={() => handleButtonClick('create-post')}
                  >
                    <Plus size={12} />
                    Create Post
                  </GhostTealButton>
                </PageHeader>

                <SectionCard>
                  <SectionCardHeader>
                    <SectionCardTitle>
                      <Newspaper size={12} />
                      Blog Posts
                    </SectionCardTitle>
                    <GhostTealButton
                      onClick={() => handleButtonClick('create-post')}
                    >
                      <Plus size={12} />
                      Create Post
                    </GhostTealButton>
                  </SectionCardHeader>
                  {posts?.length > 0 ? (
                    <div style={{ display: 'grid', gap: '6px' }}>
                      {posts.map((post) => (
                        <NavigationItemCard key={post.id}>
                          <div>
                            <NavigationItemTitle>
                              {post.title}
                            </NavigationItemTitle>
                            <NavigationItemPath>
                              {post.slug} · {post.status}
                            </NavigationItemPath>
                          </div>
                          <NavigationActions>
                            <IconButton
                              onClick={() => handleButtonClick('edit-post')}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleButtonClick('view-post')}
                              title="View"
                            >
                              <Eye size={14} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleButtonClick('delete-post')}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </NavigationActions>
                        </NavigationItemCard>
                      ))}
                    </div>
                  ) : (
                    <CompactEmptyState>
                      <CompactEmptyIcon>📝</CompactEmptyIcon>
                      No posts yet
                    </CompactEmptyState>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PageHeader>
                  <div>
                    <PageTitle>Media Library</PageTitle>
                    <PageSubtitle>Manage images, videos and files</PageSubtitle>
                  </div>
                  <GhostTealButton
                    onClick={() => handleButtonClick('upload-media')}
                  >
                    <Plus size={12} />
                    Upload Media
                  </GhostTealButton>
                </PageHeader>

                <SectionCard>
                  <SectionCardHeader>
                    <SectionCardTitle>
                      <Image size={12} />
                      Media Library
                    </SectionCardTitle>
                  </SectionCardHeader>
                  <CompactEmptyState>
                    <CompactEmptyIcon>🖼️</CompactEmptyIcon>
                    No media yet · coming soon
                  </CompactEmptyState>
                </SectionCard>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PageHeader>
                  <div>
                    <PageTitle>Analytics</PageTitle>
                    <PageSubtitle>
                      Traffic and performance overview
                    </PageSubtitle>
                  </div>
                </PageHeader>

                <StatsGrid>
                  <StatCard>
                    <StatValue>1,234</StatValue>
                    <StatLabel>Total Visitors</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>89</StatValue>
                    <StatLabel>Page Views</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>45</StatValue>
                    <StatLabel>Active Users</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>3:24</StatValue>
                    <StatLabel>Avg Session</StatLabel>
                  </StatCard>
                </StatsGrid>

                <SectionCard>
                  <SectionCardHeader>
                    <SectionCardTitle>
                      <Clock size={12} />
                      Recent Activity
                    </SectionCardTitle>
                  </SectionCardHeader>
                  <div>
                    {[
                      ['Admin user logged in', '2 minutes ago'],
                      ['Settings updated', '15 minutes ago'],
                      ['New navigation item added', '1 hour ago'],
                    ].map(([text, time]) => (
                      <ActivityItem key={text}>
                        <ActivityDot />
                        {text}
                        <ActivityTime>{time}</ActivityTime>
                      </ActivityItem>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionCardHeader>
                    <SectionCardTitle>
                      <TrendingUp size={12} />
                      Performance Metrics
                    </SectionCardTitle>
                  </SectionCardHeader>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px',
                    }}
                  >
                    {[
                      ['98%', 'Uptime'],
                      ['1.2s', 'Avg Load Time'],
                      ['A+', 'Performance'],
                    ].map(([value, label]) => (
                      <div key={label}>
                        <StatValue>{value}</StatValue>
                        <StatLabelInline>{label}</StatLabelInline>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </TabContent>
      </MainContent>

      {/* ── Mobile bottom tab bar ── */}
      <BottomTabBar>
        <BottomTab
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={16} />
          Dash
        </BottomTab>
        <BottomTab
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          Settings
        </BottomTab>
        <BottomTab
          active={activeTab === 'pages'}
          onClick={() => setActiveTab('pages')}
        >
          <FileText size={16} />
          Pages
        </BottomTab>
        <BottomTab
          active={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
        >
          <Newspaper size={16} />
          Posts
        </BottomTab>
        <BottomTab
          active={activeTab === 'navigation'}
          onClick={() => setActiveTab('navigation')}
        >
          <Navigation size={16} />
          Nav
        </BottomTab>
      </BottomTabBar>
    </AdminContainer>
  );
}
