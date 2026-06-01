export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: ['<rootDir>/tests/utils/setupJestMock.js'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { configFile: './jest.babel.config.json' }],
  },
  testMatch: ['<rootDir>/tests/**/*.{test,spec}.{js,jsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],
  moduleNameMapper: {
    '^framer-motion$': '<rootDir>/tests/__mocks__/framer-motion.js',
    // Handle Vite aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^context/(.*)$': '<rootDir>/src/context/$1',
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^styles/(.*)$': '<rootDir>/src/styles/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle asset imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
  },
  moduleDirectories: ['node_modules', 'src'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
  ],
  transformIgnorePatterns: ['/node_modules/(?!(@sentry)/)'],
};
