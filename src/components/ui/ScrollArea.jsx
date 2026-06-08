/**
 * Scrollable area components built on Radix UI ScrollArea with themed scrollbar styling.
 * @module components/ui/ScrollArea
 */
import styled from '@emotion/styled';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

/** Outer scroll container; clips overflow and applies a themed border. */
export const ScrollAreaRoot = styled(RadixScrollArea.Root)`
  overflow: hidden;
  border-radius: ${(p) => p.theme.borderRadius.s2};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

/** Inner viewport that renders the scrollable content. */
export const ScrollAreaViewport = styled(RadixScrollArea.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`;

/** Themed scrollbar track supporting vertical and horizontal orientations. */
export const ScrollAreaScrollbar = styled(RadixScrollArea.Scrollbar)`
  display: flex;
  user-select: none;
  touch-action: none;
  padding: 2px;
  background: ${(p) => p.theme.colors.border};
  transition: background 160ms ease;

  &[data-orientation='vertical'] {
    width: 10px;
  }

  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: 10px;
  }

  &:hover {
    background: ${(p) => p.theme.colors.border};
  }
`;

/** Draggable scrollbar thumb with an expanded touch hit-target. */
export const ScrollAreaThumb = styled(RadixScrollArea.Thumb)`
  flex: 1;
  background: ${(p) => p.theme.colors.textSecondary};
  border-radius: 5px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`;

/** Corner piece filling the intersection gap when both scrollbars are visible. */
export const ScrollAreaCorner = styled(RadixScrollArea.Corner)`
  background: ${(p) => p.theme.colors.border};
`;
