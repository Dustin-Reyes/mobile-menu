import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from 'components/Button';

const ServiceAreaContainer = styled.section`
  position: relative;
  min-height: 600px;
  display: flex;
  background: url('https://images.unsplash.com/photo-1603655534191-ea4d80072bf6?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
    center/cover no-repeat fixed;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    min-height: auto;
  }
`;

const MapContainer = styled.div`
  position: relative;
  flex: 1;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.s4};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 400px;
  }
`;

const MapImage = styled.img`
  width: 100%;
  max-width: 650px;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  box-shadow: ${({ theme }) => theme.shadows.s4};
`;

const ContentContainer = styled.div`
  position: relative;
  flex: 1;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s4};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.s5}
      ${({ theme }) => theme.spacing.s4};
  }
`;

const Motto = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.s7};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.s4};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s7};
  }
`;

const CitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.s2};
  margin: ${({ theme }) => theme.spacing.s5} 0;
  max-width: 700px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CityName = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.spacing.s2};
  background: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.s2};
  }
`;

const CTAButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.s3} ${({ theme }) => theme.spacing.s5};
  font-size: ${({ theme }) => theme.fontSizes.s5};
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  box-shadow: ${({ theme }) => theme.shadows.s3};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.s4};
    opacity: 1;
  }
`;

const cities = [
  'Bend',
  'Redmond',
  'Sisters',
  'La Pine',
  'Sun River',
  'Prineville',
  'Madras',
  'Salem',
];

function ServiceAreaSection() {
  return (
    <ServiceAreaContainer id="locations">
      <MapContainer>
        <MapImage
          src="/Titan locations.png"
          alt="Titan Demo Service Area Map"
        />
      </MapContainer>
      <ContentContainer>
        <Motto>
          Oregon&apos;s premier choice for luxury demolition services.
        </Motto>
        <CitiesGrid>
          {cities.map((city, index) => (
            <CityName key={index}>{city}</CityName>
          ))}
        </CitiesGrid>
        <CTAButton as={Link} to="/contact">
          Get a Free Consultation Today
        </CTAButton>
      </ContentContainer>
    </ServiceAreaContainer>
  );
}

export default ServiceAreaSection;
