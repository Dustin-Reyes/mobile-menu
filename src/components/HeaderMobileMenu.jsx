import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Phone, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { SwitchRoot, SwitchThumb } from 'components/ui/Switch';
import { AVAILABLE_LANGUAGES } from '../i18n';

const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 72px 0 0 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndex.dropdown - 1};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity ${({ theme }) => theme.transitions.slow};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 72px;
  right: 0;
  bottom: 0;
  width: 100%;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : theme.colors.background};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.s3};
  box-shadow: ${({ theme }) => theme.shadows.s4};
  transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform ${({ theme }) => theme.transitions.slow};
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: none;
  }
`;

const MobileNavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: ${({ theme }) => theme.spacing.s4};
`;

const MobileNavBtn = styled.button`
  display: block;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.s4};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  padding: ${({ theme }) => theme.spacing.s2} 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileBottom = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
  padding-top: ${({ theme }) => theme.spacing.s3};
`;

const MobilePhoneLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s1};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.spacing.s2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s0};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileSettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.s2} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MobileSettingLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.s4};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

const MobileLangFlags = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s1};
`;

const LangFlagBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s0};
  background: none;
  border: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  border-radius: ${({ theme }) => theme.borderRadius.s1};
  padding: ${({ theme }) => theme.spacing.s0};
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 1;
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileCTAButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s1};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s4};
  border-radius: ${({ theme }) => theme.borderRadius.s0};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

function HeaderMobileMenu({
  open,
  navItems,
  activeId,
  lang,
  onNavigate,
  onClose,
}) {
  const { isDark, toggleMode } = useTheme();
  const { i18n, t } = useTranslation();

  return (
    <>
      <MobileMenuOverlay $open={open} aria-hidden="true" onClick={onClose} />

      <MobileMenu
        id="mobile-menu"
        $open={open}
        aria-hidden={!open}
        role="dialog"
        aria-label="Navigation menu"
      >
        <MobileNavList aria-label="Mobile navigation">
          {navItems.map((item) => (
            <MobileNavBtn
              key={item.id}
              $active={
                item.sectionId
                  ? activeId === item.sectionId
                  : activeId === 'home'
              }
              onClick={() => onNavigate(item.sectionId)}
            >
              {item.labels[lang] ?? item.labels.en}
            </MobileNavBtn>
          ))}
        </MobileNavList>

        <MobileSettingRow>
          <MobileSettingLabel>{t('language.label')}</MobileSettingLabel>
          <MobileLangFlags>
            {Object.entries(AVAILABLE_LANGUAGES).map(([code, data]) => (
              <LangFlagBtn
                key={code}
                $active={lang === code}
                onClick={() => i18n.changeLanguage(code)}
                aria-label={data.nativeName}
                title={data.nativeName}
              >
                {data.flag}
              </LangFlagBtn>
            ))}
          </MobileLangFlags>
        </MobileSettingRow>

        <MobileSettingRow>
          <MobileSettingLabel>
            {t(isDark ? 'theme.darkMode' : 'theme.lightMode')}
          </MobileSettingLabel>
          <SwitchRoot
            checked={isDark}
            onCheckedChange={toggleMode}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <SwitchThumb>
              {isDark ? <Moon size={12} /> : <Sun size={12} />}
            </SwitchThumb>
          </SwitchRoot>
        </MobileSettingRow>

        <MobileBottom>
          <MobilePhoneLink href="tel:+15413297504">
            <Phone size={16} aria-hidden="true" />
            (541) 329-7504
          </MobilePhoneLink>
          <MobileCTAButton onClick={() => onNavigate('contact-form')}>
            {t('nav.getAQuote')}
            <ArrowRight size={16} aria-hidden="true" />
          </MobileCTAButton>
        </MobileBottom>
      </MobileMenu>
    </>
  );
}

export default HeaderMobileMenu;
