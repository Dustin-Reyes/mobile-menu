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
  color: ${(p) => p.theme.colors.textMuted};
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
      p.active ? `${p.theme.colors.primary}14` : p.theme.colors.surface};
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
    p.active ? p.theme.colors.primary : p.theme.colors.textSecondary};
`;

const Chevron = styled('span', { shouldForwardProp: (p) => p !== 'open' })`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
  flex-shrink: 0;
  display: inline-block;
  transform: ${(p) => (p.open ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
`;

const SectionRow = styled('button', {
  shouldForwardProp: (p) => p !== 'active',
})`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px 6px 0;
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}14` : 'transparent'};
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: ${(p) =>
      p.active ? `${p.theme.colors.primary}14` : p.theme.colors.surface};
  }
`;

const SectionRowBar = styled('div', {
  shouldForwardProp: (p) => p !== 'active',
})`
  width: 2px;
  height: 16px;
  border-radius: 1px;
  background: ${(p) => (p.active ? p.theme.colors.primary : 'transparent')};
  flex-shrink: 0;
  margin-left: 8px;
`;

const SectionRowName = styled('span', {
  shouldForwardProp: (p) => p !== 'active',
})`
  flex: 1;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : p.theme.colors.textMuted};
  padding-left: 20px;
`;

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 4px;
`;

export function ContentPageList({
  pages,
  selectedPage,
  selectedSection,
  localeMap: _localeMap,
  onSelectPage,
  onSelectSection,
  isMobile: _isMobile,
}) {
  const [expandedPage, setExpandedPage] = React.useState(selectedPage || null);

  // Keep expandedPage in sync when selectedPage changes externally
  React.useEffect(() => {
    if (selectedPage) setExpandedPage(selectedPage);
  }, [selectedPage]);

  const sectionsByPage = React.useMemo(() => {
    const result = {};
    Object.entries(pages).forEach(([id, page]) => {
      const sectionSet = new Set();
      page.fields.forEach((field) => {
        if (field.group) sectionSet.add(field.group);
      });
      result[id] = Array.from(sectionSet);
    });
    return result;
  }, [pages]);

  const handlePageClick = (id) => {
    const hasSections = (sectionsByPage[id] ?? []).length > 0;
    if (hasSections) {
      // Toggle expansion only — content loads when a section is selected
      setExpandedPage((prev) => (prev === id ? null : id));
    } else {
      // No sections: select the page directly so the editor shows all its fields
      onSelectPage(id);
    }
  };

  // Sort pages so 'site' always comes first
  const sortedPages = React.useMemo(() => {
    const entries = Object.entries(pages);
    return entries.sort(([aId], [bId]) => {
      if (aId === 'site') return -1;
      if (bId === 'site') return 1;
      return 0;
    });
  }, [pages]);

  return (
    <ListWrap>
      <SectionLabel>Pages</SectionLabel>
      {sortedPages.map(([id, page]) => {
        const isExpanded = expandedPage === id;
        const sections = sectionsByPage[id] || [];
        return (
          <React.Fragment key={id}>
            <Row active={false} onClick={() => handlePageClick(id)}>
              <ActiveBar active={false} />
              <RowName active={isExpanded}>{page.label}</RowName>
              {sections.length > 0 && <Chevron open={isExpanded}>›</Chevron>}
            </Row>

            {isExpanded && sections.length > 0 && (
              <SectionList>
                {sections.map((section) => {
                  const active =
                    selectedPage === id && selectedSection === section;
                  return (
                    <SectionRow
                      key={section}
                      active={active}
                      onClick={() => {
                        onSelectPage(id);
                        onSelectSection(section);
                      }}
                    >
                      <SectionRowBar active={active} />
                      <SectionRowName active={active}>{section}</SectionRowName>
                    </SectionRow>
                  );
                })}
              </SectionList>
            )}
          </React.Fragment>
        );
      })}
    </ListWrap>
  );
}
