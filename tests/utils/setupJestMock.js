// Jest mock setup for Vite modules and browser-specific features

global.import = {
  meta: {
    glob: () => ({}),
    env: {
      VITE_SENTRY_DSN: '',
      VITE_APP_ENV: 'test',
      DEV: true,
    },
  },
};

process.env = {
  ...process.env,
  NODE_ENV: 'test',
};
