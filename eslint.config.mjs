// eslint.config.mjs
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.yarn/**',
      '.pnp.*',
      'dist/**',
      'build/**',
      '.vite/**',
      '.cache/**',
      '.eslintcache',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.netlify/**',
      'netlify/plugins/**',
      'scripts/**',
      '.vscode/**',
      '.idea/**',
      '.DS_Store',
    ],
  },
  js.configs.recommended,
  // Front-end React config
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        browser: true,
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        process: 'readonly',
        AbortController: 'readonly',
        FileReader: 'readonly',
        IntersectionObserver: 'readonly',
        fetch: 'readonly',
        crypto: 'readonly',
        global: 'readonly',
        import: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Vite config file
  {
    files: ['vite.config.js', 'vite.config.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  // Netlify functions
  {
    files: ['netlify/functions/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  // Test files
  {
    files: [
      'src/**/*.test.{js,jsx}',
      'src/**/__tests__/**/*.{js,jsx}',
      'src/**/*.spec.{js,jsx}',
      'tests/**/*.{js,jsx}',
      'jest.setup.js',
      'jest.config.js',
    ],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        require: 'readonly',
        module: 'readonly',
        browser: true,
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  // Build tools and scripts
  {
    files: [
      '*.config.js',
      '*.config.mjs',
      'playwright.config.js',
      'jest.babel.*.js',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
