import { motion } from 'framer-motion';
import AdminPageEditor from './AdminPageEditor';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
  style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 },
};

export default function AdminPagesTab({ selectedPage }) {
  return (
    <motion.div key="pages" {...motionProps}>
      <AdminPageEditor key={selectedPage} pageId={selectedPage} />
    </motion.div>
  );
}
