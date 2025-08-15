import fs from 'fs';
import path from 'path';

/**
 * Helper to decode base64-encoded Google Cloud service account credentials
 * from environment variables for production deployment.
 * Falls back to local file for development.
 */

/**
 * Get Google Cloud credentials from environment variables.
 * In development: reads from local JSON file
 * In production: decodes from base64 environment variable
 */
export function getGoogleCredentials() {
  // Try local file paths first
  const fileCredentials = tryLocalCredentialFiles();
  if (fileCredentials) {
    return fileCredentials;
  }

  // Try environment variables
  const envCredentials = tryEnvironmentVariables();
  if (envCredentials) {
    return envCredentials;
  }

  // Try base64 fallback
  const base64Credentials = tryBase64Credentials();
  if (base64Credentials) {
    return base64Credentials;
  }

  console.error('Could not load valid GCS credentials from any known path.');
  throw new Error('No valid Google Cloud credentials found');
}

/**
 * Try to load credentials from local JSON files
 */
function tryLocalCredentialFiles() {
  const possiblePaths = [
    path.join(process.cwd(), 'backend', 'config', 'gcs-key.json'),
    path.join(process.cwd(), 'config', 'gcs-key.json'),
  ];

  for (const credPath of possiblePaths) {
    const credentials = readCredentialFile(credPath);
    if (credentials) {
      return credentials;
    }
  }
  return null;
}

/**
 * Read and validate a credential file
 */
function readCredentialFile(credPath) {
  try {
    if (!fs.existsSync(credPath)) {
      return null;
    }

    const credentials = JSON.parse(fs.readFileSync(credPath, 'utf-8'));

    if (isDummyCredentials(credentials)) {
      console.warn(
        `Found service account file at ${credPath}, but it contains placeholder credentials`
      );
      return null;
    }

    return credentials;
  } catch (error) {
    console.warn(`Failed to read credentials from ${credPath}:`, error.message);
    return null;
  }
}

/**
 * Try to construct credentials from individual environment variables
 */
function tryEnvironmentVariables() {
  const { GCP_PROJECT_ID, GCP_PRIVATE_KEY, GCP_CLIENT_EMAIL, GCP_CLIENT_ID } = process.env;

  if (!GCP_PROJECT_ID || !GCP_PRIVATE_KEY || !GCP_CLIENT_EMAIL) {
    return null;
  }

  try {
    return {
      type: 'service_account',
      project_id: GCP_PROJECT_ID,
      private_key: GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: GCP_CLIENT_EMAIL,
      client_id: GCP_CLIENT_ID || '',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(GCP_CLIENT_EMAIL)}`,
    };
  } catch (err) {
    console.error('Failed to construct GCP credentials from environment variables:', err);
    return null;
  }
}

/**
 * Try to decode credentials from base64 environment variable
 */
function tryBase64Credentials() {
  if (!process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64) {
    return null;
  }

  try {
    const decoded = Buffer.from(process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64, 'base64').toString(
      'utf8'
    );
    const credentials = JSON.parse(decoded);

    if (isDummyCredentials(credentials)) {
      throw new Error('Environment variable contains placeholder credentials');
    }

    return credentials;
  } catch (err) {
    console.error('Failed to decode GCP service account from base64:', err);
    throw new Error('Invalid GCP service account credentials');
  }
}

/**
 * Check if credentials contain dummy/placeholder values
 */
function isDummyCredentials(credentials) {
  return credentials.private_key && credentials.private_key.includes('DUMMY');
}

/**
 * Initialize Google Cloud credentials for firebase-admin
 * @param {Object} admin - Firebase admin instance
 */
export function initializeGoogleCloudCredentials(admin) {
  if (admin.apps.length > 0) {
    return; // Already initialized
  }

  const credentials = getGoogleCredentials();

  const config = {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'wedding-website-final',
  };

  // If we have decoded credentials, use them
  if (credentials) {
    config.credential = admin.credential.cert(credentials);
  } else {
    // In development, use the service account file path
    const serviceAccountPath = path.join(process.cwd(), 'config', 'gcp-service-account.json');
    config.credential = admin.credential.cert(serviceAccountPath);
  }

  admin.initializeApp(config);
  console.log('Firebase Admin initialized successfully');
}
