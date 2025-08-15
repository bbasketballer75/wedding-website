/**
 * Photo tagging routes for wedding website
 * Handles CRUD operations for photo tags and guest interactions
 */

import express from 'express';
import { body, validationResult, param } from 'express-validator';
import db from '../config/firestore.js';
import { protectAdmin as requireAdminAuth } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
const router = express.Router();

// Rate limiting for tag submissions
const tagRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 tags per window per IP
  message: {
    success: false,
    error: {
      message: 'Too many tag submissions. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

// Validation schemas
const tagValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s\-'.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('x').isFloat({ min: 0, max: 100 }).withMessage('X coordinate must be between 0 and 100'),
  body('y').isFloat({ min: 0, max: 100 }).withMessage('Y coordinate must be between 0 and 100'),
  body('photoId').trim().isLength({ min: 1 }).withMessage('Photo ID is required'),
];

const photoIdValidation = [
  param('photoId').trim().isLength({ min: 1 }).withMessage('Photo ID is required'),
];

/**
 * GET /api/photos/:photoId/tags
 * Get all tags for a specific photo
 */
router.get('/:photoId/tags', photoIdValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid photo ID',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
    }

    const { photoId } = req.params;

    // Get tags for the specific photo
    const tagsRef = db.collection('photoTags').where('photoId', '==', photoId);
    const snapshot = await tagsRef.get();

    const tags = [];
    snapshot.forEach((doc) => {
      const tagData = doc.data();
      tags.push({
        id: doc.id,
        ...tagData,
        createdAt: tagData.createdAt?.toDate?.() || tagData.createdAt,
      });
    });

    res.json({
      success: true,
      data: {
        tags: tags.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      },
    });
  } catch (error) {
    console.error('Error fetching photo tags:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch photo tags',
        code: 'FETCH_ERROR',
      },
    });
  }
});

/**
 * POST /api/photos/:photoId/tags
 * Add a new tag to a photo
 */
router.post('/:photoId/tags', tagRateLimit, photoIdValidation, tagValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid tag data',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
    }

    const { photoId } = req.params;
    const { name, email, x, y } = req.body;

    // Check if photo exists in the photos collection
    const photoRef = db.collection('photos').doc(photoId);
    const photoDoc = await photoRef.get();

    if (!photoDoc.exists) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Photo not found',
          code: 'PHOTO_NOT_FOUND',
        },
      });
    }

    // Check for duplicate tags at similar coordinates (within 5% distance)
    const existingTagsRef = db.collection('photoTags').where('photoId', '==', photoId);
    const existingSnapshot = await existingTagsRef.get();

    let duplicateFound = false;
    existingSnapshot.forEach((doc) => {
      const existingTag = doc.data();
      const distance = Math.sqrt(Math.pow(existingTag.x - x, 2) + Math.pow(existingTag.y - y, 2));
      if (distance < 5) {
        // 5% threshold
        duplicateFound = true;
      }
    });

    if (duplicateFound) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'A tag already exists at this location',
          code: 'DUPLICATE_TAG_LOCATION',
        },
      });
    }

    // Create the tag
    const tagData = {
      photoId,
      name: name.trim(),
      email: email?.trim() || null,
      x: parseFloat(x),
      y: parseFloat(y),
      status: 'pending', // pending, verified, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || null,
    };

    const tagRef = await db.collection('photoTags').add(tagData);

    res.status(201).json({
      success: true,
      data: {
        id: tagRef.id,
        ...tagData,
        createdAt: tagData.createdAt.toISOString(),
      },
      message: 'Tag submitted successfully and is pending approval',
    });
  } catch (error) {
    console.error('Error creating photo tag:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create photo tag',
        code: 'CREATE_ERROR',
      },
    });
  }
});

/**
 * DELETE /api/photos/:photoId/tags/:tagId
 * Remove a tag (admin only or same IP within 1 hour)
 */
router.delete(
  '/:photoId/tags/:tagId',
  photoIdValidation,
  param('tagId').trim().isLength({ min: 1 }).withMessage('Tag ID is required'),
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

      const { photoId, tagId } = req.params;
      const tagRef = db.collection('photoTags').doc(tagId);
      const tagDoc = await tagRef.get();

      if (!tagDoc.exists) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Tag not found',
            code: 'TAG_NOT_FOUND',
          },
        });
      }

      const tagData = tagDoc.data();

      // Check if tag belongs to the specified photo
      if (tagData.photoId !== photoId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Tag does not belong to specified photo',
            code: 'INVALID_PHOTO_TAG_COMBINATION',
          },
        });
      }

      // Check permissions: admin or same IP within 1 hour
      const isAdmin = req.headers.authorization === `Bearer ${process.env.ADMIN_KEY}`;
      const userIP = req.ip || req.connection.remoteAddress;
      const tagAge = Date.now() - tagData.createdAt.toDate().getTime();
      const oneHour = 60 * 60 * 1000;

      const canDelete = isAdmin || (tagData.ipAddress === userIP && tagAge < oneHour);

      if (!canDelete) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Not authorized to delete this tag',
            code: 'UNAUTHORIZED_DELETE',
          },
        });
      }

      await tagRef.delete();

      res.json({
        success: true,
        message: 'Tag deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting photo tag:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to delete photo tag',
          code: 'DELETE_ERROR',
        },
      });
    }
  }
);

/**
 * PATCH /api/photos/:photoId/tags/:tagId/status
 * Update tag status (admin only)
 */
router.patch(
  '/:photoId/tags/:tagId/status',
  requireAdminAuth,
  photoIdValidation,
  param('tagId').trim().isLength({ min: 1 }).withMessage('Tag ID is required'),
  body('status')
    .isIn(['pending', 'verified', 'rejected'])
    .withMessage('Status must be pending, verified, or rejected'),
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

      const { photoId, tagId } = req.params;
      const { status } = req.body;

      const tagRef = db.collection('photoTags').doc(tagId);
      const tagDoc = await tagRef.get();

      if (!tagDoc.exists) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Tag not found',
            code: 'TAG_NOT_FOUND',
          },
        });
      }

      const tagData = tagDoc.data();

      if (tagData.photoId !== photoId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Tag does not belong to specified photo',
            code: 'INVALID_PHOTO_TAG_COMBINATION',
          },
        });
      }

      await tagRef.update({
        status,
        updatedAt: new Date(),
        reviewedBy: 'admin', // Could be enhanced to track specific admin user
      });

      res.json({
        success: true,
        data: {
          id: tagId,
          status,
          updatedAt: new Date().toISOString(),
        },
        message: `Tag status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating tag status:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update tag status',
          code: 'UPDATE_ERROR',
        },
      });
    }
  }
);

/**
 * GET /api/photos/tags/pending
 * Get all pending tags for admin review
 */
router.get('/tags/pending', requireAdminAuth, async (req, res) => {
  try {
    const pendingTagsRef = db.collection('photoTags').where('status', '==', 'pending');
    const snapshot = await pendingTagsRef.get();

    const tags = [];
    snapshot.forEach((doc) => {
      const tagData = doc.data();
      tags.push({
        id: doc.id,
        ...tagData,
        createdAt: tagData.createdAt?.toDate?.() || tagData.createdAt,
        updatedAt: tagData.updatedAt?.toDate?.() || tagData.updatedAt,
      });
    });

    res.json({
      success: true,
      data: {
        tags: tags.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      },
    });
  } catch (error) {
    console.error('Error fetching pending tags:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch pending tags',
        code: 'FETCH_ERROR',
      },
    });
  }
});

export default router;
