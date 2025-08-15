/**
 * Guest memories routes for wedding website
 * Handles submission, moderation, and display of guest memories and stories
 */

import express from 'express';
import { body, validationResult, param, query } from 'express-validator';
import getDbPromise from '../config/firestore.js';
import { protectAdmin as requireAdminAuth } from '../middleware/authMiddleware.js';
import getCloudStorage from '../services/cloudStorage.js';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import sharp from 'sharp';

const router = express.Router();

// Rate limiting for memory submissions
const memoryRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 memories per hour per IP
  message: {
    success: false,
    error: {
      message: 'Too many memory submissions. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5, // Max 5 files per submission
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  },
});

// Validation schemas
const memoryValidation = [
  body('guestName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Guest name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s\-'.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('relationshipToBride')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Relationship to bride must be less than 100 characters'),
  body('relationshipToGroom')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Relationship to groom must be less than 100 characters'),
  body('memoryTitle')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Memory title must be between 1 and 200 characters'),
  body('memoryText')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Memory text must be between 10 and 2000 characters'),
  body('favoriteMemoryType')
    .isIn([
      'wedding_day',
      'relationship_story',
      'funny_moment',
      'heartfelt_message',
      'advice',
      'photo_story',
      'other',
    ])
    .withMessage('Invalid memory type'),
  body('sharePublicly').isBoolean().withMessage('Share publicly must be a boolean value'),
];

/**
 * POST /api/memories
 * Submit a new guest memory
 */
router.post('/', memoryRateLimit, upload.array('photos', 5), memoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid memory data',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
    }

    // Extract basic guest information
    const { guestName, email } = req.body;

    // Extract relationship information
    const { relationshipToBride, relationshipToGroom } = req.body;

    // Extract memory content
    const { memoryTitle, memoryText, favoriteMemoryType, sharePublicly } = req.body;

    // Process uploaded photos
    const photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          // Optimize image
          const optimizedBuffer = await sharp(file.buffer)
            .resize(1200, 1200, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .jpeg({
              quality: 85,
              progressive: true,
            })
            .toBuffer();

          // Generate unique filename
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const filename = `memories/${timestamp}-${randomString}.jpg`;

          // Upload to Google Cloud Storage
          const photoUrl = await getCloudStorage().uploadToGCS(optimizedBuffer, filename);
          photoUrls.push({
            url: photoUrl,
            filename: filename,
            originalName: file.originalname,
          });
        } catch (uploadError) {
          console.error('Error processing photo:', uploadError);
          // Continue processing other photos, but log the error
        }
      }
    }

    // Create memory document
    const memoryData = {
      guestName: guestName.trim(),
      email: email.trim().toLowerCase(),
      relationshipToBride: relationshipToBride?.trim() || '',
      relationshipToGroom: relationshipToGroom?.trim() || '',
      memoryTitle: memoryTitle.trim(),
      memoryText: memoryText.trim(),
      favoriteMemoryType,
      sharePublicly: sharePublicly === 'true' || sharePublicly === true,
      photos: photoUrls,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || null,
      featured: false,
    };

    // Save to Firestore
    const db = await getDbPromise();
    const memoryRef = await db.collection('guestMemories').add(memoryData);

    res.status(201).json({
      success: true,
      data: {
        id: memoryRef.id,
        ...memoryData,
        createdAt: memoryData.createdAt.toISOString(),
        updatedAt: memoryData.updatedAt.toISOString(),
      },
      message: 'Memory submitted successfully and is pending approval',
    });
  } catch (error) {
    console.error('Error submitting memory:', error);

    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File size too large. Maximum 10MB per file.',
          code: 'FILE_SIZE_ERROR',
        },
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Too many files. Maximum 5 photos per submission.',
          code: 'FILE_COUNT_ERROR',
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit memory',
        code: 'SUBMISSION_ERROR',
      },
    });
  }
});

/**
 * GET /api/memories
 * Get approved memories for public display
 */
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('type')
    .optional()
    .isIn([
      'wedding_day',
      'relationship_story',
      'funny_moment',
      'heartfelt_message',
      'advice',
      'photo_story',
      'other',
    ])
    .withMessage('Invalid memory type'),
  query('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid query parameters',
            code: 'VALIDATION_ERROR',
            details: errors.array(),
          },
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const type = req.query.type;
      const featured = req.query.featured === 'true';
      const offset = (page - 1) * limit;

      // Build query
      let memoriesQuery = db
        .collection('guestMemories')
        .where('status', '==', 'approved')
        .where('sharePublicly', '==', true);

      if (type) {
        memoriesQuery = memoriesQuery.where('favoriteMemoryType', '==', type);
      }

      if (featured) {
        memoriesQuery = memoriesQuery.where('featured', '==', true);
      }

      // Execute query with pagination
      const snapshot = await memoriesQuery
        .orderBy('createdAt', 'desc')
        .offset(offset)
        .limit(limit)
        .get();

      const memories = [];
      snapshot.forEach((doc) => {
        const memoryData = doc.data();
        memories.push({
          id: doc.id,
          guestName: memoryData.guestName,
          relationshipToBride: memoryData.relationshipToBride,
          relationshipToGroom: memoryData.relationshipToGroom,
          memoryTitle: memoryData.memoryTitle,
          memoryText: memoryData.memoryText,
          favoriteMemoryType: memoryData.favoriteMemoryType,
          photos: memoryData.photos || [],
          featured: memoryData.featured || false,
          createdAt: memoryData.createdAt?.toDate?.() || memoryData.createdAt,
        });
      });

      // Get total count for pagination
      const countSnapshot = await memoriesQuery.get();
      const totalCount = countSnapshot.size;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          memories,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching memories:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch memories',
          code: 'FETCH_ERROR',
        },
      });
    }
  }
);

