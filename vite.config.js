import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
      jsxRuntime: 'automatic',
    }),
    svgr(),
  ],

  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@emotion/react',
    loader: 'jsx',
    include: /\.(jsx?|tsx?)$/,
  },

  resolve: {
    extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      context: path.resolve(__dirname, './src/context'),
      config: path.resolve(__dirname, './src/config'),
      hooks: path.resolve(__dirname, './src/hooks'),
      pages: path.resolve(__dirname, './src/pages'),
      services: path.resolve(__dirname, './src/services'),
      styles: path.resolve(__dirname, './src/styles'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },

  server: {
    port: Number(process.env.DEV_PORT || 5173),
    host: process.env.DEV_SERVER_HOST || 'localhost',
    strictPort: true,
    hmr: {
      overlay: true,
    },
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        rewrite: (p) => p,
        ws: true,
      },
    },
    fs: {
      allow: ['..'],
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    target: 'es2018',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'emotion-vendor': ['@emotion/react', '@emotion/styled'],
          'motion-vendor': ['framer-motion'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development',
    ),
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@emotion/react',
      '@emotion/styled',
      '@sentry/react',
    ],
  },
});
