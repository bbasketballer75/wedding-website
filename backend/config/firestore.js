import admin from 'firebase-admin';
import { getGoogleCredentials } from './gcp-credentials.js';
import { getFirestoreEmulatorHost } from '../../config/ports.js';

/**
 * Initialize Firebase Admin with appropriate configuration for the environment
 * @returns {object} Firebase configuration object
 */
function createFirebaseConfig() {
  const baseConfig = {
    projectId: 'wedding-website-final',
  };

  // Emulator mode for development
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || getFirestoreEmulatorHost();
  if (process.env.NODE_ENV === 'development' && emulatorHost) {
    console.log('Using Firestore Emulator at:', emulatorHost);
    return baseConfig;
  }

  // Production mode with service account credentials
  const credentials = getGoogleCredentials();
  if (!credentials.private_key || credentials.private_key.includes('DUMMY')) {
    throw new Error('Invalid service account credentials: private_key appears to be a placeholder');
  }

  return {
    ...baseConfig,
    credential: admin.credential.cert(credentials),
  };
}

/**
 * Handle credential errors with helpful development guidance
 * @param {Error} credError - The credential error to handle
 */
function handleCredentialError(credError) {
  console.error('Failed to load Google Cloud credentials:', credError.message);

  if (process.env.NODE_ENV === 'development') {
    console.log('💡 For local development, you can:');
    console.log(
      '   1. Set up Firebase emulator: npm install -g firebase-tools && firebase emulators:start --only firestore'
    );
    console.log('   2. Set FIRESTORE_EMULATOR_HOST=localhost:8080 environment variable');
    console.log(
      '   3. Or provide valid service account credentials in backend/config/gcs-key.json'
    );
    throw new Error('No valid Firebase credentials for development. See suggestions above.');
  }

  throw credError;
}

/**
 * Initialize Firebase Admin if not already initialized
 * @returns {Promise<admin.firestore.Firestore>} Firestore instance
 */
async function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  try {
    let config;

    try {
      config = createFirebaseConfig();
    } catch (credError) {
      handleCredentialError(credError);
    }

    admin.initializeApp(config);

    const logMessage = process.env.FIRESTORE_EMULATOR_HOST
      ? 'Firebase Admin initialized with emulator'
      : 'Firebase Admin initialized successfully with service account';
    console.log(logMessage);

    return admin.firestore();
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

// Create the singleton promise for database connection
let dbPromise = null;

function getDbPromise() {
  if (!dbPromise) {
    dbPromise = initializeFirebase();
  }
  return dbPromise;
}

export default getDbPromise;
