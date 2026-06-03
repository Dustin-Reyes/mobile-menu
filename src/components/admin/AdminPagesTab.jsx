import { motion } from 'framer-motion';
import { ContentEditor } from './AdminContentEditor';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  FlushSectionCard,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminPagesTab() {
  return (
    <motion.div key="pages" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Pages</PageTitle>
          <PageSubtitle>Manage site pages</PageSubtitle>
        </div>
      </PageHeader>

      <FlushSectionCard>
        <ContentEditor />
      </FlushSectionCard>
    </motion.div>
  );
}
