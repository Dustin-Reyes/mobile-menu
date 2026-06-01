import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';

// ─── Data ──────────────────────────────────────────────────────────────────────

const FONT_SIZES = [
  { scale: 's0', clamp: 'clamp(0.75rem, 0.7rem + 0.25vw, 1rem)' },
  { scale: 's1', clamp: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' },
  { scale: 's2', clamp: 'clamp(1.5rem, 1.4rem + 0.5vw, 2rem)' },
  { scale: 's3', clamp: 'clamp(2rem, 1.8rem + 1vw, 2.5rem)' },
  { scale: 's4', clamp: 'clamp(2.5rem, 2.3rem + 1vw, 3rem)' },
  { scale: 's5', clamp: 'clamp(3rem, 2.8rem + 1vw, 3.5rem)' },
  { scale: 's6', clamp: 'clamp(3.5rem, 3.2rem + 1.5vw, 4rem)' },
  { scale: 's7', clamp: 'clamp(4rem, 3.7rem + 1.5vw, 4.5rem)' },
  { scale: 's8', clamp: 'clamp(4.5rem, 4.2rem + 1.5vw, 5rem)' },
  { scale: 's9', clamp: 'clamp(5rem, 4.5rem + 2.5vw, 6rem)' },
];

const FONT_WEIGHTS = [
  { label: 'Normal', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semibold', value: 600 },
  { label: 'Bold', value: 700 },
  { label: 'Extrabold', value: 800 },
];

const LINE_HEIGHTS = [
  { label: 'Tight', value: 1.25, tokenKey: 'tight' },
  { label: 'Normal', value: 1.5, tokenKey: 'normal' },
  { label: 'Relaxed', value: 1.75, tokenKey: 'relaxed' },
];

const FONT_FAMILIES = [
  {
    label: 'Sans — Inter',
    family:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sample: 'The quick brown fox jumps over the lazy dog',
  },
  {
    label: 'Mono — JetBrains Mono',
    family:
      '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    sample: 'const answer = 42; // The quick brown fox',
  },
];

// ─── Shared styled components ─────────────────────────────────────────────────

const SubsectionTitle = styled.h3`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const Block = styled.div`
  margin-bottom: 3rem;
`;

// ─── Font size ramp ───────────────────────────────────────────────────────────

const SizeRamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SizeRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const ScaleLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.textMuted};
  min-width: 2rem;
  flex-shrink: 0;
`;

const SizeSample = styled.span`
  font-size: ${(p) => p.clampValue};
  color: ${(p) => p.theme.colors.text};
  line-height: ${(p) => p.theme.typography.lineHeights.tight};
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ClampValue = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`;

// ─── Font weights ─────────────────────────────────────────────────────────────

const WeightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const WeightRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
`;

const WeightLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
  min-width: 10rem;
  flex-shrink: 0;
`;

const WeightSample = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.weightValue};
  color: ${(p) => p.theme.colors.text};
`;

// ─── Line heights ─────────────────────────────────────────────────────────────

const LineHeightGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const LineHeightCard = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
`;

const LineHeightLabel = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

const LineHeightSample = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  line-height: ${(p) => p.lineHeightValue};
  color: ${(p) => p.theme.colors.text};
`;

// ─── Font families ────────────────────────────────────────────────────────────

const FamilyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FamilyCard = styled.div`
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
`;

const FamilyLabel = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

const FamilySample = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-family: ${(p) => p.familyValue};
  color: ${(p) => p.theme.colors.text};
`;

// ─── TypographySection ────────────────────────────────────────────────────────

function TypographySection() {
  return (
    <ComponentSection
      id="typography"
      title="Typography"
      description="Fluid font scale, weights, line heights, and font families."
    >
      {/* Font size ramp */}
      <Block>
        <SubsectionTitle>Font Size Scale</SubsectionTitle>
        <SizeRamp>
          {FONT_SIZES.map(({ scale, clamp }) => (
            <SizeRow key={scale}>
              <ScaleLabel>{scale}</ScaleLabel>
              <SizeSample clampValue={clamp}>The quick brown fox</SizeSample>
              <ClampValue>{clamp}</ClampValue>
            </SizeRow>
          ))}
        </SizeRamp>
      </Block>

      {/* Font weights */}
      <Block>
        <SubsectionTitle>Font Weights</SubsectionTitle>
        <WeightList>
          {FONT_WEIGHTS.map(({ label, value }) => (
            <WeightRow key={value}>
              <WeightLabel>
                {label} ({value})
              </WeightLabel>
              <WeightSample weightValue={value}>
                The quick brown fox jumps over the lazy dog
              </WeightSample>
            </WeightRow>
          ))}
        </WeightList>
      </Block>

      {/* Line heights */}
      <Block>
        <SubsectionTitle>Line Heights</SubsectionTitle>
        <LineHeightGrid>
          {LINE_HEIGHTS.map(({ label, value, tokenKey }) => (
            <LineHeightCard key={tokenKey}>
              <LineHeightLabel>
                {label} — {value}
              </LineHeightLabel>
              <LineHeightSample lineHeightValue={value}>
                The quick brown fox jumps over the lazy dog. Pack my box with
                five dozen liquor jugs.
              </LineHeightSample>
            </LineHeightCard>
          ))}
        </LineHeightGrid>
      </Block>

      {/* Font families */}
      <Block>
        <SubsectionTitle>Font Families</SubsectionTitle>
        <FamilyList>
          {FONT_FAMILIES.map(({ label, family, sample }) => (
            <FamilyCard key={label}>
              <FamilyLabel>{label}</FamilyLabel>
              <FamilySample familyValue={family}>{sample}</FamilySample>
            </FamilyCard>
          ))}
        </FamilyList>
      </Block>
    </ComponentSection>
  );
}

export default TypographySection;
