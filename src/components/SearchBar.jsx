/**
 * @module components/SearchBar
 * @description Full-width search bar with filter icon for mobile menu.
 */
import styled from '@emotion/styled';
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchWrapper = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.s4};
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s3};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: ${({ theme }) => theme.spacing.s3};
  padding-left: ${({ theme }) => theme.spacing.s10};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

/**
 * SearchBar component
 * @param {Object} props
 * @param {string} props.value - Search input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onFilterClick - Filter button click handler
 * @param {string} props.placeholder - Placeholder text
 * @returns {JSX.Element}
 */
export default function SearchBar({
  value = '',
  onChange,
  onFilterClick,
  placeholder = 'Search for your favourite food',
}) {
  return (
    <SearchWrapper>
      <SearchContainer>
        <SearchInputWrapper>
          <SearchIcon size={20} />
          <Input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label="Search menu"
          />
        </SearchInputWrapper>
        <FilterButton
          onClick={onFilterClick}
          aria-label="Filter options"
          title="Filter"
        >
          <SlidersHorizontal size={20} />
        </FilterButton>
      </SearchContainer>
    </SearchWrapper>
  );
}
