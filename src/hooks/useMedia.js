/**
 * React hooks for media library state and image upload orchestration.
 *
 * @module hooks/useMedia
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUploadUrl,
  uploadToR2,
  triggerProcessing,
  getMediaLibrary,
  watchMediaDoc,
} from 'services/media';
import globalErrorHandler from 'utils/errorHandler';

/**
 * Fetches and manages the media library collection state.
 *
 * @returns {{ items: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useMediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMediaLibrary();
      setItems(data);
    } catch (e) {
      setError(e);
      globalErrorHandler.reportError(e, { hook: 'useMediaLibrary' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

/**
 * Orchestrates the full image upload flow:
 * getUploadUrl → uploadToR2 (with progress) → triggerProcessing → watchMediaDoc.
 *
 * @returns {{ upload: Function, uploading: boolean, progress: number, error: Error|null }}
 */
export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const unsubRef = useRef(null);

  const upload = useCallback(async (file, preset = 'gallery') => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const { uploadUrl, key, docId } = await getUploadUrl(
        file.name,
        preset,
        file.type,
      );
      await uploadToR2(uploadUrl, file, setProgress);
      await triggerProcessing(key, docId);

      return new Promise((resolve, reject) => {
        // Use `let` + guard so the callback is safe if watchMediaDoc fires
        // the callback synchronously (e.g. in tests) before the assignment
        // completes.
        let unsub;
        unsub = watchMediaDoc(docId, (mediaDoc) => {
          if (mediaDoc.status === 'ready') {
            if (unsub) unsub();
            unsubRef.current = null;
            setUploading(false);
            resolve(mediaDoc);
          } else if (mediaDoc.status === 'error') {
            if (unsub) unsub();
            unsubRef.current = null;
            const err = new Error(mediaDoc.errorMessage ?? 'Processing failed');
            setError(err);
            setUploading(false);
            reject(err);
          }
        });
        unsubRef.current = unsub;
      });
    } catch (e) {
      setError(e);
      setUploading(false);
      throw e;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  return { upload, uploading, progress, error };
}
