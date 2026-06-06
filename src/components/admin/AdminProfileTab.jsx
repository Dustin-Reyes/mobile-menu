import { motion } from 'framer-motion';
import { User } from 'lucide-react';
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

export default function AdminProfileTab() {
  return (
    <motion.div key="profile" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Profile</PageTitle>
          <PageSubtitle>Manage your account details</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <User size={12} />
            Account Information
          </SectionCardTitle>
        </SectionCardHeader>
        <CompactEmptyState>
          <CompactEmptyIcon>👤</CompactEmptyIcon>
          Profile settings coming soon
        </CompactEmptyState>
      </SectionCard>
    </motion.div>
  );
}
