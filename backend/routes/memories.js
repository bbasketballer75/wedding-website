import express from 'express';
import winston from 'winston';
import GuestPhotoUploadService from '../services/GuestPhotoUploadService.js';
import MemoryAnalyticsService from '../services/MemoryAnalyticsService.js';
import MemoryEmailService from '../services/MemoryEmailService.js';
const router = express.Router();

// Initialize services
const photoUploadService = new GuestPhotoUploadService();
const emailService = new MemoryEmailService();
const analyticsService = new MemoryAnalyticsService();

// POST /api/memories/guestbook - Submit guestbook entry with email automation
router.post('/guestbook', async (req, res) => {
  try {
    const { name, email, message, photo } = req.body;

    // Validate required fields
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name and message are required',
      });
    }

    // Create guestbook entry (integrate with your existing database logic)
    const guestEntry = {
      id: `guestbook_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      name,
      email,
      message,
      photo,
      timestamp: new Date(),
      approved: true, // Auto-approve for post-wedding site
    };

    // Track analytics
    await analyticsService.trackGuestbookEntry(guestEntry);

    // Send thank you email if email provided
    if (email) {
      const emailResult = await emailService.sendGuestbookThankYou(guestEntry);
      winston.info(`Thank you email sent to ${email}: ${emailResult.success}`);
    }

    res.json({
      success: true,
      message: 'Thank you for your beautiful memory!',
      entry: guestEntry,
      emailSent: !!email,
    });
  } catch (error) {
    winston.error('Error processing guestbook entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save your memory. Please try again.',
    });
  }
});

// POST /api/memories/upload - Guest photo upload
router.post('/upload', photoUploadService.upload.array('photos', 10), async (req, res) => {
  try {
    const { uploaderName, uploaderEmail, uploaderMessage } = req.body;

    if (!uploaderName || !req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Name and at least one photo are required',
      });
    }

    const uploaderInfo = {
      name: uploaderName,
      email: uploaderEmail,
      message: uploaderMessage,
    };

    // Process uploads
    const uploadResults = await photoUploadService.processGuestUpload(req.files, uploaderInfo);

    // Track analytics
    await analyticsService.trackPhotoUpload({
      id: `upload_${Date.now()}`,
      uploaderName,
      uploaderEmail,
      photoCount: req.files.length,
      status: process.env.GUEST_UPLOAD_REQUIRE_APPROVAL === 'true' ? 'pending' : 'approved',
    });

    const successCount = uploadResults.filter((r) => !r.error).length;
    const errorCount = uploadResults.filter((r) => r.error).length;

    const photoText = successCount !== 1 ? 's' : '';
    const errorText = errorCount > 0 ? ` (${errorCount} failed)` : '';
    const message = `Successfully uploaded ${successCount} photo${photoText}${errorText}`;

    res.json({
      success: true,
      message,
      results: uploadResults,
      requiresApproval: process.env.GUEST_UPLOAD_REQUIRE_APPROVAL === 'true',
    });
  } catch (error) {
    winston.error('Error processing photo upload:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload photos. Please try again.',
    });
  }
});

// GET /api/memories/analytics/popular-photos - Get most popular photos
router.get('/analytics/popular-photos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const popularPhotos = await analyticsService.getPopularPhotos(limit);

    res.json({
      success: true,
      popularPhotos,
      count: popularPhotos.length,
    });
  } catch (error) {
    winston.error('Error getting popular photos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve popular photos',
    });
  }
});

// GET /api/memories/analytics/engagement - Get guest engagement summary
router.get('/analytics/engagement', async (req, res) => {
  try {
    const engagement = await analyticsService.getGuestEngagementSummary();

    res.json({
      success: true,
      engagement,
    });
  } catch (error) {
    winston.error('Error getting engagement summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve engagement data',
    });
  }
});

// GET /api/memories/analytics/daily - Get daily analytics report
router.get('/analytics/daily', async (req, res) => {
  try {
    const date = req.query.date;
    const report = await analyticsService.getDailyReport(date);

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    winston.error('Error getting daily report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve daily report',
    });
  }
});

// POST /api/memories/track-view - Track photo view
router.post('/track-view', async (req, res) => {
  try {
    const { photoId } = req.body;
    const visitorInfo = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      sessionId: req.sessionID,
    };

    const result = await analyticsService.trackPhotoView(photoId, visitorInfo);

    res.json(result);
  } catch (error) {
    winston.error('Error tracking photo view:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track view',
    });
  }
});

// GET /api/memories/guest-uploads - Get guest uploads (admin only)
router.get('/guest-uploads', async (req, res) => {
  try {
    // Check admin authentication (implement your auth logic)
    const isAdmin = req.headers.authorization === `Bearer ${process.env.ADMIN_KEY}`;
    if (!isAdmin) {
      return res.status(401).json({
        success: false,
        error: 'Admin authentication required',
      });
    }

    const status = req.query.status || 'all';
    const uploads = await photoUploadService.getGuestUploads(status);

    res.json({
      success: true,
      uploads,
      count: uploads.length,
    });
  } catch (error) {
    winston.error('Error getting guest uploads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve guest uploads',
    });
  }
});

// POST /api/memories/approve-photo/:photoId - Approve guest photo (admin only)
router.post('/approve-photo/:photoId', async (req, res) => {
  try {
    // Check admin authentication
    const isAdmin = req.headers.authorization === `Bearer ${process.env.ADMIN_KEY}`;
    if (!isAdmin) {
      return res.status(401).json({
        success: false,
        error: 'Admin authentication required',
      });
    }

    const { photoId } = req.params;
    const adminInfo = {
      adminName: req.body.adminName || 'Admin',
      approvedAt: new Date(),
    };

    const result = await photoUploadService.approveGuestPhoto(photoId, adminInfo);

    res.json({
      success: true,
      message: 'Photo approved successfully',
      result,
    });
  } catch (error) {
    winston.error('Error approving photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve photo',
    });
  }
});

// POST /api/memories/send-anniversary-email - Send anniversary emails (admin only)
router.post('/send-anniversary-email', async (req, res) => {
  try {
    // Check admin authentication
    const isAdmin = req.headers.authorization === `Bearer ${process.env.ADMIN_KEY}`;
    if (!isAdmin) {
      return res.status(401).json({
        success: false,
        error: 'Admin authentication required',
      });
    }

    const { recipients, anniversaryData } = req.body;
    const results = [];

    for (const recipient of recipients) {
      try {
        const result = await emailService.sendAnniversaryMemory(recipient, anniversaryData);
        results.push({ email: recipient.email, success: result.success });
      } catch (error) {
        results.push({ email: recipient.email, success: false, error: error.message });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    res.json({
      success: true,
      message: `Anniversary emails sent to ${successCount}/${recipients.length} recipients`,
      results,
    });
  } catch (error) {
    winston.error('Error sending anniversary emails:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send anniversary emails',
    });
  }
});

export default router;
