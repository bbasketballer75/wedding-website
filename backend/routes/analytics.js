import express from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import dbPromise from '../config/firestore.js';

const router = express.Router();

/**
 * @swagger
 * /api/analytics:
 *   post:
 *     summary: Log analytics event
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event type
 *               data:
 *                 type: object
 *                 description: Event data
 *               userAgent:
 *                 type: string
 *                 description: User agent string
 *               timestamp:
 *                 type: number
 *                 description: Event timestamp
 *     responses:
 *       200:
 *         description: Analytics event logged successfully
 *       400:
 *         description: Invalid request data
 */
router.post(
  '/',
  [
    body('event').notEmpty().withMessage('Event type is required'),
    body('data').isObject().withMessage('Event data must be an object'),
    body('timestamp').isNumeric().withMessage('Timestamp must be a number'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array(),
        },
      });
    }

    const { event, data, userAgent, timestamp } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    try {
      const db = await dbPromise;
      const analyticsCollection = db.collection('analytics');

      await analyticsCollection.add({
        event,
        data,
        userAgent,
        timestamp: new Date(timestamp),
        ip: clientIp,
        createdAt: new Date(),
      });

      res.json({
        success: true,
        message: 'Analytics event logged successfully',
      });
    } catch (error) {
      console.error('Analytics logging error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to log analytics event',
        },
      });
    }
  })
);

/**
 * @swagger
 * /api/analytics/performance-metrics:
 *   post:
 *     summary: Log performance metrics
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metrics:
 *                 type: object
 *                 description: Performance metrics data
 *               timestamp:
 *                 type: number
 *                 description: Metrics timestamp
 *               userAgent:
 *                 type: string
 *                 description: User agent string
 *               url:
 *                 type: string
 *                 description: Page URL
 *     responses:
 *       200:
 *         description: Performance metrics logged successfully
 */
router.post(
  '/performance-metrics',
  [
    body('metrics').isObject().withMessage('Metrics must be an object'),
    body('timestamp').isNumeric().withMessage('Timestamp must be a number'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array(),
        },
      });
    }

    const { metrics, timestamp, userAgent, url } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    try {
      const db = await dbPromise;
      const analyticsCollection = db.collection('analytics');

      await analyticsCollection.add({
        event: 'performance_metrics',
        data: {
          metrics,
          url,
        },
        userAgent,
        timestamp: new Date(timestamp),
        ip: clientIp,
        createdAt: new Date(),
      });

      res.json({
        success: true,
        message: 'Performance metrics logged successfully',
      });
    } catch (error) {
      console.error('Performance metrics logging error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to log performance metrics',
        },
      });
    }
  })
);

/**
 * @swagger
 * /api/analytics/performance-alerts:
 *   post:
 *     summary: Log performance alerts
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Alert type
 *               data:
 *                 type: object
 *                 description: Alert data
 *               severity:
 *                 type: string
 *                 description: Alert severity level
 *               timestamp:
 *                 type: number
 *                 description: Alert timestamp
 *               url:
 *                 type: string
 *                 description: Page URL where alert occurred
 *     responses:
 *       200:
 *         description: Performance alert logged successfully
 */
router.post(
  '/performance-alerts',
  [
    body('type').notEmpty().withMessage('Alert type is required'),
    body('data').isObject().withMessage('Alert data must be an object'),
    body('severity').isIn(['low', 'medium', 'high']).withMessage('Invalid severity level'),
    body('timestamp').isNumeric().withMessage('Timestamp must be a number'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array(),
        },
      });
    }

    const { type, data, severity, timestamp, url } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    try {
      const db = await dbPromise;
      const analyticsCollection = db.collection('analytics');

      await analyticsCollection.add({
        event: 'performance_alert',
        data: {
          type,
          data,
          severity,
          url,
        },
        timestamp: new Date(timestamp),
        ip: clientIp,
        createdAt: new Date(),
      });

      // For high-severity alerts, you could send notifications here
      if (severity === 'high') {
        console.warn(`High-severity performance alert: ${type}`, data);
        // Future enhancement: Integrate with notification services (Slack, email, SMS)
        // This could include webhook integrations for real-time monitoring alerts
      }

      res.json({
        success: true,
        message: 'Performance alert logged successfully',
      });
    } catch (error) {
      console.error('Performance alert logging error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to log performance alert',
        },
      });
    }
  })
);

export default router;
