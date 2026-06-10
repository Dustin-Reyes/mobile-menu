/**
 * @module components/sections/Gallery
 * @description Renders a responsive 3-column grid of gallery images sourced from the CMS
 * media library. When no images are assigned, shows placeholder boxes equal to the configured
 * max (MEDIA_CONFIG.gallery.maxImages). Items are `{ id, url, name }` objects.
 */

import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import { MEDIA_CONFIG } from 'config/media';
import placeholderSrc from 'assets/placeholder-image.svg';

// ─── Layout ───────────────────────────────────────────────────────────────────

const Wrapper = styled.section`
  min-height: min(100vh, 1080px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : theme.colors.background};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.s6};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GalleryItem = styled.div`
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.s3};
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Gallery section component. Displays a responsive image grid populated from CMS
 * gallery.images (array of `{ id, url, name }`). When no images are assigned, renders
 * MEDIA_CONFIG.gallery.maxImages placeholder boxes instead.
 *
 * @returns {JSX.Element|null}
 */
export default function Gallery() {
  const { content, loading } = usePage('home');

  const title = content?.gallery?.title ?? (loading ? null : 'Our Work');
  const subtitle =
    content?.gallery?.subtitle ??
    (loading ? null : 'A showcase of our latest projects');
  const images = content?.gallery?.images ?? (loading ? null : []);

  if (images === null) return null;

  const hasImages = images.length > 0;

  return (
    <Wrapper id="gallery">
      <SectionHeader>
        {loading ? (
          <div style={{ height: '40px', marginBottom: '1rem' }} />
        ) : (
          <SectionTitle>{title}</SectionTitle>
        )}
        {loading ? (
          <div
            style={{ height: '24px', maxWidth: '400px', margin: '0 auto' }}
          />
        ) : (
          <SectionSubtitle>{subtitle}</SectionSubtitle>
        )}
      </SectionHeader>

      <GalleryGrid>
        {hasImages
          ? images.map((img) => (
              <GalleryItem key={img.id}>
                <GalleryImage
                  src={img.url}
                  alt={img.name ?? ''}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = placeholderSrc;
                  }}
                />
              </GalleryItem>
            ))
          : Array.from({ length: MEDIA_CONFIG.gallery.maxImages }).map(
              (_, i) => (
                <GalleryItem key={i}>
                  <GalleryImage src={placeholderSrc} alt="" />
                </GalleryItem>
              ),
            )}
      </GalleryGrid>
    </Wrapper>
  );
}
