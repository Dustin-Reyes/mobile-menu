import styled from '@emotion/styled';

const DesktopNav = styled.nav`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.s4};
  }
`;

const NavBtn = styled.button`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.s2};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  padding: 0 0 3px;
  border: none;
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  background: none;
  cursor: pointer;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

function HeaderDesktopNav({ navItems, activeId, lang, onNavigate }) {
  return (
    <DesktopNav aria-label="Main navigation">
      {navItems.map((item) => (
        <NavBtn
          key={item.id}
          $active={
            item.sectionId ? activeId === item.sectionId : activeId === 'home'
          }
          onClick={() => onNavigate(item.sectionId)}
        >
          {item.labels[lang] ?? item.labels.en}
        </NavBtn>
      ))}
    </DesktopNav>
  );
}

export default HeaderDesktopNav;
