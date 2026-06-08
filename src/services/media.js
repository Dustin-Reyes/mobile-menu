/**
 * Client-side media service for image upload and management.
 *
 * Wraps the three Netlify functions (get-upload-url, process-image-background,
 * delete-media) and Firestore media collection queries. Handles authentication
 * header injection, stale pending doc cleanup, and upload progress via XHR.
 *
 * @module services/media
 */

import { auth, db } from 'config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import globalErrorHandler from 'utils/errorHandler';

const ONE_HOUR_MS = 60 * 60 * 1000;

async function getAuthHeader() {
  const user = auth?.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function callFunction(name, body) {
  const headers = await getAuthHeader();
  const res = await fetch(`/.netlify/functions/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `${name} failed`);
  return data;
}

/**
 * Requests a pre-signed upload URL from the get-upload-url Netlify function.
 *
 * @param {string} filename - Original file name.
 * @param {string} preset - Upload preset (e.g. 'gallery').
 * @param {string} mimeType - MIME type of the file.
 * @returns {Promise<{ uploadUrl: string, key: string, docId: string }>}
 */
export function getUploadUrl(filename, preset, mimeType) {
  return callFunction('get-upload-url', { filename, preset, mimeType });
}

/**
 * Uploads a file directly to Cloudflare R2 via a pre-signed PUT URL.
 *
 * @param {string} uploadUrl - Pre-signed R2 PUT URL.
 * @param {File} file - The file to upload.
 * @param {(percent: number) => void} [onProgress] - Optional progress callback.
 * @returns {Promise<void>}
 */
export function uploadToR2(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`R2 upload failed: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('R2 upload network error'));
    xhr.send(file);
  });
}

/**
 * Triggers background image processing via the process-image-background function.
 *
 * @param {string} key - R2 object key for the raw upload.
 * @param {string} docId - Firestore document ID for the media record.
 * @returns {Promise<object>}
 */
export function triggerProcessing(key, docId) {
  return callFunction('process-image-background', { key, docId });
}

/**
 * Deletes a media item via the delete-media Netlify function.
 *
 * @param {string} docId - Firestore document ID of the media record to delete.
 * @returns {Promise<object>}
 */
export function deleteMedia(docId) {
  return callFunction('delete-media', { docId });
}

/**
 * Fetches all media items for the current user, filtering out stale pending docs.
 *
 * Stale pending docs (older than one hour) are deleted from Firestore automatically.
 *
 * @returns {Promise<Array<{ id: string, [key: string]: unknown }>>}
 */
export async function getMediaLibrary() {
  if (!db) return [];
  const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const now = Date.now();
  const items = [];
  const staleIds = [];

  snap.forEach((d) => {
    const data = d.data();
    const isStale =
      data.status === 'pending' &&
      now - new Date(data.createdAt).getTime() > ONE_HOUR_MS;
    if (isStale) {
      staleIds.push(d.id);
    } else {
      items.push({ id: d.id, ...data });
    }
  });

  staleIds.forEach((id) =>
    deleteDoc(doc(db, 'media', id)).catch((e) =>
      globalErrorHandler.reportError(e, { action: 'clean-stale-media', id }),
    ),
  );

  return items;
}

/**
 * Subscribes to real-time updates for a single media document.
 *
 * @param {string} docId - Firestore document ID to watch.
 * @param {(data: { id: string, [key: string]: unknown }) => void} callback - Called on each update.
 * @returns {() => void} Unsubscribe function.
 */
export function watchMediaDoc(docId, callback) {
  if (!db) return () => {};
  const docRef = doc(db, 'media', docId);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}
