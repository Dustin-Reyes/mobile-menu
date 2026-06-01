jest.mock('react-hot-toast', () => {
  const hotToast = jest.fn();
  hotToast.success = jest.fn();
  hotToast.error = jest.fn();
  hotToast.loading = jest.fn();
  hotToast.dismiss = jest.fn();
  return { toast: hotToast };
});

jest.mock('lucide-react', () => ({
  AlertTriangle: jest.fn(() => null),
  Info: jest.fn(() => null),
}));

import { toast as hotToast } from 'react-hot-toast';
import { AlertTriangle, Info } from 'lucide-react';
import { toast, _setThemeColors } from 'utils/toast';

beforeEach(() => {
  jest.clearAllMocks();
  // Reset to default colors before each test
  _setThemeColors({ warning: '#F59E0B', info: '#4F46E5' });
});

describe('toast.success', () => {
  it('calls hotToast.success with message', () => {
    toast.success('Operation successful');
    expect(hotToast.success).toHaveBeenCalledWith(
      'Operation successful',
      undefined,
    );
  });

  it('forwards options to hotToast.success', () => {
    toast.success('Done', { duration: 2000 });
    expect(hotToast.success).toHaveBeenCalledWith('Done', { duration: 2000 });
  });
});

describe('toast.error', () => {
  it('calls hotToast.error with message', () => {
    toast.error('Something went wrong');
    expect(hotToast.error).toHaveBeenCalledWith(
      'Something went wrong',
      undefined,
    );
  });

  it('forwards options to hotToast.error', () => {
    toast.error('Failed', { duration: 5000 });
    expect(hotToast.error).toHaveBeenCalledWith('Failed', { duration: 5000 });
  });
});

describe('toast.warning', () => {
  it('calls hotToast (base function) with message', () => {
    toast.warning('Watch out');
    expect(hotToast).toHaveBeenCalledWith('Watch out', expect.any(Object));
  });

  it('includes an AlertTriangle icon element', () => {
    toast.warning('Watch out');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon).toBeDefined();
    expect(opts.icon.type).toBe(AlertTriangle);
  });

  it('icon uses warning color from theme', () => {
    toast.warning('Watch out');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon.props.color).toBe('#F59E0B');
  });

  it('icon uses updated warning color after _setThemeColors', () => {
    _setThemeColors({ warning: '#FF8C00', info: '#4F46E5' });
    toast.warning('Watch out');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon.props.color).toBe('#FF8C00');
  });

  it('forwards extra options to hotToast', () => {
    toast.warning('Watch out', { duration: 3000 });
    const opts = hotToast.mock.calls[0][1];
    expect(opts.duration).toBe(3000);
  });
});

describe('toast.info', () => {
  it('calls hotToast (base function) with message', () => {
    toast.info('FYI');
    expect(hotToast).toHaveBeenCalledWith('FYI', expect.any(Object));
  });

  it('includes an Info icon element', () => {
    toast.info('FYI');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon).toBeDefined();
    expect(opts.icon.type).toBe(Info);
  });

  it('icon uses info color from theme', () => {
    toast.info('FYI');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon.props.color).toBe('#4F46E5');
  });

  it('icon uses updated info color after _setThemeColors', () => {
    _setThemeColors({ warning: '#F59E0B', info: '#7C3AED' });
    toast.info('FYI');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon.props.color).toBe('#7C3AED');
  });
});

describe('toast.loading', () => {
  it('calls hotToast.loading with message', () => {
    toast.loading('Loading...');
    expect(hotToast.loading).toHaveBeenCalledWith('Loading...', undefined);
  });
});

describe('toast.dismiss', () => {
  it('calls hotToast.dismiss with no id', () => {
    toast.dismiss();
    expect(hotToast.dismiss).toHaveBeenCalledWith(undefined);
  });

  it('calls hotToast.dismiss with id', () => {
    toast.dismiss('toast-123');
    expect(hotToast.dismiss).toHaveBeenCalledWith('toast-123');
  });
});

describe('_setThemeColors', () => {
  it('updates warning color used by subsequent toast.warning calls', () => {
    _setThemeColors({ warning: '#EEAA00', info: '#4F46E5' });
    toast.warning('test');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon.props.color).toBe('#EEAA00');
  });

  it('updates info color used by subsequent toast.info calls', () => {
    _setThemeColors({ warning: '#F59E0B', info: '#0088FF' });
    toast.info('test');
    const opts = hotToast.mock.calls[0][1];
    expect(opts.icon.props.color).toBe('#0088FF');
  });
});
