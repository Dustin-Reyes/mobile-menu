/**
 * Hook wrapper around the project's toast utility.
 *
 * @module hooks/useToast
 */
import { useCallback } from 'react';
import { toast } from '@/utils/toast';

/**
 * Returns a stable `showToast` helper for displaying toast notifications.
 *
 * @returns {{ showToast: (options: { message: string, type?: 'success' | 'error' | 'info' | 'warning' }) => void }}
 */
export function useToast() {
  const showToast = useCallback(({ message, type = 'info' } = {}) => {
    (toast[type] ?? toast.info)(message);
  }, []);

  return { showToast };
}
