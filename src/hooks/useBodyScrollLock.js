/**
 * Locks `document.body` scroll while a component is mounted with `active = true`.
 *
 * Restores `overflow` to its default on cleanup, ensuring scroll is never
 * permanently disabled even if the component unmounts unexpectedly.
 *
 * @param {boolean} active - When `true` sets `body.style.overflow = 'hidden'`.
 * @returns {void}
 */
import { useEffect } from 'react';

function useBodyScrollLock(active) {
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);
}

export default useBodyScrollLock;
