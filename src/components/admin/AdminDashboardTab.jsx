import { motion } from 'framer-motion';
import { ExternalLink, Settings, Image } from 'lucide-react';
import {
  SiteIdentityCard,
  SiteDetails,
  SiteNameText,
  SiteUrlLink,
  SiteUrlPlaceholder,
  ViewSiteButton,
  ContentCardsGrid,
  ContentCard,
  ContentCardCount,
  ContentCardIcon,
  ContentCardLabel,
  ContentCardHint,
  StatusLine,
  StatusDot,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminDashboardTab({
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
        {siteUrl && (
          <ViewSiteButton
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={12} />
            View Site
          </ViewSiteButton>
        )}
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
