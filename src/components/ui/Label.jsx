/**
 * Accessible form label built on Radix UI Label with themed typography.
 * @module components/ui/Label
 */
import styled from '@emotion/styled';
import * as RadixLabel from '@radix-ui/react-label';

/**
 * Styled form label. Associates with a form control via the `htmlFor` prop.
 * @type {import('@emotion/styled').StyledComponent}
 */
const Label = styled(RadixLabel.Root)`
  display: block;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  cursor: default;
  user-select: none;
`;

export default Label;
