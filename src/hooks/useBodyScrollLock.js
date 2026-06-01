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
