/**
 * Project toast notification helpers.
 *
 * Wraps `react-hot-toast` with themed `warning` and `info` variants that
 * inject Lucide icons and use the active Emotion theme colours. Call
 * `_setThemeColors()` from the theme-aware component tree to keep colours in
 * sync with the active theme.
 *
 * Prefer the `useToast` hook for component-level toasts.
 *
 * @module utils/toast
 */
import { createElement } from 'react';
import { toast as hotToast } from 'react-hot-toast';
import { AlertTriangle, Info } from 'lucide-react';

let _colors = { warning: '#F59E0B', info: '#4282E1' };

/**
 * Updates the theme colours used by the `warning` and `info` toast variants.
 *
 * Call this in a component that has access to the Emotion theme whenever the
 * active colour scheme changes.
 *
 * @param {{ warning: string, info: string }} colors - CSS colour strings for warning and info icons.
 */
export const _setThemeColors = (colors) => {
  _colors = colors;
};

/**
 * Themed toast dispatch object.
 *
 * Each method maps to a `react-hot-toast` call, with `warning` and `info`
 * receiving Lucide icon elements.
 *
 * @type {{
 *   success: (msg: string, opts?: Object) => string,
 *   error: (msg: string, opts?: Object) => string,
 *   warning: (msg: string, opts?: Object) => string,
 *   info: (msg: string, opts?: Object) => string,
 *   loading: (msg: string, opts?: Object) => string,
 *   dismiss: (id?: string) => void
 * }}
 */
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