/**
 * GET /api/memories/pending
 * Get pending memories for admin review
 */
router.get('/pending', requireAdminAuth, async (req, res) => {
  try {
    const pendingMemoriesRef = db.collection('guestMemories').where('status', '==', 'pending');
    const snapshot = await pendingMemoriesRef.get();

    const memories = [];
    snapshot.forEach((doc) => {
      const memoryData = doc.data();
      memories.push({
        id: doc.id,
        ...memoryData,
        createdAt: memoryData.createdAt?.toDate?.() || memoryData.createdAt,
        updatedAt: memoryData.updatedAt?.toDate?.() || memoryData.updatedAt,
      });
    });

    res.json({
      success: true,
      data: {
        memories: memories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      },
    });
  } catch (error) {
    console.error('Error fetching pending memories:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch pending memories',
        code: 'FETCH_ERROR',
      },
    });
  }
});

/**
 * PATCH /api/memories/:id/status
 * Update memory status (admin only)
 */
router.patch(
  '/:id/status',
  requireAdminAuth,
  param('id').trim().isLength({ min: 1 }).withMessage('Memory ID is required'),
  body('status')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved, or rejected'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid parameters',
            code: 'VALIDATION_ERROR',
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const { status, featured } = req.body;

      const memoryRef = db.collection('guestMemories').doc(id);
      const memoryDoc = await memoryRef.get();

      if (!memoryDoc.exists) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Memory not found',
            code: 'MEMORY_NOT_FOUND',
          },
        });
      }

      const updateData = {
        status,
        updatedAt: new Date(),
        reviewedBy: 'admin', // Could be enhanced to track specific admin
      };

      if (featured !== undefined) {
        updateData.featured = featured;
      }

      await memoryRef.update(updateData);

      res.json({
        success: true,
        data: {
          id,
          status,
          featured: featured !== undefined ? featured : memoryDoc.data().featured,
          updatedAt: updateData.updatedAt.toISOString(),
        },
        message: `Memory status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating memory status:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update memory status',
          code: 'UPDATE_ERROR',
        },
      });
    }
  }
);

/**
 * DELETE /api/memories/:id
 * Delete a memory (admin only)
 */
router.delete(
  '/:id',
  requireAdminAuth,
  param('id').trim().isLength({ min: 1 }).withMessage('Memory ID is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid memory ID',
            code: 'VALIDATION_ERROR',
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const memoryRef = db.collection('guestMemories').doc(id);
      const memoryDoc = await memoryRef.get();

      if (!memoryDoc.exists) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Memory not found',
            code: 'MEMORY_NOT_FOUND',
          },
        });
      }

      await memoryRef.delete();

      res.json({
        success: true,
        message: 'Memory deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting memory:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to delete memory',
          code: 'DELETE_ERROR',
        },
      });
    }
  }
);

/**
 * GET /api/memories/stats
 * Get memory statistics (admin only)
 */
router.get('/stats', requireAdminAuth, async (req, res) => {
  try {
    const [pendingSnapshot, approvedSnapshot, rejectedSnapshot] = await Promise.all([
      db.collection('guestMemories').where('status', '==', 'pending').get(),
      db.collection('guestMemories').where('status', '==', 'approved').get(),
      db.collection('guestMemories').where('status', '==', 'rejected').get(),
    ]);

    const stats = {
      total: pendingSnapshot.size + approvedSnapshot.size + rejectedSnapshot.size,
      pending: pendingSnapshot.size,
      approved: approvedSnapshot.size,
      rejected: rejectedSnapshot.size,
      publicMemories: 0,
      privateMemories: 0,
      featuredMemories: 0,
    };

    // Count public/private and featured memories from approved ones
    approvedSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.sharePublicly) {
        stats.publicMemories++;
      } else {
        stats.privateMemories++;
      }
      if (data.featured) {
        stats.featuredMemories++;
      }
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching memory stats:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch memory statistics',
        code: 'STATS_ERROR',
      },
    });
  }
});

export default router;
