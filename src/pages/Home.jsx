import styled from '@emotion/styled';
import HeroSection from 'components/Hero';
import Services from 'components/Services';
// import AboutSection from 'components/AboutSection';
// import TeamSection from 'components/TeamSection';
// import ProcessSection from 'components/ProcessSection';
// import ServiceAreaSection from 'components/ServiceAreaSection';
import WhySection from 'components/WhySection';
// import FAQSection from 'components/FAQSection';
// import ContactFormSection from 'components/ContactFormSection';
import Footer from 'components/Footer';

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function Home() {
  return (
    <HomeWrapper>
      <HeroSection />
      <Services />
      {/* <AboutSection /> */}
      {/* <TeamSection /> */}
      {/* <ProcessSection /> */}
      {/* <ServiceAreaSection /> */}
      <WhySection />
      {/* <FAQSection /> */}
      {/* <ContactFormSection /> */}
      <Footer />
    </HomeWrapper>
  );
}

export default Home;
