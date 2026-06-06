import { motion } from 'framer-motion';
import { Image } from 'lucide-react';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from '../shared/SectionCard';
import {
  CompactEmptyState,
  CompactEmptyIcon,
} from '../shared/CompactEmptyState';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function MediaTab() {
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
