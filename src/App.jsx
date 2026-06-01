import { Suspense, lazy } from 'react';
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
