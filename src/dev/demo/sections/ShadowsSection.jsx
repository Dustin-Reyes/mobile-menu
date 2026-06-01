import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';

// ─── Data ──────────────────────────────────────────────────────────────────────

const SHADOWS = [
  {
    token: 's0',
    value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  {
    token: 's1',
    value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  {
    token: 's2',
    value:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  {
    token: 's3',
    value:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  {
    token: 's4',
    value:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
];

// ─── Styled components ─────────────────────────────────────────────────────────

const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
`;

const ShadowCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.25rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  box-shadow: ${(p) => p.theme.shadows[p.tokenKey]};
  min-width: 140px;
  flex: 1;
  max-width: 200px;
`;

const TokenLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
`;

const ShadowValue = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
  text-align: center;
  word-break: break-all;
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

// ─── ShadowsSection ───────────────────────────────────────────────────────────

function ShadowsSection() {
  return (
    <ComponentSection
      id="shadows"
      title="Shadows"
      description="Box shadow tokens for elevation and depth."
    >
      <CardRow>
        {SHADOWS.map(({ token, value }) => (
          <ShadowCard key={token} tokenKey={token}>
            <TokenLabel>shadows.{token}</TokenLabel>
            <ShadowValue>{value}</ShadowValue>
          </ShadowCard>
        ))}
      </CardRow>
    </ComponentSection>
  );
}

export default ShadowsSection;
