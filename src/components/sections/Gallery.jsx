import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';

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
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
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

const GalleryImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  text-align: center;
  padding: 1rem;
`;

const GalleryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

const GalleryTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: white;
  margin-bottom: 0.25rem;
`;

const GalleryDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.9);
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Gallery() {
  const { content, loading } = usePage('home');

  const title = content?.gallery?.title ?? (loading ? null : 'Our Work');
  const subtitle =
    content?.gallery?.subtitle ??
    (loading ? null : 'A showcase of our latest projects');
  const galleryItems =
    content?.gallery?.items ??
    (loading
      ? null
      : [
          {
            title: 'Project Alpha',
            description: 'Brand identity and web design',
          },
          {
            title: 'Project Beta',
            description: 'E-commerce platform',
          },
          {
            title: 'Project Gamma',
            description: 'Mobile application',
          },
          {
            title: 'Project Delta',
            description: 'Marketing campaign',
          },
          {
            title: 'Project Epsilon',
            description: 'Corporate rebrand',
          },
          {
            title: 'Project Zeta',
            description: 'Product photography',
          },
        ]);

  if (!galleryItems) return null;

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
        {galleryItems.map((item, index) => (
          <GalleryItem key={index}>
            <GalleryImage>{item.title}</GalleryImage>
            <GalleryOverlay>
              <GalleryTitle>{item.title}</GalleryTitle>
              <GalleryDescription>{item.description}</GalleryDescription>
            </GalleryOverlay>
          </GalleryItem>
        ))}
      </GalleryGrid>
    </Wrapper>
  );
}
