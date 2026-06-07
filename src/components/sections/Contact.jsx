import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import ContactForm from './ContactForm';

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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
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

const ContactLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

// ─── Left Panel (Contact Info) ─────────────────────────────────────────────────

const InfoPanel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  padding: 3rem;
`;

const PanelIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => `${theme.colors.primary}22`};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const PanelHeader = styled.div`
  margin-bottom: 2rem;
`;

const PanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.s5};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const PanelSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const ContactItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(4px);
    background: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const ContactItemStatic = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => `${theme.colors.primary}22`};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ContactText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContactLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const ContactValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

// ─── Right Panel (Form) ───────────────────────────────────────────────────────

const FormPanel = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  padding: 3rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Contact() {
  const { t } = useTranslation();
  const { content: homeContent, loading: homeLoading } = usePage('home');
  const { content: siteContent } = usePage('site');

  const title =
    homeContent?.contact?.title ?? (homeLoading ? null : 'Contact Us');
  const subtitle =
    homeContent?.contact?.subtitle ??
    (homeLoading ? null : 'Get in touch with our team');

  const footer = siteContent?.footer ?? {};

  return (
    <Wrapper id="contact">
      <Container>
        <SectionHeader>
          {homeLoading ? (
            <div style={{ height: '40px', marginBottom: '1rem' }} />
          ) : (
            <SectionTitle>{title}</SectionTitle>
          )}
          {homeLoading ? (
            <div
              style={{ height: '24px', maxWidth: '400px', margin: '0 auto' }}
            />
          ) : (
            <SectionSubtitle>{subtitle}</SectionSubtitle>
          )}
        </SectionHeader>

        <ContactLayout>
          {/* Left Panel - Contact Info */}
          <InfoPanel>
            <PanelIconBox>
              <Send size={20} aria-hidden="true" />
            </PanelIconBox>
            <PanelHeader>
              <PanelTitle>{t('contact.getInTouch')}</PanelTitle>
              <PanelSubtitle>{t('contact.getInTouchSubtitle')}</PanelSubtitle>
            </PanelHeader>

            <ContactItems>
              {footer.contactEmail && (
                <ContactItem href={`mailto:${footer.contactEmail}`}>
                  <IconWrapper>
                    <Mail size={18} aria-hidden="true" />
                  </IconWrapper>
                  <ContactText>
                    <ContactLabel>{t('contact.emailLabel')}</ContactLabel>
                    <ContactValue>{footer.contactEmail}</ContactValue>
                  </ContactText>
                </ContactItem>
              )}

              {footer.contactPhone && (
                <ContactItem href={`tel:${footer.contactPhone}`}>
                  <IconWrapper>
                    <Phone size={18} aria-hidden="true" />
                  </IconWrapper>
                  <ContactText>
                    <ContactLabel>{t('contact.phoneLabel')}</ContactLabel>
                    <ContactValue>{footer.contactPhone}</ContactValue>
                  </ContactText>
                </ContactItem>
              )}

              {footer.address && (
                <ContactItemStatic>
                  <IconWrapper>
                    <MapPin size={18} aria-hidden="true" />
                  </IconWrapper>
                  <ContactText>
                    <ContactLabel>{t('contact.addressLabel')}</ContactLabel>
                    <ContactValue style={{ whiteSpace: 'pre-line' }}>
                      {footer.address}
                    </ContactValue>
                  </ContactText>
                </ContactItemStatic>
              )}
            </ContactItems>
          </InfoPanel>

          {/* Right Panel - Form */}
          <FormPanel>
            <ContactForm />
          </FormPanel>
        </ContactLayout>
      </Container>
    </Wrapper>
  );
}
