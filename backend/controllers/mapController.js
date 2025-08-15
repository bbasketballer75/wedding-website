import VisitorLog from '../models/VisitorLog.firestore.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getGeoLocation } from '../utils/geo.js';

/**
 * @desc    Get all visitor locations
 * @route   GET /api/map/locations
 * @access  Public
 */
export const getLocations = asyncHandler(async (req, res) => {
  // Firestore: get all logs and deduplicate by city/country
  const logs = await VisitorLog.findAll();
  const unique = {};
  logs.forEach((log) => {
    const key = `${log.city}|${log.country}`;
    if (!unique[key]) {
      unique[key] = {
        city: log.city,
        country: log.country,
        lat: log.latitude,
        lon: log.longitude,
      };
    }
  });
  res.status(200).json(Object.values(unique));
});

/**
 * @desc    Log a new visitor
 * @route   POST /api/map/log-visit
 * @access  Public
 */
export const logVisit = asyncHandler(async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.ip;

  // Check if a visit from this IP has been logged in the last 24 hours.
  const oneDay = 24 * 60 * 60 * 1000;
  const logs = await VisitorLog.findByIP(ip);
  const recentVisit = logs.find((log) => new Date(log.timestamp).getTime() >= Date.now() - oneDay);

  if (recentVisit) {
    return res.status(200).json({ message: 'Visit already logged recently.' });
  }

  const { lat, lon, city, country } = await getGeoLocation(ip);

  if (country === 'Error' || country === 'Unknown') {
    return res.status(500).json({ message: 'Could not determine location.' });
  }

  const newVisit = new VisitorLog({
    ip_address: ip,
    latitude: lat,
    longitude: lon,
    city,
    country,
  });
  await newVisit.save();
  res.status(201).json(newVisit);
});
