import styled from '@emotion/styled';
import ErrorTrigger from 'components/ErrorTrigger';
import { useTheme } from 'components/ThemeProvider';
import Pill from 'components/Pill';
import ComponentSection from '../ComponentSection';

// ─── Breakpoints data ─────────────────────────────────────────────────────────

const BREAKPOINTS = [
  { name: 'mobile', value: '640px' },
  { name: 'tablet', value: '768px' },
  { name: 'desktop', value: '1024px' },
  { name: 'wide', value: '1280px' },
];

// ─── Font size scale preview data ─────────────────────────────────────────────

const FONT_SIZE_SCALE = [
  { scale: 's0', clamp: 'clamp(0.75rem, 0.7rem + 0.25vw, 1rem)' },
  { scale: 's1', clamp: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' },
  { scale: 's2', clamp: 'clamp(1.5rem, 1.4rem + 0.5vw, 2rem)' },
  { scale: 's3', clamp: 'clamp(2rem, 1.8rem + 1vw, 2.5rem)' },
];

// ─── Styled components ─────────────────────────────────────────────────────────

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
`;

const CardHeading = styled.h3`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
  margin-bottom: 1.25rem;
`;

const ThemeInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ThemeInfoLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  min-width: 6rem;
`;

const ThemeInfoValue = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.text};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  margin: 1rem 0;
`;

const SubLabel = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
`;

const BreakpointList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const BreakpointItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textSecondary};
`;

const BreakpointName = styled.span`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.primary};
`;

const BreakpointValue = styled.span`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
`;

const FontScaleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FontScaleItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const FontScaleKey = styled.span`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.textMuted};
  min-width: 2rem;
  flex-shrink: 0;
`;

const FontScaleSample = styled.span`
  font-size: ${(p) => p.clampValue};
  color: ${(p) => p.theme.colors.text};
  line-height: ${(p) => p.theme.typography.lineHeights.tight};
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const FontScaleClamp = styled.span`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`;

// ─── DeveloperUtilitiesSection ─────────────────────────────────────────────────

function DeveloperUtilitiesSection() {
  const { mode, theme } = useTheme();

  const colorCount = theme ? Object.keys(theme.colors).length : 0;

  return (
    <ComponentSection
      id="dev-utilities"
      title="Developer Utilities"
      description="Tools for testing error handling and inspecting the current theme configuration."
    >
      <CardGrid>
        {/* Error Boundary Tester */}
        <Card>
          <CardHeading>Error Boundary Tester</CardHeading>
          <CardDescription>
            Click to throw a JavaScript error and test ErrorBoundary recovery.
          </CardDescription>
          <ErrorTrigger />
        </Card>

        {/* Current Theme */}
        <Card>
          <CardHeading>Current Theme</CardHeading>

          <ThemeInfoRow>
            <ThemeInfoLabel>Mode</ThemeInfoLabel>
            <Pill variant={mode === 'dark' ? 'primary' : 'secondary'}>
              {mode}
            </Pill>
          </ThemeInfoRow>

          <ThemeInfoRow>
            <ThemeInfoLabel>Color tokens</ThemeInfoLabel>
            <ThemeInfoValue>{colorCount} colors</ThemeInfoValue>
          </ThemeInfoRow>

          <Divider />

          <SubLabel>Breakpoints</SubLabel>
          <BreakpointList>
            {BREAKPOINTS.map(({ name, value }) => (
              <BreakpointItem key={name}>
                <BreakpointName>{name}</BreakpointName>
                <BreakpointValue>{value}</BreakpointValue>
              </BreakpointItem>
            ))}
          </BreakpointList>

          <Divider />

          <SubLabel>Font Size Scale (s0 – s3)</SubLabel>
          <FontScaleList>
            {FONT_SIZE_SCALE.map(({ scale, clamp }) => (
              <FontScaleItem key={scale}>
                <FontScaleKey>{scale}</FontScaleKey>
                <FontScaleSample clampValue={clamp}>Sample</FontScaleSample>
                <FontScaleClamp>{clamp}</FontScaleClamp>
              </FontScaleItem>
            ))}
          </FontScaleList>
        </Card>
      </CardGrid>
    </ComponentSection>
  );
}

export default DeveloperUtilitiesSection;
