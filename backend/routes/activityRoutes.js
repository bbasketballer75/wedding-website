import express from 'express';
import getDbPromise from '../config/firestore-enhanced.js';
import performanceManager from '../services/performanceManager.js';
import wsManager from '../services/websocketManager.js';

const router = express.Router();

// GET /api/activity/recent - Get recent activities
router.get(
  '/recent',
  performanceManager.createCacheMiddleware({
    tier: 'fast',
    ttl: 60, // Cache for 1 minute
  }),
  async (req, res) => {
    try {
      const db = await getDbPromise();
      const activitiesRef = db.collection('activities');
      const snapshot = await activitiesRef.orderBy('timestamp', 'desc').limit(20).get();

      const activities = [];
      snapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch activities',
          details: error.message,
        },
      });
    }
  }
);

// POST /api/activity - Create new activity
router.post('/', performanceManager.rateLimiters.strict, async (req, res) => {
  try {
    const { type, description, metadata } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Type and description are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
      });
    }

    const activityData = {
      type,
      description,
      metadata: metadata || {},
      timestamp: new Date(),
      createdAt: new Date(),
    };

    const db = await getDbPromise();
    const docRef = await db.collection('activities').add(activityData);

    const newActivity = {
      id: docRef.id,
      ...activityData,
    };

    // Broadcast to WebSocket clients for real-time updates
    wsManager.broadcastActivity(newActivity);

    // Invalidate activity cache since we added new data
    performanceManager.invalidateCache('activities', 'fast');

    res.status(201).json({
      success: true,
      data: newActivity,
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create activity',
        details: error.message,
      },
    });
  }
});

export default router;
