import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';

// ─── Data ──────────────────────────────────────────────────────────────────────

const RADII = [
  { token: 's0', value: '0.25rem' },
  { token: 's1', value: '0.5rem' },
  { token: 's2', value: '0.75rem' },
  { token: 's3', value: '1rem' },
  { token: 's4', value: '1.5rem' },
  { token: 's100', value: '9999px' },
];

// ─── Styled components ─────────────────────────────────────────────────────────

const RadiusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
`;

const RadiusCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

const RadiusBox = styled.div`
  width: 60px;
  height: 60px;
  background: ${(p) => p.theme.colors.primary};
  border-radius: ${(p) => p.theme.borderRadius[p.tokenKey]};
  opacity: 0.85;
`;

const TokenLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.text};
`;

const ValueLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
`;

// ─── BorderRadiusSection ──────────────────────────────────────────────────────

function BorderRadiusSection() {
  return (
    <ComponentSection
      id="border-radius"
      title="Border Radius"
      description="Border radius tokens for consistent rounding across UI elements."
    >
      <RadiusRow>
        {RADII.map(({ token, value }) => (
          <RadiusCard key={token}>
            <RadiusBox tokenKey={token} />
            <TokenLabel>{token}</TokenLabel>
            <ValueLabel>{value}</ValueLabel>
          </RadiusCard>
        ))}
      </RadiusRow>
    </ComponentSection>
  );
}

export default BorderRadiusSection;
