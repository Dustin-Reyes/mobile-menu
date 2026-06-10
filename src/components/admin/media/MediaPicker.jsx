import styled from '@emotion/styled';
import * as RadixDialog from '@radix-ui/react-dialog';
import { DialogRoot, DialogPortal, DialogOverlay } from 'components/ui/Dialog';
import { useMediaLibrary } from 'hooks/useMedia';
import { LoadingSpinner } from 'components/admin/shared/LoadingSpinner';

const Content = styled(RadixDialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s3};
  padding: 20px;
  width: 90%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: ${(p) => p.theme.zIndex.modal};
  outline: none;

  @media (max-width: 768px) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    transform: none;
    border-radius: 20px 20px 0 0;
    max-height: 70vh;
  }
`;

const Title = styled(RadixDialog.Title)`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageCard = styled.button`
  aspect-ratio: 4 / 3;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(p) => p.theme.colors.border};
  padding: 0;
  background: ${(p) => p.theme.colors.background};
  transition:
    border-color 0.15s,
    transform 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const EmptyState = styled.p`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-align: center;
  padding: 2rem 0;
  margin: 0;
`;

/**
 * Modal for selecting a ready image from the media library.
 * @param {Object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {function} props.onSelect - Called with the full media item object
 */
export default function MediaPicker({ open, onClose, onSelect }) {
  const { items, loading } = useMediaLibrary();
  const readyItems = items.filter((item) => item.status === 'ready');

  return (
    <DialogRoot open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <Content>
          <Title>Select Image</Title>
          {loading ? (
            <LoadingSpinner />
          ) : readyItems.length === 0 ? (
            <EmptyState>
              No images yet — upload some in the Media tab first.
            </EmptyState>
          ) : (
            <Grid data-testid="media-picker-grid">
              {readyItems.map((item) => (
                <ImageCard
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  title={item.originalName}
                >
                  <img
                    src={item.urls?.gallery ?? item.imageUrl}
                    alt={item.originalName}
                    loading="lazy"
                  />
                </ImageCard>
              ))}
            </Grid>
          )}
        </Content>
      </DialogPortal>
    </DialogRoot>
  );
}
