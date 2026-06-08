/**
 * @module components/admin/tabs/MediaTab
 * @description Admin tab for the media library. Currently renders a placeholder
 * indicating that media management is coming soon.
 */

import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Image } from 'lucide-react';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from '../shared/SectionCard';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 5px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CompactEmptyIcon = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  margin-bottom: 2px;
`;

/**
 * @returns {JSX.Element}
 */
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
