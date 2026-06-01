import { useCallback } from 'react';
import { toast } from '@/utils/toast';

/**
 * Hook wrapper around the project's toast utility.
 *
 * Returns a `showToast` function that accepts `{ message, type }`.
 * `type` can be 'success' | 'error' | 'info' | 'warning'.
 */
export function useToast() {
  const showToast = useCallback(({ message, type = 'info' } = {}) => {
    (toast[type] ?? toast.info)(message);
  }, []);

  return { showToast };
}
