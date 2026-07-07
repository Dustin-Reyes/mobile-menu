/**
 * Root application component.
 *
 * Declares all client-side routes, wraps them in page transition animations,
 * and handles post-navigation scroll restoration.
 *
 * @returns {JSX.Element}
 */
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from 'components/ErrorBoundary';
import Header from 'components/Header';
import Footer from 'components/Footer';
import PageTransition from 'components/PageTransition';
import { ToastProvider } from 'components/ToastProvider';
import PageSEO from 'components/PageSEO';
import Home from 'pages/Home';
import NotFound from 'pages/NotFound';

function App() {
  const location = useLocation();

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
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
      <ToastProvider position="bottom-right" />
    </ErrorBoundary>
  );
}

export default App;
