import styled from '@emotion/styled';
import { Home, Building, Leaf } from 'lucide-react';

const TeamSectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s4};
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.s5}
      ${({ theme }) => theme.spacing.s2};
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.s7};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.s0};
  color: ${({ theme }) => theme.colors.black};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s6};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s5};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.s4};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s2};
    margin-bottom: ${({ theme }) => theme.spacing.s3};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.s4};
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.s5};
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 450px;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.s4};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 100%;
    aspect-ratio: 3 / 4;
    height: auto;
  }
`;

const WorkerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.s3};
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
  justify-content: center;
`;

const ExpertiseCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.s3};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  box-shadow: ${({ theme }) => theme.shadows.s1};
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 2px solid transparent;

  &:hover {
    transform: translateX(8px);
    box-shadow: ${({ theme }) => theme.shadows.s3};
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.white};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s1};
  margin-bottom: ${({ theme }) => theme.spacing.s1};
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.s100};
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  ${ExpertiseCard}:hover & {
    background: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.s5};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  transition: color ${({ theme }) => theme.transitions.fast};

  ${ExpertiseCard}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const expertiseAreas = [
  {
    icon: Home,
    title: 'Residential Expertise',
    description:
      'Specialized in home demolitions, garage removals, and residential site clearing. We handle projects with care and precision to protect surrounding structures.',
  },
  {
    icon: Building,
    title: 'Commercial Projects',
    description:
      'Expert demolition services for commercial buildings, warehouses, and industrial facilities. We manage large-scale projects with efficiency and safety.',
  },
  {
    icon: Leaf,
    title: 'Environmental Responsibility',
    description:
      'Committed to eco-friendly demolition practices. We recycle materials whenever possible and ensure proper disposal of all debris.',
  },
];

function TeamSection() {
  return (
    <TeamSectionContainer>
      <Container>
        <SectionTitle>Our Expertise</SectionTitle>
        <SectionSubtitle>
          Specialized demolition services backed by years of experience
        </SectionSubtitle>
        <ContentGrid>
          <ImageWrapper>
            <ImageContainer>
              <WorkerImage
                src="https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Professional demolition worker"
              />
            </ImageContainer>
          </ImageWrapper>
          <CardsContainer>
            {expertiseAreas.map((area, index) => (
              <ExpertiseCard key={index}>
                <CardHeader>
                  <IconWrapper>
                    <area.icon size={24} color="white" />
                  </IconWrapper>
                  <CardTitle>{area.title}</CardTitle>
                </CardHeader>
                <CardDescription>{area.description}</CardDescription>
              </ExpertiseCard>
            ))}
          </CardsContainer>
        </ContentGrid>
      </Container>
    </TeamSectionContainer>
  );
}

export default TeamSection;
