import { motion } from 'framer-motion';
import { Image } from 'lucide-react';
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

export default function AdminMediaTab() {
  return (
    <motion.div key="media" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Media Library</PageTitle>
          <PageSubtitle>Manage images, videos and files</PageSubtitle>
        </div>
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
          Media management is coming soon
        </CompactEmptyState>
      </SectionCard>
    </motion.div>
  );
}
