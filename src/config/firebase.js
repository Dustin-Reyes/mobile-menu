/**
 * Firebase CMS Configuration
 *
 * This file handles Firebase initialization and provides configuration
 * for the optional CMS functionality. The CMS only activates when
 * properly configured via environment variables.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

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

// Check if Firebase is properly configured
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

    console.log('🔥 Firebase CMS initialized successfully');
  } catch (error) {
    console.error('🔥 Firebase initialization failed:', error);
  }
} else {
  console.log('📝 Firebase CMS disabled - using local content');
}

// Export Firebase services (null if not configured)
export { app, db, storage, auth };

// Export configuration for reference
export { firebaseConfig };

// CMS Configuration
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
