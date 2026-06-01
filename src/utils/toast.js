import { createElement } from 'react';
import { toast as hotToast } from 'react-hot-toast';
import { AlertTriangle, Info } from 'lucide-react';

let _colors = { warning: '#F59E0B', info: '#4282E1' };

export const _setThemeColors = (colors) => {
  _colors = colors;
};

export const toast = {
  success: (msg, opts) => hotToast.success(msg, opts),
  error: (msg, opts) => hotToast.error(msg, opts),
  warning: (msg, opts) =>
    hotToast(msg, {
      icon: createElement(AlertTriangle, { size: 20, color: _colors.warning }),
      ...opts,
    }),
  info: (msg, opts) =>
    hotToast(msg, {
      icon: createElement(Info, { size: 20, color: _colors.info }),
      ...opts,
    }),
  loading: (msg, opts) => hotToast.loading(msg, opts),
  dismiss: (id) => hotToast.dismiss(id),
};
