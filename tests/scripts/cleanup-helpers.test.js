const fs = require('fs');
const os = require('os');
const path = require('path');

let helpers;
let tmpDir;

const APP_JSX_CONTENT = `import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from 'components/ErrorBoundary';
import Header from 'components/Header';
import PageTransition from 'components/PageTransition';
import { ToastProvider } from 'components/ToastProvider';
import PageSEO from 'components/PageSEO';
import Home from 'pages/Home';
import NotFound from 'pages/NotFound';

const Demo =
  process.env.NODE_ENV !== 'production'
    ? lazy(() => import('pages/Demo'))
    : null;

const AdminDashboard = lazy(() => import('components/AdminDashboard'));

function App() {
  const location = useLocation();

  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <ErrorBoundary>
      <PageSEO />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          {!isProduction && Demo && (
            <Route
              path="/demo"
              element={
                <Suspense fallback={null}>
                  <PageTransition>
                    <Demo />
                  </PageTransition>
                </Suspense>
              }
            />
          )}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Loading admin...</div>}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <ToastProvider />
    </ErrorBoundary>
  );
}

export default App;
`;

beforeEach(() => {
  helpers = require('../../scripts/lib/cleanup-helpers');
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-cleanup-test-'));
  fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(tmpDir, 'src/App.jsx'), APP_JSX_CONTENT);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  jest.resetModules();
});

describe('isSetupComplete', () => {
  it('returns false when .template-state.json does not exist', () => {
    expect(helpers.isSetupComplete(tmpDir)).toBe(false);
  });

  it('returns true when .template-state.json exists with setupComplete: true', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.template-state.json'),
      JSON.stringify({ setupComplete: true })
    );
    expect(helpers.isSetupComplete(tmpDir)).toBe(true);
  });
});

describe('getFilesToRemove', () => {
  it('returns array of absolute paths to remove', () => {
    const files = helpers.getFilesToRemove(tmpDir);
    expect(Array.isArray(files)).toBe(true);
    expect(files).toContain(path.join(tmpDir, 'src/dev/demo'));
    expect(files).toContain(path.join(tmpDir, 'src/pages/Demo.jsx'));
    expect(files).toContain(path.join(tmpDir, 'src/components/DemoWidget.jsx'));
    expect(files).toContain(path.join(tmpDir, 'src/components/ErrorTrigger.jsx'));
    expect(files).toContain(path.join(tmpDir, 'src/components/CodeBlock.jsx'));
    expect(files).toContain(path.join(tmpDir, 'scripts'));
    expect(files).toContain(path.join(tmpDir, '.template-state.json'));
  });
});

describe('patchAppJsx', () => {
  it('removes the Demo lazy import block', () => {
    helpers.patchAppJsx(tmpDir);
    const result = fs.readFileSync(path.join(tmpDir, 'src/App.jsx'), 'utf8');
    expect(result).not.toContain("import('pages/Demo')");
    expect(result).not.toContain('const Demo =');
  });

  it('removes the isProduction const', () => {
    helpers.patchAppJsx(tmpDir);
    const result = fs.readFileSync(path.join(tmpDir, 'src/App.jsx'), 'utf8');
    expect(result).not.toContain('const isProduction');
  });

  it('removes the Demo route JSX block', () => {
    helpers.patchAppJsx(tmpDir);
    const result = fs.readFileSync(path.join(tmpDir, 'src/App.jsx'), 'utf8');
    expect(result).not.toContain('path="/demo"');
    expect(result).not.toContain('isProduction && Demo');
  });

  it('preserves all other routes and imports', () => {
    helpers.patchAppJsx(tmpDir);
    const result = fs.readFileSync(path.join(tmpDir, 'src/App.jsx'), 'utf8');
    expect(result).toContain('path="/"');
    expect(result).toContain('path="/admin"');
    expect(result).toContain('path="*"');
    expect(result).toContain('AdminDashboard');
    expect(result).toContain("import Home from 'pages/Home'");
  });
});

describe('patchPackageJsonCleanup', () => {
  it('removes setup and cleanup scripts from package.json', () => {
    const pkgPath = path.join(tmpDir, 'package.json');
    fs.writeFileSync(pkgPath, JSON.stringify({
      name: 'my-app',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        setup: 'node scripts/setup.mjs',
        cleanup: 'node scripts/cleanup.mjs',
      },
    }, null, 2));

    helpers.patchPackageJsonCleanup(tmpDir);

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.scripts.setup).toBeUndefined();
    expect(pkg.scripts.cleanup).toBeUndefined();
    expect(pkg.scripts.dev).toBe('vite');
    expect(pkg.scripts.build).toBe('vite build');
  });
});
