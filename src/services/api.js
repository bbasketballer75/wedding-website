import axios from 'axios';

/**
 * Determine the API URL based on environment
 * @returns {string} The API URL for requests
 */
const getApiUrl = () => {
  // During build time (SSG), API_URL might not be available
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // During runtime in browser, check for Next.js public env vars
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Check if we're in local development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Return local backend URL for development
      return `http://localhost:3002/api`;
    }
  }

  // Fallback for production
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  // During build time, return empty string to avoid build errors
  console.warn('API_URL not available during build time - this is expected for SSG');
  return '';
};

const API_URL = getApiUrl();

// Helper function to check if API is available
const checkApiAvailable = () => {
  if (!API_URL) {
    return Promise.reject(new Error('API not available during build time'));
  }
  return true;
};

export const getAlbumMedia = () => {
  checkApiAvailable();
  return axios.get(`${API_URL}/album`, {
    timeout: 10000, // Add timeout for security
  });
};

export const uploadMedia = (formData) => {
  checkApiAvailable();
  return axios.post(`${API_URL}/album/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // Longer timeout for uploads
  });
};

export const getGuestbookEntries = () => {
  checkApiAvailable();
  return axios.get(`${API_URL}/guestbook`, {
    timeout: 10000,
  });
};

export const createGuestbookEntry = (entry) => {
  if (!entry || typeof entry !== 'object') {
    return Promise.reject(new Error('Valid entry object is required'));
  }
  if (!entry.name || typeof entry.name !== 'string' || entry.name.trim().length === 0) {
    return Promise.reject(new Error('Name is required'));
  }
  if (!entry.message || typeof entry.message !== 'string' || entry.message.trim().length === 0) {
    return Promise.reject(new Error('Message is required'));
  }
  // Sanitize input
  const sanitizedEntry = {
    name: entry.name.trim().substring(0, 100), // Limit name length
    message: entry.message.trim().substring(0, 1000), // Limit message length
    ...entry,
  };
  checkApiAvailable();
  return axios.post(`${API_URL}/guestbook`, sanitizedEntry, {
    timeout: 10000,
  });
};

export const getMapLocations = () => {
  checkApiAvailable();
  return axios.get(`${API_URL}/map/locations`, {
    timeout: 10000,
  });
};

export const logVisit = () => {
  if (!API_URL) {
    // Silently fail during build time
    return Promise.resolve();
  }
  return axios.post(
    `${API_URL}/map/log-visit`,
    {},
    {
      timeout: 5000,
    }
  );
};

export const getAllAlbumMedia = (adminKey) => {
  if (!adminKey || typeof adminKey !== 'string') {
    return Promise.reject(new Error('Valid admin key is required'));
  }
  checkApiAvailable();
  return axios.get(`${API_URL}/album/all`, {
    headers: { Authorization: `Bearer ${adminKey}` },
    timeout: 10000, // Add timeout for security
  });
};

export const moderateMedia = (photoId, isApproved, adminKey) => {
  if (!adminKey || typeof adminKey !== 'string') {
    return Promise.reject(new Error('Valid admin key is required'));
  }
  if (!photoId || typeof photoId !== 'string') {
    return Promise.reject(new Error('Valid photo ID is required'));
  }
  if (typeof isApproved !== 'boolean') {
    return Promise.reject(new Error('isApproved must be a boolean'));
  }
  checkApiAvailable();
  return axios.post(
    `${API_URL}/album/moderate`,
    { photoId, isApproved },
    {
      headers: { Authorization: `Bearer ${adminKey}` },
      timeout: 10000, // Add timeout for security
    }
  );
};

// ... other api functions can be added here
