import express from 'express';
import geoip from 'geoip-lite';
import asyncHandler from '../utils/asyncHandler.js';
import dbPromise from '../config/firestore.js';

const router = express.Router();

/**
 * @swagger
 * /api/visitors/track:
 *   post:
 *     summary: Track visitor location
 *     tags: [Visitors]
 *     responses:
 *       200:
 *         description: Visitor tracked successfully
 */
router.post(
  '/track',
  asyncHandler(async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Get geographic information
    const geo = geoip.lookup(clientIp);

    const visitorData = {
      ip: clientIp,
      userAgent,
      timestamp: new Date(),
      country: geo?.country || 'Unknown',
      city: geo?.city || 'Unknown',
      latitude: geo?.ll?.[0] || 0,
      longitude: geo?.ll?.[1] || 0,
      timezone: geo?.timezone || 'Unknown',
    };

    try {
      const db = await dbPromise;
      const visitorsCollection = db.collection('visitors');

      await visitorsCollection.add(visitorData);

      res.json({
        success: true,
        message: 'Visitor tracked successfully',
        location: {
          country: visitorData.country,
          city: visitorData.city,
        },
      });
    } catch (error) {
      console.error('Visitor tracking error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to track visitor',
        },
      });
    }
  })
);

/**
 * @swagger
 * /api/visitors/realtime:
 *   get:
 *     summary: Get real-time visitor data
 *     tags: [Visitors]
 *     responses:
 *       200:
 *         description: Real-time visitor data
 */
router.get(
  '/realtime',
  asyncHandler(async (req, res) => {
    try {
      const db = await dbPromise;
      const visitorsCollection = db.collection('visitors');

      // Get visitors from last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const visitorsSnapshot = await visitorsCollection
        .where('timestamp', '>=', oneDayAgo)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();

      const visitors = [];
      visitorsSnapshot.forEach((doc) => {
        const data = doc.data();
        visitors.push({
          country: data.country,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: data.timestamp.toISOString(),
        });
      });

      // Calculate stats
      const totalVisitors = visitors.length;
      const activeVisitors = visitors.filter(
        (v) => Date.now() - new Date(v.timestamp).getTime() < 30 * 60 * 1000 // Last 30 minutes
      ).length;

      const uniqueCountries = [...new Set(visitors.map((v) => v.country))].length;

      // Calculate average session time (simplified)
      const averageSessionTime = 180000; // 3 minutes placeholder

      const stats = {
        totalVisitors,
        activeVisitors,
        countriesVisited: uniqueCountries,
        averageSessionTime,
      };

      res.json({
        success: true,
        visitors,
        stats,
      });
    } catch (error) {
      console.error('Real-time visitors error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch real-time visitor data',
        },
      });
    }
  })
);

export default router;
