/**
 * Root application component.
 *
 * Declares all client-side routes, wraps them in page transition animations,
 * handles post-navigation scroll restoration (including anchor-link scrolling),
 * and conditionally renders the Footer on non-admin routes.
 *
 * The Demo route is only registered in non-production builds.
 * The Dashboard route is lazy-loaded and protected by RequireAuth.
 *
 * @returns {JSX.Element}
 */
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from 'components/ErrorBoundary';
import Header from 'components/Header';
import Footer from 'components/Footer';
import PageTransition from 'components/PageTransition';
import { ToastProvider } from 'components/ToastProvider';
import PageSEO from 'components/PageSEO';
import { AuthProvider } from 'context/AuthContext';
import RequireAuth from 'components/auth/RequireAuth';
import Home from 'pages/Home';
import Example from 'pages/Example';
import NotFound from 'pages/NotFound';

const Demo =
  process.env.NODE_ENV !== 'production'
    ? lazy(() => import('pages/Demo'))
    : null;

const Dashboard = lazy(() => import('components/admin/layout/Dashboard'));

function App() {
  const location = useLocation();

  const isProduction = process.env.NODE_ENV === 'production';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // After the exit animation (0.2s), scroll to top or to a specific section when
  // navigating from another page via an anchor link (state.scrollTo is the section id).
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    const timer = setTimeout(() => {
      if (scrollTo) {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ErrorBoundary>
      <PageSEO />
      <AuthProvider>
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
            <Route
              path="/example"
              element={
                <PageTransition>
                  <Example />
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
                <RequireAuth>
                  <Suspense fallback={<div>Loading admin...</div>}>
                    <Dashboard />
                  </Suspense>
                </RequireAuth>
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
        {!isAdminRoute && <Footer />}
      </AuthProvider>
      <ToastProvider position="bottom-right" />
    </ErrorBoundary>
  );
}

export default App;
