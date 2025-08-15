/**
 * Fetches geolocation data for a given IP address using the ip-api.com service.
 * @param {string} ip The IP address to look up.
 * @returns {Promise<object>} A promise that resolves to an object with lat, lon, city, and country.
 */
const getGeoLocation = async (ip) => {
  // For local development, '::1' or '127.0.0.1' are common and won't work with the API.
  // We'll use a sample IP for these cases.
  const effectiveIp = ['::1', '127.0.0.1'].includes(ip) ? '24.48.0.1' : ip;

  try {
    const response = await fetch(
      `http://ip-api.com/json/${effectiveIp}?fields=status,message,country,city,lat,lon`
    );
    const data = await response.json();

    if (data.status === 'fail') {
      // ...existing code...
      // Return a default or null location on failure
      return { lat: 0, lon: 0, city: 'Unknown', country: 'Unknown' };
    }

    return { lat: data.lat, lon: data.lon, city: data.city, country: data.country };
  } catch {
    // ...existing code...
    return { lat: 0, lon: 0, city: 'Error', country: 'Error' };
  }
};

export { getGeoLocation };
