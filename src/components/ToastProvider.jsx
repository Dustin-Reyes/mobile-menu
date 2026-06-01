import { useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { Toaster } from 'react-hot-toast';
import { _setThemeColors } from '@/utils/toast';

export function ToastProvider({ position = 'top-center' }) {
  const theme = useTheme();

  useEffect(() => {
    _setThemeColors(theme.colors);
  }, [theme.colors]);

  return (
    <Toaster
      position={position}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: theme.colors.surface,
          color: theme.colors.text,
          borderRadius: theme.borderRadius.s2,
          boxShadow: theme.shadows.s2,
          border: `1px solid ${theme.colors.border}`,
          fontFamily: theme.typography.fontFamilies.sans,
          fontSize: theme.typography.fontSizes.s3,
          zIndex: theme.zIndex.toast,
        },
        success: {
          iconTheme: {
            primary: theme.colors.success,
            secondary: theme.colors.surface,
          },
        },
        error: {
          iconTheme: {
            primary: theme.colors.error,
            secondary: theme.colors.surface,
          },
        },
      }}
    />
  );
}
