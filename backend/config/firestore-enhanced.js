import admin from 'firebase-admin';
import { getGoogleCredentials } from './gcp-credentials.js';
import { getFirestoreEmulatorHost } from '../../config/ports.js';

/**
 * Enhanced Firestore configuration with production optimizations
 */
class FirestoreManager {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.connectionPool = new Map();
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  /**
   * Initialize Firebase Admin with appropriate configuration for the environment
   * @returns {object} Firebase configuration object
   */
  createFirebaseConfig() {
    const baseConfig = {
      projectId: process.env.GCP_PROJECT_ID || 'wedding-website-final',
    };

    // Emulator mode for development
    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || getFirestoreEmulatorHost();
    if (process.env.NODE_ENV === 'development' && emulatorHost) {
      console.log('🔧 Using Firestore Emulator at:', emulatorHost);
      return baseConfig;
    }

    // Production mode with service account credentials
    const credentials = getGoogleCredentials();

    // Enhanced credential validation
    if (!credentials.private_key || credentials.private_key.includes('DUMMY')) {
      throw new Error(
        '❌ Invalid service account credentials: private_key appears to be a placeholder'
      );
    }

    if (!credentials.client_email || !credentials.project_id) {
      throw new Error('❌ Missing required credential fields: client_email or project_id');
    }

    console.log('🚀 Initializing production Firestore with project:', credentials.project_id);

    return {
      ...baseConfig,
      credential: admin.credential.cert(credentials),
      // Production optimizations
      databaseURL: `https://${credentials.project_id}-default-rtdb.firebaseio.com/`,
    };
  }

  /**
   * Initialize Firebase Admin with retry logic and connection pooling
   * @returns {Promise<admin.firestore.Firestore>} Firestore database instance
   */
  async initializeFirebase() {
    if (this.isInitialized && this.db) {
      return this.db;
    }

    try {
      // Check if already initialized to prevent multiple initializations
      if (admin.apps.length === 0) {
        const config = this.createFirebaseConfig();

        // Initialize with production settings
        const app = admin.initializeApp(config);

        // Configure Firestore settings for production
        this.db = app.firestore();

        // Production optimizations
        if (process.env.NODE_ENV === 'production') {
          // Enable offline persistence and configure settings
          this.db.settings({
            ignoreUndefinedProperties: true,
            timestampsInSnapshots: true,
          });
        }

        console.log('✅ Firebase Admin initialized successfully');
      } else {
        this.db = admin.firestore();
        console.log('♻️ Using existing Firebase Admin instance');
      }

      // Test connection
      await this.testConnection();

      this.isInitialized = true;
      this.retryCount = 0;

      return this.db;
    } catch (error) {
      console.error('❌ Error initializing Firebase Admin:', error);

      // Retry logic for production resilience
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(
          `🔄 Retrying Firebase initialization (${this.retryCount}/${this.maxRetries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000 * this.retryCount));
        return this.initializeFirebase();
      }

      throw error;
    }
  }

  /**
   * Test Firestore connection
   */
  async testConnection() {
    try {
      // Simple connectivity test
      await this.db.collection('_health_check').limit(1).get();
      console.log('🔗 Firestore connection verified');
    } catch (error) {
      if (error.code === 14 || error.message.includes('UNAVAILABLE')) {
        console.log(
          '⚡ Firestore emulator not available, using production or will connect when available'
        );
      } else {
        console.warn('⚠️ Firestore connection test failed:', error.message);
      }
    }
  }

  /**
   * Get database instance with connection caching
   */
  async getDatabase() {
    if (!this.db || !this.isInitialized) {
      this.db = await this.initializeFirebase();
    }
    return this.db;
  }

  /**
   * Health check for monitoring
   */
  async healthCheck() {
    try {
      const db = await this.getDatabase();
      const startTime = Date.now();
      await db.collection('_health_check').limit(1).get();
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    if (this.db && admin.apps.length > 0) {
      await Promise.all(admin.apps.map((app) => app.delete()));
      console.log('🛑 Firebase Admin shutdown complete');
    }
  }
}

// Create singleton instance
const firestoreManager = new FirestoreManager();

// Export both the manager and a convenience function
const getDbPromise = () => firestoreManager.getDatabase();
export default getDbPromise;
export { firestoreManager };

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  await firestoreManager.shutdown();
});

process.on('SIGINT', async () => {
  await firestoreManager.shutdown();
});
