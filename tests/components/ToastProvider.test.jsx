jest.mock('react-hot-toast', () => {
  const React = require('react');
  return {
    Toaster: jest.fn(() =>
      React.createElement('div', { 'data-testid': 'toaster' }),
    ),
  };
});

jest.mock('@/utils/toast', () => ({
  _setThemeColors: jest.fn(),
}));

import { screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { render } from '../../jest.setup';
import { ToastProvider } from '../../src/components/ToastProvider';
import { _setThemeColors } from '@/utils/toast';
import { lightColors } from '../../src/styles/colors';

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Toaster into the DOM', () => {
    render(<ToastProvider />);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('calls _setThemeColors with theme colors on mount', () => {
    render(<ToastProvider />);
    expect(_setThemeColors).toHaveBeenCalledWith(
      expect.objectContaining({
        success: lightColors.success,
        warning: lightColors.warning,
        error: lightColors.error,
        info: lightColors.info,
      }),
    );
  });

  it('calls _setThemeColors exactly once on initial mount', () => {
    render(<ToastProvider />);
    expect(_setThemeColors).toHaveBeenCalledTimes(1);
  });

  it('defaults position to top-center', () => {
    render(<ToastProvider />);
    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({ position: 'top-center' }),
      expect.anything(),
    );
  });

  it('passes custom position to Toaster', () => {
    render(<ToastProvider position="bottom-center" />);
    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({ position: 'bottom-center' }),
      expect.anything(),
    );
  });
});
