// Jest mock setup for backend tests
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(),
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      where: jest.fn(() => ({
        get: jest.fn(),
      })),
      orderBy: jest.fn(() => ({
        get: jest.fn(),
      })),
      limit: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  })),
}));

jest.mock('../config/gcp-credentials.js', () => ({
  getGoogleCredentials: jest.fn(() => null),
}));

jest.mock('../services/cloudStorage.js', () => ({
  uploadToGCS: jest.fn(),
  deleteFromGCS: jest.fn(),
}));
