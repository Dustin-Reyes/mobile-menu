import { motion } from 'framer-motion';
import PageEditor from '../content/PageEditor';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
  style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 },
};

export default function PagesTab({ selectedPage }) {
  return (
    <motion.div key="pages" {...motionProps}>
      <PageEditor key={selectedPage} pageId={selectedPage} />
    </motion.div>
  );
}
