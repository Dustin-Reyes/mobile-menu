import styled from '@emotion/styled';

// ─── Variant color config ──────────────────────────────────────────────────────
//
// Each entry provides the three rendering modes (solid, subtle, outline) for a
// given semantic color.  Hex alpha suffixes:
//   18 ≈  9%  (subtle background tint)
//   30 ≈ 19%  (subtle background tint on dark — unused here but reserved)
//
// Contrast decisions:
//   solid  → white text on saturated bg (warning uses dark text for 4.5:1)
//   subtle → color-token text on lightly-tinted surface bg
//   outline → color-token text on transparent bg with 1px color-token border

const variantStyles = (p) => {
  const { colors } = p.theme;
  const sv = p.styleVariant || 'solid';

  const map = {
    default: {
      solid: `
        background: ${colors.surface};
        color: ${colors.textSecondary};
        border-color: ${colors.border};
      `,
      subtle: `
        background: ${colors.border}66;
        color: ${colors.textSecondary};
        border-color: transparent;
      `,
      outline: `
        background: transparent;
        color: ${colors.textSecondary};
        border-color: ${colors.border};
      `,
    },
    primary: {
      solid: `
        background: ${colors.primary};
        color: ${colors.onPrimary};
        border-color: ${colors.primary};
      `,
      subtle: `
        background: ${colors.primary}18;
        color: ${colors.primary};
        border-color: transparent;
      `,
      outline: `
        background: transparent;
        color: ${colors.primary};
        border-color: ${colors.primary};
      `,
    },
    secondary: {
      solid: `
        background: ${colors.secondary};
        color: ${colors.onPrimary};
        border-color: ${colors.secondary};
      `,
      subtle: `
        background: ${colors.secondary}18;
        color: ${colors.secondary};
        border-color: transparent;
      `,
      outline: `
        background: transparent;
        color: ${colors.secondary};
        border-color: ${colors.secondary};
      `,
    },
    success: {
      solid: `
        background: ${colors.success};
        color: ${colors.onPrimary};
        border-color: ${colors.success};
      `,
      subtle: `
        background: ${colors.success}18;
        color: ${colors.success};
        border-color: transparent;
      `,
      outline: `
        background: transparent;
        color: ${colors.success};
        border-color: ${colors.success};
      `,
    },
    warning: {
      solid: `
        background: ${colors.warning};
        color: ${colors.text};
        border-color: ${colors.warning};
      `,
      subtle: `
        background: ${colors.warning}22;
        color: ${colors.warning};
        border-color: transparent;
      `,
      outline: `
        background: transparent;
        color: ${colors.warning};
        border-color: ${colors.warning};
      `,
    },
    error: {
      solid: `
        background: ${colors.error};
        color: ${colors.onPrimary};
        border-color: ${colors.error};
      `,
      subtle: `
        background: ${colors.error}18;
        color: ${colors.error};
        border-color: transparent;
      `,
      outline: `
        background: transparent;
        color: ${colors.error};
        border-color: ${colors.error};
      `,
    },
  };

  const colorKey = p.variant || 'default';
  return (
    (map[colorKey] || map.default)[sv] || (map[colorKey] || map.default).solid
  );
};

// ─── Size config ───────────────────────────────────────────────────────────────

const sizeStyles = (p) => {
  if (p.size === 'sm') {
    return `
      padding: 0.2rem 0.6rem;
      font-size: ${p.theme.typography.fontSizes.s2};
      gap: 0.25rem;
    `;
  }
  if (p.size === 'lg') {
    return `
      padding: 0.4rem 1.1rem;
      font-size: ${p.theme.typography.fontSizes.s4};
      gap: 0.375rem;
    `;
  }
  // default
  return `
    padding: 0.3rem 0.75rem;
    font-size: ${p.theme.typography.fontSizes.s2};
    gap: 0.3rem;
  `;
};

// ─── PillRoot ──────────────────────────────────────────────────────────────────

const PillRoot = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: ${(p) => p.theme.borderRadius.s100};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  border: 1px solid transparent;
  transition:
    background ${(p) => p.theme.transitions.fast},
    color ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast};
  line-height: 1;

  ${sizeStyles}
  ${variantStyles}
`;

// ─── DismissButton ─────────────────────────────────────────────────────────────

const DismissButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  line-height: 1;
  border-radius: ${(p) => p.theme.borderRadius.s100};
  transition: opacity ${(p) => p.theme.transitions.fast};

  /* Size the icon area relative to the pill's own font-size */
  width: 1.1em;
  height: 1.1em;
  font-size: 1em;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
    opacity: 1;
  }
`;

// ─── Pill ──────────────────────────────────────────────────────────────────────

/**
 * Pill — a compact label/tag component.
 *
 * @prop {string}   [variant]       — Color semantic: default | primary | secondary | success | warning | error
 * @prop {string}   [styleVariant]  — Fill mode: solid (default) | subtle | outline
 * @prop {string}   [size]          — sm | (default) | lg
 * @prop {function} [onDismiss]     — When provided, renders a dismiss (×) button at the right edge
 * @prop {string}   [dismissLabel]  — aria-label for the dismiss button (defaults to "Remove")
 */
const Pill = ({
  variant,
  styleVariant,
  size,
  onDismiss,
  dismissLabel = 'Remove',
  children,
  ...rest
}) => {
  return (
    <PillRoot
      variant={variant}
      styleVariant={styleVariant}
      size={size}
      {...rest}
    >
      {children}
      {onDismiss && (
        <DismissButton
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          tabIndex={0}
        >
          {/* Multiplication sign — visually cleaner than × entity at small sizes */}
          &#xD7;
        </DismissButton>
      )}
    </PillRoot>
  );
};

export default Pill;
