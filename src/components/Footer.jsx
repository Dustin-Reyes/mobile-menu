import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Search,
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/project';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.s5} ${({ theme }) => theme.spacing.s4};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.s6}
      ${({ theme }) => theme.spacing.s4};
  }
`;

const FooterContent = styled.div`
  max-width: 2000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.s5};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.s6};
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s3};
  align-items: center;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

const ColumnWithDivider = styled(FooterColumn)`
  padding-left: 0;
  border-left: none;
  padding-top: ${({ theme }) => theme.spacing.s4};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-left: ${({ theme }) => theme.spacing.s4};
    padding-top: 0;
    border-top: none;
  }
`;

const LogoImage = styled.img`
  height: clamp(40px, 8vw, 100px);
  width: auto;
  object-fit: contain;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  filter: ${({ theme }) => (theme.mode === 'light' ? 'brightness(0)' : 'none')};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-self: center;
    align-self: center;
  }
`;

const Tagline = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s2};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 400px;
  width: 100%;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    text-align: left;
    justify-self: center;
    align-self: center;
  }
`;

const SectionHeading = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.s3};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    text-align: left;
  }
`;

const QuickLinksGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s8};
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    justify-content: start;
    width: 100%;
  }
`;

const QuickLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s1};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.s2};
  transition: color ${({ theme }) => theme.transitions.fast};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.s4};
  width: 100%;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.s2};
  line-height: 1.5;
  transition: color ${({ theme }) => theme.transitions.fast};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: flex-start;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const IconBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.s6} 0
    ${({ theme }) => theme.spacing.s4};
`;

const BottomBar = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s3};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SocialIcons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s2};
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: flex-end;
  }
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  transition: all ${({ theme }) => theme.transitions.fast};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.onPrimary};
    }
  }
`;

function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { contact, social } = PROJECT_CONFIG.organization;

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate('/');
      window.setTimeout(() => scrollToSection(sectionId), 100);
    }
  };

  // Build hours string from config with language-aware day names
  const formatHours = () => {
    const days = contact.hours?.days || [];
    if (!days.length || !contact.hours?.open) return null;
    const dayNames = days.map((day) => t(`common.days.${day}`));
    const daysRange = `${dayNames[0]}-${dayNames[dayNames.length - 1]}`;
    return `${daysRange}: ${contact.hours.open} - ${contact.hours.close}`;
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <LogoImage src="/logo.png" alt={PROJECT_CONFIG.organization.name} />
          <Tagline>{t('footer.tagline')}</Tagline>
        </FooterColumn>

        <ColumnWithDivider>
          <SectionHeading>{t('footer.quickLinks')}</SectionHeading>
          <QuickLinksGrid>
            <QuickLink to="/" onClick={(e) => handleSectionClick(e, null)}>
              {t('footer.links.home')}
            </QuickLink>
            <QuickLink to="/" onClick={(e) => handleSectionClick(e, 'about')}>
              {t('footer.links.aboutUs')}
            </QuickLink>
            <QuickLink
              to="/"
              onClick={(e) => handleSectionClick(e, 'services')}
            >
              {t('footer.links.services')}
            </QuickLink>
            <QuickLink
              to="/"
              onClick={(e) => handleSectionClick(e, 'why-choose-us')}
            >
              {t('footer.links.why')}
            </QuickLink>
            <QuickLink to="/" onClick={(e) => handleSectionClick(e, 'faq')}>
              {t('footer.links.faq')}
            </QuickLink>
            <QuickLink
              to="/"
              onClick={(e) => handleSectionClick(e, 'contact-form')}
            >
              {t('footer.links.contact')}
            </QuickLink>
          </QuickLinksGrid>
        </ColumnWithDivider>

        <ColumnWithDivider>
          <SectionHeading>{t('footer.contactUs')}</SectionHeading>
          <ContactInfo>
            <ContactItem href={`tel:${contact.phone}`}>
              <IconBadge>
                <Phone size={16} />
              </IconBadge>
              <div>{contact.phone}</div>
            </ContactItem>
            <ContactItem href={`mailto:${contact.email}`}>
              <IconBadge>
                <Mail size={16} />
              </IconBadge>
              <div>{contact.email}</div>
            </ContactItem>
            <ContactItem as="div">
              <IconBadge>
                <MapPin size={16} />
              </IconBadge>
              <div>{contact.address}</div>
            </ContactItem>
            {formatHours() && (
              <ContactItem as="div">
                <IconBadge>
                  <Clock size={16} />
                </IconBadge>
                <div>{formatHours()}</div>
              </ContactItem>
            )}
          </ContactInfo>
        </ColumnWithDivider>
      </FooterContent>

      <Divider />

      <BottomBar>
        <Copyright>{t('footer.copyright')}</Copyright>
        <SocialIcons>
          <SocialIcon
            href={social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.social.facebook')}
          >
            <Facebook size={20} />
          </SocialIcon>
          <SocialIcon
            href={social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.social.instagram')}
          >
            <Instagram size={20} />
          </SocialIcon>
          <SocialIcon
            href={social.google}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.social.google')}
          >
            <Search size={20} />
          </SocialIcon>
        </SocialIcons>
      </BottomBar>
    </FooterContainer>
  );
}

export default Footer;
