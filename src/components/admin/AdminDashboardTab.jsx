import { motion } from 'framer-motion';
import { Settings, FileText, RefreshCw } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  CmsBadge,
  CmsDot,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  GhostTealButton,
  QuickActionsRow,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminDashboardTab({
  isCMSEnabled,
  stats,
  onTabChange,
  onClearCache,
}) {
  return (
    <motion.div key="dashboard" {...motionProps}>
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
          <StatValue>{stats.pages}</StatValue>
          <StatLabel>Pages</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.posts}</StatValue>
          <StatLabel>Posts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.cacheSize}</StatValue>
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
        <QuickActionsRow>
          <GhostTealButton onClick={() => onTabChange('settings')}>
            <Settings size={12} />
            Edit Settings
          </GhostTealButton>
          <GhostTealButton onClick={() => onTabChange('pages')}>
            <FileText size={12} />
            Manage Pages
          </GhostTealButton>
          <GhostTealButton onClick={onClearCache}>
            <RefreshCw size={12} />
            Clear Cache
          </GhostTealButton>
        </QuickActionsRow>
      </SectionCard>
    </motion.div>
  );
}
