import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import PROJECT_CONFIG from 'config/project';
import SECTIONS_CONFIG from '../config/sections';
import { usePage } from 'hooks/useContent';

// ─── Social icon registry ─────────────────────────────────────────────────────
// Add new platforms here — only entries with a URL in the CMS will render.
const SOCIAL_REGISTRY = {
  facebook: { Icon: Facebook, label: 'Facebook' },
  instagram: { Icon: Instagram, label: 'Instagram' },
  twitter: { Icon: Twitter, label: 'Twitter / X' },
  linkedin: { Icon: Linkedin, label: 'LinkedIn' },
  github: { Icon: Github, label: 'GitHub' },
  youtube: { Icon: Youtube, label: 'YouTube' },
};

// ─── Styled components ────────────────────────────────────────────────────────

const FooterContainer = styled.footer`
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s5};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.s8}
      ${({ theme }) => theme.spacing.s6};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.s7};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.s8};
    align-items: start;
  }
`;

// ─── Brand column ─────────────────────────────────────────────────────────────

const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s3};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-items: flex-start;
    text-align: left;
  }
`;

const LogoImage = styled.img`
  height: 36px;
  width: auto;
  display: block;
`;

const CompanyName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s5};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.01em;
`;

const Tagline = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 360px;
`;

const SocialRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s2};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.s2};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: flex-start;
  }
`;

const SocialBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}14;
  }
`;

// ─── Links / Contact columns ──────────────────────────────────────────────────

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s3};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-items: flex-start;
  }
`;

const ColHeading = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.s1};
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    display: grid;
    align-items: flex-start;
    row-gap: ${({ theme }) => theme.spacing.s2};
    column-gap: ${({ theme }) => theme.spacing.s6};
  }
`;

const NavItem = styled.li``;

const FooterLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterAnchor = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContactList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s3};
  width: 100%;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.s2};
`;

const ContactIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

const ContactText = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  line-height: 1.5;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// ─── Bottom bar ───────────────────────────────────────────────────────────────

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`;

const BottomBar = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.s4} ${({ theme }) => theme.spacing.s5};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
  align-items: center;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    padding: ${({ theme }) => theme.spacing.s4}
      ${({ theme }) => theme.spacing.s6};
  }
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: rgba(
    ${({ theme }) => (theme.mode === 'dark' ? '255,255,255' : '0,0,0')},
    0.35
  );
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s4};
`;

const LegalLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: rgba(
    ${({ theme }) => (theme.mode === 'dark' ? '255,255,255' : '0,0,0')},
    0.35
  );
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { name, description } = PROJECT_CONFIG.organization;
  const { content: footerContent } = usePage('site');

  // ── Section nav links driven from sections config ──────────────────────────
  const sectionLinks = SECTIONS_CONFIG.navigation
    .filter((nav) => nav.enabled)
    .map((nav) => ({
      id: nav.id,
      label: t(`nav.${nav.id}`),
    }));

  // ── Social icons — only those with a URL set in CMS ───────────────────────
  const activeSocial = Object.entries(SOCIAL_REGISTRY).filter(
    ([key]) => footerContent?.footer?.[key],
  );

  // ── Contact info — only items with data ────────────────────────────────────
  const hasContact =
    footerContent?.footer?.contactPhone ||
    footerContent?.footer?.contactEmail ||
    footerContent?.footer?.address;

  // ── Scroll helper ──────────────────────────────────────────────────────────
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const year = new Date().getFullYear();

  return (
    <FooterContainer>
      <Inner>
        <Grid>
          {/* ── Brand column ── */}
          <BrandCol>
            <LogoImage
              src={isDark ? '/Transpiled-W.webp' : '/Transpiled-B.webp'}
              alt={name}
            />
            {/* Replace with your company name in src/config/project.js → organization.name */}
            <CompanyName>{name}</CompanyName>
            {/* Replace with your tagline in src/i18n/locales/en.json → footer.tagline */}
            <Tagline>{t('footer.tagline') || description}</Tagline>

            {activeSocial.length > 0 && (
              <SocialRow>
                {activeSocial.map(([key, { Icon, label }]) => (
                  <SocialBtn
                    key={key}
                    href={footerContent?.footer?.[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </SocialBtn>
                ))}
              </SocialRow>
            )}
          </BrandCol>

          {/* ── Quick links column ── */}
          <Col>
            <ColHeading>{t('footer.quickLinks')}</ColHeading>
            <NavList>
              {/* Home */}
              <NavItem>
                <FooterLink to="/">{t('nav.home')}</FooterLink>
              </NavItem>

              {/* Section anchors — driven from SECTIONS_CONFIG in src/config/sections.js */}
              {sectionLinks.map(({ id, label }) => {
                return (
                  <NavItem key={id}>
                    <FooterAnchor
                      href={`/#${id}`}
                      onClick={(e) => handleSectionClick(e, id)}
                    >
                      {label}
                    </FooterAnchor>
                  </NavItem>
                );
              })}
            </NavList>
          </Col>

          {/* ── Contact column ── */}
          {hasContact && (
            <Col>
              <ColHeading>{t('footer.contactUs')}</ColHeading>
              <ContactList>
                {footerContent?.footer?.contactPhone && (
                  <ContactItem>
                    <ContactIcon>
                      <Phone size={15} />
                    </ContactIcon>
                    <ContactText
                      href={`tel:${footerContent.footer.contactPhone}`}
                    >
                      {footerContent.footer.contactPhone}
                    </ContactText>
                  </ContactItem>
                )}
                {footerContent?.footer?.contactEmail && (
                  <ContactItem>
                    <ContactIcon>
                      <Mail size={15} />
                    </ContactIcon>
                    <ContactText
                      href={`mailto:${footerContent.footer.contactEmail}`}
                    >
                      {footerContent.footer.contactEmail}
                    </ContactText>
                  </ContactItem>
                )}
                {footerContent?.footer?.address && (
                  <ContactItem>
                    <ContactIcon>
                      <MapPin size={15} />
                    </ContactIcon>
                    <ContactText as="span">
                      {footerContent.footer.address}
                    </ContactText>
                  </ContactItem>
                )}
              </ContactList>
            </Col>
          )}
        </Grid>
      </Inner>

      <Divider />

      <BottomBar>
        {/* Update organization.name in src/config/project.js to change the copyright */}
        <Copyright>
          &copy; {year} {name}. All rights reserved.
        </Copyright>
        <LegalLinks>
          {/* Add legal pages as the project grows */}
          <LegalLink to="/privacy">Privacy Policy</LegalLink>
          <LegalLink to="/terms">Terms of Service</LegalLink>
        </LegalLinks>
      </BottomBar>
    </FooterContainer>
  );
}

export default Footer;
