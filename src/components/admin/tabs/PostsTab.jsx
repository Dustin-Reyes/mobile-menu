import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
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

export default function PostsTab() {
  return (
    <motion.div key="posts" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Blog Posts</PageTitle>
          <PageSubtitle>Manage blog posts and articles</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Newspaper size={12} />
            Blog Posts
          </SectionCardTitle>
        </SectionCardHeader>
        <CompactEmptyState>
          <CompactEmptyIcon>📝</CompactEmptyIcon>
          Blog post management is coming soon
        </CompactEmptyState>
      </SectionCard>
    </motion.div>
  );
}
