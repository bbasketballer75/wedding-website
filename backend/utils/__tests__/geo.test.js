import { jest } from '@jest/globals';
import { getGeoLocation } from '../geo.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('getGeoLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns location data for valid IP', async () => {
    const mockResponse = {
      status: 'success',
      lat: 37.7749,
      lon: -122.4194,
      city: 'San Francisco',
      country: 'United States',
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getGeoLocation('8.8.8.8');

    expect(result).toEqual({
      lat: 37.7749,
      lon: -122.4194,
      city: 'San Francisco',
      country: 'United States',
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://ip-api.com/json/8.8.8.8?fields=status,message,country,city,lat,lon'
    );
  });

  it('returns default location for local IPv4', async () => {
    const mockResponse = {
      status: 'success',
      lat: 43.6532,
      lon: -79.3832,
      city: 'Toronto',
      country: 'Canada',
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getGeoLocation('127.0.0.1');

    expect(result.city).toBeDefined();
    expect(result.country).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://ip-api.com/json/24.48.0.1?fields=status,message,country,city,lat,lon'
    );
  });

  it('returns default location for local IPv6', async () => {
    const mockResponse = {
      status: 'success',
      lat: 43.6532,
      lon: -79.3832,
      city: 'Toronto',
      country: 'Canada',
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getGeoLocation('::1');

    expect(result.city).toBeDefined();
    expect(result.country).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://ip-api.com/json/24.48.0.1?fields=status,message,country,city,lat,lon'
    );
  });

  it('returns default location when API returns fail status', async () => {
    const mockResponse = {
      status: 'fail',
      message: 'invalid query',
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getGeoLocation('invalid-ip');

    expect(result).toEqual({
      lat: 0,
      lon: 0,
      city: 'Unknown',
      country: 'Unknown',
    });
  });

  it('returns error location for fetch failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getGeoLocation('8.8.8.8');

    expect(result).toEqual({
      lat: 0,
      lon: 0,
      city: 'Error',
      country: 'Error',
    });
  });

  it('returns error location for JSON parsing failure', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
    });

    const result = await getGeoLocation('8.8.8.8');

    expect(result).toEqual({
      lat: 0,
      lon: 0,
      city: 'Error',
      country: 'Error',
    });
  });
});
