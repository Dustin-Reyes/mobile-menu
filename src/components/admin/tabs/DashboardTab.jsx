/**
 * @module components/admin/tabs/DashboardTab
 * @description Admin overview dashboard tab. Displays the site identity card,
 * a CMS connection status indicator, and quick-access cards for all major admin sections.
 */

import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Settings, Image } from 'lucide-react';
import { keyframes } from '@emotion/react';

const SiteIdentityCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textMuted};
  font-style: italic;
`;

const ContentCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;
`;

const ContentCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.secondaryBackground};
    border-color: ${(p) => p.theme.colors.primary}40;
  }
`;

const ContentCardCount = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.primary};
  line-height: 1;
  margin-bottom: 6px;
  min-width: 30px;
`;

const ContentCardIcon = styled.div`
  color: ${(p) => p.theme.colors.primary};
  opacity: 0.7;
  margin-bottom: 6px;
`;

const ContentCardLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const ContentCardHint = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 4px;
`;

const StatusLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StatusDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active ? p.theme.colors.success : p.theme.colors.error};
  flex-shrink: 0;
`;

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.surface} 25%,
    ${(p) => p.theme.colors.secondaryBackground} 50%,
    ${(p) => p.theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

/**
 * @param {Object} props
 * @param {boolean} props.isCMSEnabled - Whether the CMS database connection is active.
 * @param {Object} props.stats - Aggregate content counts shown on the dashboard cards.
 * @param {number} props.stats.pages - Number of content pages.
 * @param {number} props.stats.posts - Number of blog posts.
 * @param {number} [props.stats.users] - Number of registered users.
 * @param {Object} props.settings - Site settings object.
 * @param {string} [props.settings.title] - Site title.
 * @param {string} [props.settings.url] - Site URL.
 * @param {boolean} props.postsEnabled - Whether the Posts section is enabled.
 * @param {function} props.onTabChange - Callback invoked with a tab ID to navigate to another tab.
 * @param {boolean} [props.loading=false] - When true, stat cards render skeleton placeholders.
 * @returns {JSX.Element}
 */
export default function DashboardTab({
  isCMSEnabled,
  stats,
  settings,
  postsEnabled,
  onTabChange,
  loading = false,
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
        <StatusLine>
          <StatusDot $active={isCMSEnabled} />
          {isCMSEnabled ? 'Database connected' : 'No database connection'}
        </StatusLine>
      </SiteIdentityCard>

      <ContentCardsGrid>
        <ContentCard onClick={() => onTabChange('content')}>
          {loading ? (
            <Skeleton
              style={{ width: '30px', height: '32px', marginBottom: '6px' }}
            />
          ) : (
            <ContentCardCount>{stats.pages}</ContentCardCount>
          )}
          <ContentCardLabel>Content</ContentCardLabel>
          <ContentCardHint>Manage →</ContentCardHint>
        </ContentCard>

        {postsEnabled && (
          <ContentCard onClick={() => onTabChange('posts')}>
            {loading ? (
              <Skeleton
                style={{ width: '30px', height: '32px', marginBottom: '6px' }}
              />
            ) : (
              <ContentCardCount>{stats.posts}</ContentCardCount>
            )}
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
          {loading ? (
            <Skeleton
              style={{ width: '30px', height: '32px', marginBottom: '6px' }}
            />
          ) : (
            <ContentCardCount>{stats.users || 0}</ContentCardCount>
          )}
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
    </motion.div>
  );
}
