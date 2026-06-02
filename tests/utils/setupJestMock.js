// Pre-framework environment setup.
// jest.mock() is NOT available here — global mocks belong in jest.setup.js.

// Suppress noisy "Each child in a list should have a unique key" warnings
// that fire from Radix UI internals during render.
const _originalWarn = console.warn;
global.console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('unique key')) return;
  _originalWarn(...args);
};
