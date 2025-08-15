import axios from 'axios';
import { vi } from 'vitest';
import * as api from '../api.js';

// Mock axios for Vitest
vi.mock('axios');

// Helper to mock axios responses
const mockAxiosResponse = (data, status = 200) => {
  return Promise.resolve({ data, status });
};

beforeEach(() => {
  vi.clearAllMocks();
});

// Mock GET requests
vi.mocked(axios.get).mockImplementation((url) => {
  if (url.includes('/api/map/locations')) {
    return mockAxiosResponse([{ id: 1, name: 'Venue' }]);
  }
  if (url.includes('/api/album')) {
    return mockAxiosResponse([{ id: 1, url: 'photo.jpg' }]);
  }
  if (url.includes('/api/guestbook')) {
    return mockAxiosResponse([{ id: 1, name: 'Test', message: 'Hello' }]);
  }
  return mockAxiosResponse({});
});

// Mock POST requests
vi.mocked(axios.post).mockImplementation((url, data) => {
  if (url.includes('/api/album/upload')) {
    return mockAxiosResponse({ success: true });
  }
  if (url.includes('/api/guestbook')) {
    return mockAxiosResponse({ id: 2, ...(typeof data === 'string' ? JSON.parse(data) : data) });
  }
  if (url.includes('/api/album/moderate')) {
    return mockAxiosResponse({ success: true });
  }
  if (url.includes('/api/map/log-visit')) {
    return mockAxiosResponse({ success: true });
  }
  return mockAxiosResponse({});
});

describe('api service', () => {
  it('getAlbumMedia returns a promise', () => {
    const result = api.getAlbumMedia();
    expect(result).toBeInstanceOf(Promise);
  });

  it('uploadMedia returns a promise', () => {
    const result = api.uploadMedia(new FormData());
    expect(result).toBeInstanceOf(Promise);
  });

  it('getGuestbookEntries returns a promise', () => {
    const result = api.getGuestbookEntries();
    expect(result).toBeInstanceOf(Promise);
  });

  it('createGuestbookEntry returns a promise', () => {
    const result = api.createGuestbookEntry({ name: 'Test', message: 'Hello' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('getMapLocations returns a promise', () => {
    const result = api.getMapLocations();
    expect(result).toBeInstanceOf(Promise);
  });

  it('logVisit returns a promise', () => {
    const result = api.logVisit();
    expect(result).toBeInstanceOf(Promise);
  });

  it('getAllAlbumMedia returns a promise', () => {
    const result = api.getAllAlbumMedia('test-key');
    expect(result).toBeInstanceOf(Promise);
  });

  it('moderateMedia returns a promise', () => {
    const result = api.moderateMedia('photo-id', true, 'test-key');
    expect(result).toBeInstanceOf(Promise);
  });
});
