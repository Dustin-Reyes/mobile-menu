import React from 'react';
import styled from '@emotion/styled';

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.2);
  padding: 12px 16px 6px;
`;

const Row = styled('button', { shouldForwardProp: (p) => p !== 'active' })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 0;
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}14` : 'transparent'};
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: ${(p) =>
      p.active ? `${p.theme.colors.primary}14` : 'rgba(255, 255, 255, 0.03)'};
  }
`;

const ActiveBar = styled('div', { shouldForwardProp: (p) => p !== 'active' })`
  width: 2px;
  height: 20px;
  border-radius: 1px;
  background: ${(p) => (p.active ? p.theme.colors.primary : 'transparent')};
  flex-shrink: 0;
  margin-left: 8px;
`;

const RowName = styled('span', { shouldForwardProp: (p) => p !== 'active' })`
  flex: 1;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.6)'};
`;

const Dots = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}4d;
`;

const OverflowPill = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s1};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  padding: 1px 5px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.35);
`;

const Chevron = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

function LocaleDots({ locales = [] }) {
  const visible = locales.slice(0, 3);
  const overflow = locales.length - 3;
  return (
    <Dots>
      {visible.map((locale) => (
        <Dot key={locale} />
      ))}
      {overflow > 0 && <OverflowPill>+{overflow}</OverflowPill>}
    </Dots>
  );
}

export function ContentPageList({
  pages,
  selectedPage,
  localeMap,
  onSelect,
  isMobile,
}) {
  return (
    <ListWrap>
      <SectionLabel>Pages</SectionLabel>
      {Object.entries(pages).map(([id, page]) => {
        const active = selectedPage === id;
        return (
          <Row key={id} active={active} onClick={() => onSelect(id)}>
            <ActiveBar active={active} />
            <RowName active={active}>{page.label}</RowName>
            <LocaleDots locales={localeMap[id] || []} />
            {isMobile && <Chevron>›</Chevron>}
          </Row>
        );
      })}
    </ListWrap>
  );
}
