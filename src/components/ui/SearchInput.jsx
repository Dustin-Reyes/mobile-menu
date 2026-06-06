import React, { useRef, useId } from 'react';
import styled from '@emotion/styled';
import { Search, X } from 'lucide-react';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const LeadingIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${(p) =>
    p.$focused ? p.theme.colors.primary : 'rgba(255,255,255,0.25)'};
  transition: color ${(p) => p.theme.transitions.fast};
`;

const StyledInput = styled.input`
  width: 100%;
  height: ${(p) => (p.$size === 'sm' ? '34px' : '40px')};
  padding: 0 ${(p) => (p.$hasClear ? '36px' : '12px')} 0 38px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) =>
    p.$size === 'sm'
      ? p.theme.typography.fontSizes.s2
      : p.theme.typography.fontSizes.s3};
  font-family: inherit;
  outline: none;
  transition:
    border-color ${(p) => p.theme.transitions.fast},
    background ${(p) => p.theme.transitions.fast},
    box-shadow ${(p) => p.theme.transitions.fast};

  &::placeholder {
    color: rgba(255, 255, 255, 0.22);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.05);
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.primary}60;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}14;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition:
    background ${(p) => p.theme.transitions.fast},
    color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.8);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }
`;

/**
 * Admin-styled search input with icon prefix and animated clear button.
 * Accepts all standard input props plus:
 *   - size: 'sm' | 'md' (default 'md')
 *   - onClear: callback when the clear button is clicked
 */
const SearchInput = React.forwardRef(
  (
    {
      size = 'md',
      value,
      onChange,
      onClear,
      placeholder = 'Search…',
      id: externalId,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef(null);
    const ref = forwardedRef ?? internalRef;
    const [focused, setFocused] = React.useState(false);
    const generatedId = useId();
    const inputId = externalId ?? generatedId;

    const handleClear = () => {
      onClear?.();
      ref.current?.focus();
    };

    const hasClear = Boolean(value);

    return (
      <Wrapper>
        <LeadingIcon $focused={focused} aria-hidden="true">
          <Search size={14} strokeWidth={2.2} />
        </LeadingIcon>

        <StyledInput
          ref={ref}
          id={inputId}
          role="searchbox"
          type="search"
          $size={size}
          $hasClear={hasClear}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          spellCheck={false}
          {...props}
        />

        {hasClear && (
          <ClearButton
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <X size={10} strokeWidth={2.5} />
          </ClearButton>
        )}
      </Wrapper>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
