// react-hot-toast is mocked in jest.setup.js but only the default export.
// toast.js imports the named `toast` export, so we need to handle both.
jest.mock('react-hot-toast', () => {
  const fn = jest.fn();
  fn.success = jest.fn();
  fn.error = jest.fn();
  fn.loading = jest.fn();
  fn.dismiss = jest.fn();
  return {
    __esModule: true,
    default: fn,
    toast: fn,
  };
});

import { toast as hotToast } from 'react-hot-toast';
import { toast, _setThemeColors } from 'utils/toast';

describe('toast utility', () => {
  beforeEach(() => jest.clearAllMocks());

  it('toast.success delegates to hotToast.success', () => {
    toast.success('Saved!');
    expect(hotToast.success).toHaveBeenCalledWith('Saved!', undefined);
  });

  it('toast.error delegates to hotToast.error', () => {
    toast.error('Failed!', { duration: 5000 });
    expect(hotToast.error).toHaveBeenCalledWith('Failed!', { duration: 5000 });
  });

  it('toast.loading delegates to hotToast.loading', () => {
    toast.loading('Loading...');
    expect(hotToast.loading).toHaveBeenCalledWith('Loading...', undefined);
  });

  it('toast.dismiss delegates to hotToast.dismiss', () => {
    toast.dismiss('toast-id-123');
    expect(hotToast.dismiss).toHaveBeenCalledWith('toast-id-123');
  });

  it('toast.warning calls hotToast (base fn) with an icon', () => {
    toast.warning('Watch out!');
    expect(hotToast).toHaveBeenCalledWith('Watch out!', expect.objectContaining({ icon: expect.anything() }));
  });

  it('toast.info calls hotToast (base fn) with an icon', () => {
    toast.info('FYI');
    expect(hotToast).toHaveBeenCalledWith('FYI', expect.objectContaining({ icon: expect.anything() }));
  });

  it('_setThemeColors does not throw', () => {
    expect(() => _setThemeColors({ warning: '#f00', info: '#00f' })).not.toThrow();
  });
});
