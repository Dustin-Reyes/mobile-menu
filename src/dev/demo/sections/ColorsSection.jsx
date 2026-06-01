import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';

// ─── Data ──────────────────────────────────────────────────────────────────────

const SWATCH_GROUPS = [
  {
    label: 'Brand',
    swatches: [
      { name: 'primary', lightHex: '#F5A623' },
      { name: 'secondary', lightHex: '#E8A000' },
      { name: 'tertiary', lightHex: '#666666' },
      { name: 'onPrimary', lightHex: '#111111' },
    ],
  },
  {
    label: 'Functional',
    swatches: [
      { name: 'success', lightHex: '#16A34A' },
      { name: 'warning', lightHex: '#F59E0B' },
      { name: 'error', lightHex: '#EF4444' },
      { name: 'info', lightHex: '#4282E1' },
    ],
  },
  {
    label: 'Surface',
    swatches: [
      { name: 'background', lightHex: '#FFFFFF' },
      { name: 'surface', lightHex: '#F5F5F5' },
      { name: 'border', lightHex: '#E0E0E0' },
      { name: 'text', lightHex: '#111111' },
      { name: 'textSecondary', lightHex: '#555555' },
      { name: 'textMuted', lightHex: '#9CA3AF' },
    ],
  },
];

// ─── Styled components ─────────────────────────────────────────────────────────

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Group = styled.div``;

const GroupLabel = styled.h3`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
`;

const SwatchRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SwatchCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 100px;
`;

const SwatchRect = styled.div`
  width: 100px;
  height: 60px;
  border-radius: ${(p) => p.theme.borderRadius.s2};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors[p.tokenKey]};
`;

const SwatchName = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.text};
`;

const SwatchHex = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
`;

// ─── ColorsSection ─────────────────────────────────────────────────────────────

function ColorsSection() {
  return (
    <ComponentSection
      id="colors"
      title="Colors"
      description="Brand, semantic, and surface color tokens used throughout the UI."
    >
      <GroupList>
        {SWATCH_GROUPS.map((group) => (
          <Group key={group.label}>
            <GroupLabel>{group.label}</GroupLabel>
            <SwatchRow>
              {group.swatches.map((swatch) => (
                <SwatchCard key={swatch.name}>
                  <SwatchRect tokenKey={swatch.name} />
                  <SwatchName>{swatch.name}</SwatchName>
                  <SwatchHex>{swatch.lightHex}</SwatchHex>
                </SwatchCard>
              ))}
            </SwatchRow>
          </Group>
        ))}
      </GroupList>
    </ComponentSection>
  );
}

export default ColorsSection;
