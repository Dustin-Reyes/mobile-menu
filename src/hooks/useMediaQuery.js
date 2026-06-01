import { useState, useEffect } from 'react';

/**
 * Returns true when the given CSS media query matches the current viewport.
 * Subscribes to changes and re-renders automatically.
 *
 * @param {string} query - CSS media query string, e.g. '(max-width: 768px)'
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
