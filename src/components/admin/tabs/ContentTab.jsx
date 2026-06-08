/**
 * @module components/admin/tabs/ContentTab
 * @description Admin tab for managing site page content. Renders a mobile page
 * picker dropdown and a full PageEditor for the currently selected page.
 */

import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { pageSchema } from '../../../content/schema';
import PageEditor from '../content/PageEditor';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
  style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 },
};

const MobilePagePicker = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    margin-top: 12px;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
    flex-shrink: 0;
  }
`;

const PageSelect = styled.select`
  flex: 1;
  padding: 7px 10px;
  background: ${(p) => p.theme.colors.secondaryBackground};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const pages = Object.entries(pageSchema);

/**
 * @param {Object} props
 * @param {string} props.selectedPage - The ID of the currently selected page.
 * @param {function} props.onPageChange - Callback invoked with the new page ID when the selection changes.
 * @returns {JSX.Element}
 */
export default function PagesTab({ selectedPage, onPageChange }) {
  return (
    <motion.div key="pages" {...motionProps}>
      <MobilePagePicker>
        <PageSelect
          value={selectedPage}
          onChange={(e) => onPageChange(e.target.value)}
        >
          {pages.map(([id, page]) => (
            <option key={id} value={id}>
              {page.label}
            </option>
          ))}
        </PageSelect>
      </MobilePagePicker>
      <PageEditor key={selectedPage} pageId={selectedPage} />
    </motion.div>
  );
}
