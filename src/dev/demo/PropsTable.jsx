import styled from '@emotion/styled';

// ─── Styled components ─────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1.5rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
`;

const SubheadingLabel = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
`;

const Thead = styled.thead`
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const Th = styled.th`
  padding: 0.625rem 1rem;
  text-align: left;
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(p) => p.theme.colors.surface};
  }
`;

const Td = styled.td`
  padding: 0.625rem 1rem;
  vertical-align: top;
  color: ${(p) => p.theme.colors.text};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

const PropName = styled.code`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  font-size: 0.875em;
  color: ${(p) => p.theme.colors.primary};
  background: ${(p) => p.theme.colors.surface};
  padding: 0.125rem 0.375rem;
  border-radius: ${(p) => p.theme.borderRadius.s0};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

const TypeBadge = styled.code`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  font-size: 0.875em;
  color: ${(p) => p.theme.colors.secondary};
  background: ${(p) => p.theme.colors.surface};
  padding: 0.125rem 0.375rem;
  border-radius: ${(p) => p.theme.borderRadius.s0};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

const DefaultBadge = styled.code`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  font-size: 0.875em;
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.surface};
  padding: 0.125rem 0.375rem;
  border-radius: ${(p) => p.theme.borderRadius.s0};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

// ─── PropsTable ────────────────────────────────────────────────────────────────

/**
 * Reusable props documentation table.
 *
 * @prop {Array}  rows   - [{ prop, type, default, description }]
 * @prop {string} label  - Optional heading label (defaults to "Props")
 */
function PropsTable({ rows, label = 'Props' }) {
  if (!rows?.length) return null;

  return (
    <div>
      <SubheadingLabel>{label}</SubheadingLabel>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>Prop</Th>
              <Th>Type</Th>
              <Th>Default</Th>
              <Th>Description</Th>
            </tr>
          </Thead>
          <tbody>
            {rows.map((row) => (
              <Tr key={row.prop}>
                <Td>
                  <PropName>{row.prop}</PropName>
                </Td>
                <Td>
                  <TypeBadge>{row.type}</TypeBadge>
                </Td>
                <Td>
                  {row.default != null ? (
                    <DefaultBadge>{String(row.default)}</DefaultBadge>
                  ) : (
                    <span style={{ color: 'inherit', opacity: 0.4 }}>—</span>
                  )}
                </Td>
                <Td>{row.description}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </div>
  );
}

export default PropsTable;
