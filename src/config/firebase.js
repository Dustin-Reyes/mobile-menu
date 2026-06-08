/**
 * Firebase CMS configuration and initialisation.
 *
 * Handles Firebase app initialisation and exports the Firestore, Storage, and
 * Auth service instances. All exports are `null` when Firebase is not
 * configured (i.e. the required `VITE_FIREBASE_*` env vars are absent or
 * `VITE_CMS_ENABLED` is not `'true'`).
 *
 * @module config/firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import globalErrorHandler from 'utils/errorHandler';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Returns whether Firebase has been fully configured via environment variables
 * and the CMS feature flag is enabled.
 *
 * @returns {boolean} `true` when `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`,
 *   and `VITE_CMS_ENABLED=true` are all present.
 */
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    import.meta.env.VITE_CMS_ENABLED === 'true'
  );
};

// Initialize Firebase app (only if configured)
let app = null;
let db = null;
let storage = null;
let auth = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🔥 Firebase CMS initialized successfully');
    }
  } catch (error) {
    globalErrorHandler.reportError(error, { context: 'firebase-init' });
  }
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('📝 Firebase CMS disabled - using local content');
}

// Export Firebase services (null if not configured)
export { app, db, storage, auth };

// Export configuration for reference
export { firebaseConfig };

/**
 * CMS runtime configuration object.
 *
 * Controls which Firebase collections are used, cache behaviour, and
 * optional CMS features (realtime updates, image uploads, versioning, drafts).
 *
 * @type {{
 *   enabled: boolean,
 *   provider: string,
 *   collections: Record<string, string>,
 *   cache: { ttl: number, maxSize: number },
 *   features: { realtimeUpdates: boolean, imageUploads: boolean, versioning: boolean, drafts: boolean }
 * }}
 */
export const CMS_CONFIG = {
  enabled: isFirebaseConfigured(),
  provider: 'firebase',
  collections: {
    pages: 'pages',
    posts: 'posts',
    settings: 'settings',
    navigation: 'navigation',
    i18n: 'i18n',
    media: 'media',
    users: 'users',
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 50, // max cached items
  },
  features: {
    realtimeUpdates: true,
    imageUploads: true,
    versioning: true,
    drafts: true,
  },
};

export default CMS_CONFIG;
