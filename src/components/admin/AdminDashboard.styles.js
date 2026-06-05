import styled from '@emotion/styled';
import * as RadixSeparator from '@radix-ui/react-separator';

// ─── Layout ──────────────────────────────────────────────────────────────────

export const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  display: flex;
  margin-top: 10rem;

  @media (max-width: 768px) {
    padding-bottom: 56px;
  }
`;

export const Sidebar = styled.div`
  position: fixed;
  top: 10rem;
  left: 0;
  width: 200px;
  height: calc(100vh - 10rem);
  background: ${(p) => p.theme.colors.background};
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  color: ${(p) => (p.active ? p.theme.colors.primary : p.theme.colors.text)};
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}1a` : 'transparent'};

  &:hover {
    background: ${(p) =>
      p.active ? `${p.theme.colors.primary}1a` : 'rgba(255,255,255,0.04)'};
    color: ${(p) =>
      p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.7)'};
  }
`;

export const SidebarDivider = styled(RadixSeparator.Root)`
  margin: 12px 0;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.06);
`;

export const SidebarSpacer = styled.div`
  flex: 1;
`;

export const MainContent = styled.div`
  flex: 1;
  margin-left: 200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// ─── Page header ─────────────────────────────────────────────────────────────

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const PageTitle = styled.h1`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 3px;
`;

export const PageSubtitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
`;

export const CmsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${(p) =>
    p.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${(p) => (p.active ? '#4ade80' : '#f87171')};
  border: 1px solid
    ${(p) => (p.active ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)')};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  padding: 3px 8px;
  border-radius: 9999px;
`;

export const CmsDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;

export const ActivityDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}80;
  flex-shrink: 0;
`;

// ─── Shared card primitives ───────────────────────────────────────────────────

export const SectionCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 16px;
  margin-bottom: 12px;
`;

export const FlushSectionCard = styled(SectionCard)`
  padding: 0;
  overflow: hidden;
`;

export const SectionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: rgba(255, 255, 255, 0.7);
`;

export const GhostTealButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  padding: 4px 10px;
  background: ${(p) => p.theme.colors.primary}1a;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}40;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background: ${(p) => p.theme.colors.primary}2a;
  }
`;

export const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 5px;
  color: rgba(255, 255, 255, 0.25);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

export const CompactEmptyIcon = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  margin-bottom: 2px;
`;

// ─── Stat cards ───────────────────────────────────────────────────────────────

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 14px 16px;
`;

export const StatValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.primary};
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 5px;
`;

export const StatLabelInline = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
`;

// ─── Navigation tab cards ─────────────────────────────────────────────────────

export const NavigationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const NavigationItemCard = styled.div`
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavigationActions = styled.div`
  display: flex;
  gap: 4px;
`;

export const NavigationItemTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
`;

export const NavigationItemPath = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
  margin-top: 2px;
`;

export const IconButton = styled.button`
  padding: 5px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primary}1a;
  }
`;

// ─── Form primitives ──────────────────────────────────────────────────────────

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const FormLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  display: block;
`;

export const StyledTextarea = styled.textarea`
  padding: ${(p) => p.theme.spacing.s2} ${(p) => p.theme.spacing.s3};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}1a;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
`;

// ─── Settings view ────────────────────────────────────────────────────────────

export const SettingsViewGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const SettingsLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 2px;
`;

export const SettingsValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) =>
    p.hasValue ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)'};
`;

// ─── Dashboard tab ────────────────────────────────────────────────────────────

export const QuickActionsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

// ─── Analytics tab ────────────────────────────────────────────────────────────

export const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.5);
`;

export const ActivityTime = styled.span`
  margin-left: auto;
  color: rgba(255, 255, 255, 0.25);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

// ─── Posts tab ────────────────────────────────────────────────────────────────

export const PostsList = styled.div`
  display: grid;
  gap: 6px;
`;

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ─── Mobile bottom tab bar ────────────────────────────────────────────────────

export const BottomTabBar = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: ${(p) => p.theme.colors.background};
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    z-index: ${(p) => p.theme.zIndex.sticky};
  }
`;

export const BottomTab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.3)'};
  transition: color ${(p) => p.theme.transitions.fast};
`;
