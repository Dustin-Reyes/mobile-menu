import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { AVAILABLE_LANGUAGES } from '../i18n';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'components/ui/DropdownMenu';

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${(props) => props.theme.borderRadius.s2};
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSizes.s4};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    background: ${(props) => props.theme.colors.background};
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.2em;
  line-height: 1;
`;

const LanguageName = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const StyledDropdownMenuItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;

  &[data-state='open'] {
    background: ${(props) => props.theme.colors.primary}18;
    color: ${(props) => props.theme.colors.primary};
  }
`;

/**
 * LanguageSwitcher component for changing application language
 */
const LanguageSwitcher = ({ showNativeName = false, compact = false }) => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLangData =
    AVAILABLE_LANGUAGES[currentLanguage] || AVAILABLE_LANGUAGES.en;

  const otherLanguages = Object.entries(AVAILABLE_LANGUAGES).filter(
    ([code]) => code !== currentLanguage,
  );

  if (compact) {
    return (
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <LanguageButton title={t('language.switch')}>
            <LanguageFlag>{currentLangData.flag}</LanguageFlag>
          </LanguageButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <StyledDropdownMenuItem disabled>
            <LanguageFlag>{currentLangData.flag}</LanguageFlag>
            <LanguageName>{currentLangData.nativeName}</LanguageName>
          </StyledDropdownMenuItem>
          <DropdownMenuSeparator />
          {otherLanguages.map(([code, data]) => (
            <StyledDropdownMenuItem
              key={code}
              onSelect={() => handleLanguageChange(code)}
              data-current={code === currentLanguage}
              title={t(`language.${code}`) || data.name}
            >
              <LanguageFlag>{data.flag}</LanguageFlag>
              <LanguageName>{data.nativeName}</LanguageName>
            </StyledDropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    );
  }

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <LanguageButton title={t('language.switch')}>
          <LanguageFlag>{currentLangData.flag}</LanguageFlag>
          <LanguageName>
            {showNativeName ? currentLangData.nativeName : currentLangData.name}
          </LanguageName>
        </LanguageButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <StyledDropdownMenuItem disabled>
          {t('language.current')}:
          <LanguageFlag>{currentLangData.flag}</LanguageFlag>
          <LanguageName>
            {showNativeName ? currentLangData.nativeName : currentLangData.name}
          </LanguageName>
        </StyledDropdownMenuItem>
        <DropdownMenuSeparator />
        {Object.entries(AVAILABLE_LANGUAGES).map(([code, data]) => (
          <StyledDropdownMenuItem
            key={code}
            onSelect={() => handleLanguageChange(code)}
            data-current={code === currentLanguage}
            title={t(`language.${code}`) || data.name}
          >
            <LanguageFlag>{data.flag}</LanguageFlag>
            <LanguageName>{data.nativeName}</LanguageName>
          </StyledDropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};

export default LanguageSwitcher;
