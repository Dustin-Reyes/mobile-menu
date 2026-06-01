import styled from '@emotion/styled';
import * as RadixSeparator from '@radix-ui/react-separator';

const Separator = styled(RadixSeparator.Root)`
  background: ${(p) => p.theme.colors.border};

  &[data-orientation='horizontal'] {
    height: 1px;
    width: 100%;
    margin: 1rem 0;
  }

  &[data-orientation='vertical'] {
    width: 1px;
    height: 100%;
    margin: 0 1rem;
  }
`;

export default Separator;
