import express from 'express';
import aiServices from '../services/aiServices.js';
import performanceManager from '../services/performanceManager.js';

const router = express.Router();

// POST /api/ai/moderate - Moderate content using AI
router.post('/moderate', performanceManager.rateLimiters.ai, async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Content is required for moderation',
          code: 'MISSING_CONTENT',
        },
      });
    }

    // Use real AI moderation service
    const moderationResult = await aiServices.moderateContent(content, type);

    res.json({
      success: true,
      data: moderationResult,
    });
  } catch (error) {
    console.error('Error in content moderation:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to moderate content',
        details: error.message,
      },
    });
  }
});

// POST /api/ai/generate-caption - Generate photo caption
router.post('/generate-caption', performanceManager.rateLimiters.ai, async (req, res) => {
  try {
    const { photoUrl, context } = req.body;

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Photo URL is required',
          code: 'MISSING_PHOTO_URL',
        },
      });
    }

    // Use real AI caption generation service
    const captionResult = await aiServices.generatePhotoCaption(photoUrl, context);

    res.json({
      success: true,
      data: captionResult,
    });
  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to generate caption',
        details: error.message,
      },
    });
  }
});

// POST /api/ai/smart-search - Intelligent photo search
router.post('/smart-search', performanceManager.rateLimiters.ai, async (req, res) => {
  try {
    const { query, searchType } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Search query is required',
          code: 'MISSING_QUERY',
        },
      });
    }

    // Use real AI smart search service
    const searchResult = await aiServices.performSmartSearch(query, searchType);

    res.json({
      success: true,
      data: searchResult,
    });
  } catch (error) {
    console.error('Error in smart search:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to perform smart search',
        details: error.message,
      },
    });
  }
});

export default router;
