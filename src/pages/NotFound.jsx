/**
 * 404 Not Found page.
 *
 * Displayed for any unmatched route. Shows a large "404" error code, a
 * translated title and message, and a link back to the home page. All
 * elements use Framer Motion entrance animations that respect
 * `prefers-reduced-motion`.
 *
 * @returns {JSX.Element}
 */
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useAnimationConfig from 'hooks/useAnimationConfig';

const Page = styled.main`
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary}25 0%,
    ${(props) => props.theme.colors.secondary}30 25%,
    ${(props) => props.theme.colors.tertiary}25 50%,
    ${(props) => props.theme.colors.primary}20 75%,
    ${(props) => props.theme.colors.background} 100%
  );
  color: ${(props) => props.theme.colors.text};
`;

const Hero = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled(motion.div)`
  text-align: center;
  z-index: 2;
  max-width: 600px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const ErrorCode = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes.s9};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.s7};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.s4};
  color: ${(props) => props.theme.colors.textSecondary};
  line-height: ${(props) => props.theme.typography.lineHeights.relaxed};
  margin-bottom: 2rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  border-radius: ${(props) => props.theme.borderRadius.s3};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  font-size: ${(props) => props.theme.typography.fontSizes.s4};
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: ${(props) => props.theme.shadows.s2};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.s3};
    background: ${(props) => props.theme.colors.primary}dd;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 3px;
  }
`;

const MotionPrimaryLink = motion(PrimaryLink);

function NotFound() {
  const { t } = useTranslation();
  const { staggerContainer, slideUp, slideDown, buttonPress } =
    useAnimationConfig();

  return (
    <Page>
      <Hero>
        <HeroContent
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={slideDown}>
            <ErrorCode>404</ErrorCode>
          </motion.div>
          <motion.div variants={slideUp}>
            <Title>{t('error.notFound.title')}</Title>
          </motion.div>
          <motion.div variants={slideUp}>
            <Description>{t('error.notFound.message')}</Description>
          </motion.div>
          <motion.div variants={slideUp}>
            <Actions>
              <MotionPrimaryLink to="/" {...buttonPress}>
                {t('error.notFound.goHome')}
              </MotionPrimaryLink>
            </Actions>
          </motion.div>
        </HeroContent>
      </Hero>
    </Page>
  );
}

export default NotFound;
