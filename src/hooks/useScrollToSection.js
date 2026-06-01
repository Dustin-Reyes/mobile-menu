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
