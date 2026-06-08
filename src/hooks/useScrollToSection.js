/**
 * Scrolls to a named page section, navigating to the home page first if needed.
 *
 * If the user is already on `'/'` the scroll happens immediately. Otherwise
 * the hook navigates to `'/'` and defers the scroll by `delay` ms to allow
 * the route transition to settle.
 *
 * @param {{ onBeforeScroll?: (sectionId: string) => void, delay?: number }} [options]
 * @param {(sectionId: string) => void} [options.onBeforeScroll] - Optional callback fired before scrolling (e.g. to close a menu).
 * @param {number} [options.delay=150] - Milliseconds to wait after navigation before scrolling.
 * @returns {(sectionId: string | null) => void} `scrollToSection` — call with a section element ID or `null` to scroll to the top.
 */
import { useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function useScrollToSection({ onBeforeScroll, delay = 150 } = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const callbackRef = useRef(onBeforeScroll);
  callbackRef.current = onBeforeScroll;

  const scrollToSection = useCallback(
    (sectionId) => {
      callbackRef.current?.(sectionId);
      const doScroll = () => {
        if (!sectionId) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      if (location.pathname === '/') {
        doScroll();
      } else {
        navigate('/');
        setTimeout(doScroll, delay);
      }
    },
    [location.pathname, navigate, delay],
  );

  return scrollToSection;
}

export default useScrollToSection;
