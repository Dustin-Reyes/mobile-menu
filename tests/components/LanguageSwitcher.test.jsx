import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../src/components/ThemeProvider';
import LanguageSwitcher from '../../src/components/LanguageSwitcher';

// Mock i18next modules
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'language.switch': 'Switch Language',
        'language.en': 'English',
        'language.es': 'Spanish',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}));

jest.mock('../../src/i18n', () => ({
  AVAILABLE_LANGUAGES: {
    en: {
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
    },
  },
}));

describe('LanguageSwitcher', () => {
  const renderLanguageSwitcher = (props = {}) => {
    return render(
      <ThemeProvider>
        <LanguageSwitcher {...props} />
      </ThemeProvider>,
    );
  };

  it('renders language switcher button', () => {
    renderLanguageSwitcher();

    const button = screen.getByTitle('Switch Language');
    expect(button).toBeInTheDocument();
  });

  it('displays current language flag', () => {
    renderLanguageSwitcher();

    // Get the flag from the main button
    const button = screen.getByTitle('Switch Language');
    const flag = button.querySelector('span');
    expect(flag).toHaveTextContent('🇺🇸');
  });

  it('renders compact version', () => {
    renderLanguageSwitcher({ compact: true });

    const button = screen.getByTitle('Switch Language');
    expect(button).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderLanguageSwitcher();

    const button = screen.getByTitle('Switch Language');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays current language name when not compact', () => {
    renderLanguageSwitcher({ compact: false });

    const button = screen.getByTitle('Switch Language');
    const name = button.querySelector('span:last-child');
    expect(name).toHaveTextContent('English');
  });
});
