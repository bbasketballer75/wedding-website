import express from 'express';
import getDbPromise from '../config/firestore.js';

const router = express.Router();

// POST /api/reactions - Add reaction to photo
router.post('/', async (req, res) => {
  try {
    const { photoId, type, userId, userDisplayName } = req.body;

    if (!photoId || !type) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Photo ID and reaction type are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
      });
    }

    // Validate reaction type
    const validReactions = ['love', 'laugh', 'wow', 'heart', 'thumbs-up'];
    if (!validReactions.includes(type)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid reaction type',
          code: 'INVALID_REACTION_TYPE',
          validTypes: validReactions,
        },
      });
    }

    const reactionData = {
      photoId,
      type,
      userId: userId || 'anonymous',
      userDisplayName: userDisplayName || 'Anonymous',
      timestamp: new Date(),
      createdAt: new Date(),
    };

    const db = await getDbPromise();
    const docRef = await db.collection('reactions').add(reactionData);

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...reactionData,
      },
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to add reaction',
        details: error.message,
      },
    });
  }
});

// GET /api/reactions/:photoId - Get reactions for a photo
router.get('/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;

    const db = await getDbPromise();
    const reactionsRef = db.collection('reactions');
    const snapshot = await reactionsRef
      .where('photoId', '==', photoId)
      .orderBy('timestamp', 'desc')
      .get();

    const reactions = [];
    const reactionCounts = {};

    snapshot.forEach((doc) => {
      const reactionData = doc.data();
      reactions.push({
        id: doc.id,
        ...reactionData,
      });

      // Count reactions by type
      if (reactionCounts[reactionData.type]) {
        reactionCounts[reactionData.type]++;
      } else {
        reactionCounts[reactionData.type] = 1;
      }
    });

    res.json({
      success: true,
      data: {
        photoId,
        reactions,
        counts: reactionCounts,
        totalReactions: reactions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch reactions',
        details: error.message,
      },
    });
  }
});

// DELETE /api/reactions/:reactionId - Remove a reaction
router.delete('/:reactionId', async (req, res) => {
  try {
    const { reactionId } = req.params;

    const db = await getDbPromise();
    // Check if reaction exists
    const reactionDoc = await db.collection('reactions').doc(reactionId).get();

    if (!reactionDoc.exists) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Reaction not found',
          code: 'REACTION_NOT_FOUND',
        },
      });
    }

    // Delete the reaction
    await db.collection('reactions').doc(reactionId).delete();

    res.json({
      success: true,
      data: {
        message: 'Reaction deleted successfully',
        reactionId,
      },
    });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete reaction',
        details: error.message,
      },
    });
  }
});

export default router;
