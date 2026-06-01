import styled from '@emotion/styled';
import Footer from 'components/Footer';

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  text-align: center;
  opacity: 0.7;
  margin-top: 1rem;
`;

function Home() {
  return (
    <HomeWrapper>
      <Title>Your App Name</Title>
      <Subtitle>Run yarn setup to configure this project.</Subtitle>
      <Footer />
    </HomeWrapper>
  );
}

export default Home;
