import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  CompactEmptyState,
  CompactEmptyIcon,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminAnalyticsTab() {
  return (
    <motion.div key="analytics" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Analytics</PageTitle>
          <PageSubtitle>Traffic and performance overview</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <TrendingUp size={12} />
            Analytics
          </SectionCardTitle>
        </SectionCardHeader>
        <CompactEmptyState>
          <CompactEmptyIcon>📊</CompactEmptyIcon>
          No analytics data yet · connect an analytics source to see traffic and
          performance metrics
        </CompactEmptyState>
      </SectionCard>
    </motion.div>
  );
}
