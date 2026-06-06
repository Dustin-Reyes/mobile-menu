import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Settings, Image } from 'lucide-react';

const SiteIdentityCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 20px;
  margin-bottom: 12px;
`;

const SiteDetails = styled.div`
  min-width: 0;
  flex: 1;
`;

const SiteNameText = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
  margin-bottom: 4px;
`;

const SiteUrlLink = styled.a`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.primary};
  text-decoration: none;
  opacity: 0.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  transition: opacity ${(p) => p.theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

const SiteUrlPlaceholder = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.25);
  font-style: italic;
`;

const ContentCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ContentCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: ${(p) => p.theme.colors.primary}40;
  }
`;

const ContentCardCount = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.primary};
  line-height: 1;
  margin-bottom: 6px;
`;

const ContentCardIcon = styled.div`
  color: ${(p) => p.theme.colors.primary};
  opacity: 0.7;
  margin-bottom: 6px;
`;

const ContentCardLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const ContentCardHint = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.2);
  margin-top: 4px;
`;

const StatusLine = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.3);
  z-index: ${(p) => p.theme.zIndex.sticky};

  @media (max-width: 768px) {
    bottom: 76px;
  }
`;

const StatusDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? '#4ade80' : '#f87171')};
  flex-shrink: 0;
`;

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function DashboardTab({
  isCMSEnabled,
  stats,
  settings,
  postsEnabled,
  onTabChange,
}) {
  const siteName = settings?.title || 'Your Site';
  const siteUrl = settings?.url || '';

  return (
    <motion.div key="dashboard" {...motionProps}>
      <SiteIdentityCard>
        <SiteDetails>
          <SiteNameText>{siteName}</SiteNameText>
          {siteUrl ? (
            <SiteUrlLink
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteUrl}
            </SiteUrlLink>
          ) : (
            <SiteUrlPlaceholder>
              No URL configured — add it in Settings
            </SiteUrlPlaceholder>
          )}
        </SiteDetails>
      </SiteIdentityCard>

      <ContentCardsGrid>
        <ContentCard onClick={() => onTabChange('pages')}>
          <ContentCardCount>{stats.pages}</ContentCardCount>
          <ContentCardLabel>Pages</ContentCardLabel>
          <ContentCardHint>Manage →</ContentCardHint>
        </ContentCard>

        {postsEnabled && (
          <ContentCard onClick={() => onTabChange('posts')}>
            <ContentCardCount>{stats.posts}</ContentCardCount>
            <ContentCardLabel>Posts</ContentCardLabel>
            <ContentCardHint>Manage →</ContentCardHint>
          </ContentCard>
        )}

        <ContentCard onClick={() => onTabChange('media')}>
          <ContentCardIcon>
            <Image size={22} />
          </ContentCardIcon>
          <ContentCardLabel>Media</ContentCardLabel>
          <ContentCardHint>Browse →</ContentCardHint>
        </ContentCard>

        <ContentCard onClick={() => onTabChange('users')}>
          <ContentCardCount>{stats.users || 0}</ContentCardCount>
          <ContentCardLabel>Users</ContentCardLabel>
          <ContentCardHint>Manage →</ContentCardHint>
        </ContentCard>

        <ContentCard onClick={() => onTabChange('settings')}>
          <ContentCardIcon>
            <Settings size={22} />
          </ContentCardIcon>
          <ContentCardLabel>Settings</ContentCardLabel>
          <ContentCardHint>Edit →</ContentCardHint>
        </ContentCard>
      </ContentCardsGrid>

      <StatusLine>
        <StatusDot $active={isCMSEnabled} />
        {isCMSEnabled ? 'Database connected' : 'No database connection'}
      </StatusLine>
    </motion.div>
  );
}
