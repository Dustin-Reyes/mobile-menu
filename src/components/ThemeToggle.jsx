import styled from '@emotion/styled';
import { Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';
import { SwitchRoot, SwitchThumb } from 'components/ui/Switch';

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.typography.fontSizes.s3};
  line-height: ${(props) => props.theme.typography.lineHeights.tight};
`;

export const ThemeToggle = ({ ...props }) => {
  const themeContext = useTheme();
  const { t } = useTranslation();

  if (!themeContext) return null;
  const { isDark, toggleMode } = themeContext;

  const targetMode = isDark ? 'light' : 'dark';
  const ariaLabel = t('theme.toggle', { mode: targetMode });
  const title = t('theme.toggle', { mode: targetMode });

  return (
    <SwitchRoot
      checked={isDark}
      onCheckedChange={toggleMode}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      <SwitchThumb>
        <IconWrapper aria-hidden="true">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </IconWrapper>
      </SwitchThumb>
    </SwitchRoot>
  );
};

export default ThemeToggle;
