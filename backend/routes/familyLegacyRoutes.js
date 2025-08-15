import express from 'express';

const router = express.Router();

/**
 * 🏗️ Family Legacy Builder API Routes
 * Creating lasting family heritage and memories
 */

// Get all family legacy entries
router.get('/', async (req, res) => {
  try {
    const { category, generation, limit = 50, page = 1 } = req.query;

    let query = req.db.collection('familyLegacy');

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }

    if (generation) {
      query = query.where('generation', '==', generation);
    }

    // Add ordering and pagination
    query = query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await query.get();
    const legacyEntries = [];

    snapshot.forEach((doc) => {
      legacyEntries.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      });
    });

    // Get total count for pagination
    const totalSnapshot = await req.db.collection('familyLegacy').get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: {
        entries: legacyEntries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch family legacy entries',
      error: error.message,
    });
  }
});

// Create new family legacy entry
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      generation,
      author,
      tags,
      mediaUrls,
      isPrivate = false,
      metadata,
    } = req.body;

    // Validation
    if (!title || !content || !category || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, category, and author are required',
      });
    }

    // Auto-categorize if not provided
    const categories = {
      family_history: ['ancestry', 'genealogy', 'heritage', 'lineage'],
      traditions: ['custom', 'celebration', 'holiday', 'ritual'],
      recipes: ['cooking', 'food', 'recipe', 'kitchen'],
      stories: ['memory', 'story', 'tale', 'experience'],
      wisdom: ['advice', 'lesson', 'teaching', 'guidance'],
      achievements: ['accomplishment', 'success', 'milestone', 'award'],
    };

    let detectedCategory = category;
    if (!detectedCategory) {
      const contentLower = (title + ' ' + content).toLowerCase();
      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some((keyword) => contentLower.includes(keyword))) {
          detectedCategory = cat;
          break;
        }
      }
      detectedCategory = detectedCategory || 'stories';
    }

    // Extract tags from content
    const extractedTags = tags || [];
    const contentWords = content.toLowerCase().split(/\s+/);
    const commonTags = ['family', 'love', 'tradition', 'memory', 'celebration', 'heritage'];
    commonTags.forEach((tag) => {
      if (contentWords.includes(tag) && !extractedTags.includes(tag)) {
        extractedTags.push(tag);
      }
    });

    const legacyEntry = {
      title: title.trim(),
      content: content.trim(),
      category: detectedCategory,
      generation: generation || 'current',
      author: {
        name: author.name || author,
        email: author.email || null,
        relationship: author.relationship || 'family_member',
      },
      tags: extractedTags.slice(0, 10), // Limit to 10 tags
      mediaUrls: mediaUrls || [],
      isPrivate,
      metadata: {
        wordCount: content.split(/\s+/).length,
        readingTime: Math.ceil(content.split(/\s+/).length / 200), // ~200 words per minute
        ...metadata,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      favoriteCount: 0,
    };

    const docRef = await req.db.collection('familyLegacy').add(legacyEntry);

    res.status(201).json({
      success: true,
      message: 'Family legacy entry created successfully',
      data: {
        id: docRef.id,
        ...legacyEntry,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create family legacy entry',
      error: error.message,
    });
  }
});

// Get family tree structure
router.get('/family-tree', async (req, res) => {
  try {
    const snapshot = await req.db
      .collection('familyLegacy')
      .where('category', '==', 'family_history')
      .orderBy('generation')
      .get();

    const familyTree = {
      generations: {},
      relationships: [],
      timeline: [],
    };

    snapshot.forEach((doc) => {
      const data = doc.data();
      const generation = data.generation || 'current';

      if (!familyTree.generations[generation]) {
        familyTree.generations[generation] = [];
      }

      familyTree.generations[generation].push({
        id: doc.id,
        title: data.title,
        author: data.author,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      });

      // Add to timeline
      familyTree.timeline.push({
        id: doc.id,
        title: data.title,
        generation,
        date: data.createdAt?.toDate?.() || data.createdAt,
      });
    });

    // Sort timeline by date
    familyTree.timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: familyTree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch family tree',
      error: error.message,
    });
  }
});

// Get legacy statistics
router.get('/stats', async (req, res) => {
  try {
    const snapshot = await req.db.collection('familyLegacy').get();

    const stats = {
      totalEntries: 0,
      categories: {},
      generations: {},
      topContributors: {},
      recentActivity: [],
    };

    snapshot.forEach((doc) => {
      const data = doc.data();
      stats.totalEntries++;

      // Count categories
      const category = data.category || 'uncategorized';
      stats.categories[category] = (stats.categories[category] || 0) + 1;

      // Count generations
      const generation = data.generation || 'current';
      stats.generations[generation] = (stats.generations[generation] || 0) + 1;

      // Count contributors
      const authorName = data.author?.name || data.author || 'Anonymous';
      stats.topContributors[authorName] = (stats.topContributors[authorName] || 0) + 1;

      // Recent activity
      stats.recentActivity.push({
        id: doc.id,
        title: data.title,
        author: authorName,
        category: data.category,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      });
    });

    // Sort recent activity
    stats.recentActivity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    stats.recentActivity = stats.recentActivity.slice(0, 10);

    // Convert top contributors to sorted array
    stats.topContributors = Object.entries(stats.topContributors)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch legacy statistics',
      error: error.message,
    });
  }
});

// Get single legacy entry
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await req.db.collection('familyLegacy').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Legacy entry not found',
      });
    }

    // Increment view count
    await doc.ref.update({
      viewCount: (doc.data().viewCount || 0) + 1,
      lastViewed: new Date(),
    });

    const data = doc.data();
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        lastViewed: data.lastViewed?.toDate?.() || data.lastViewed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch legacy entry',
      error: error.message,
    });
  }
});

// Update legacy entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.createdAt;
    delete updates.viewCount;

    updates.updatedAt = new Date();

    const doc = await req.db.collection('familyLegacy').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Legacy entry not found',
      });
    }

    await doc.ref.update(updates);

    const updatedDoc = await doc.ref.get();
    const data = updatedDoc.data();

    res.json({
      success: true,
      message: 'Legacy entry updated successfully',
      data: {
        id: updatedDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update legacy entry',
      error: error.message,
    });
  }
});

// Toggle favorite status
router.post('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const doc = await req.db.collection('familyLegacy').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Legacy entry not found',
      });
    }

    const data = doc.data();
    const favorites = data.favorites || [];
    const isFavorited = favorites.includes(userId);

    let updatedFavorites;
    let favoriteCount;

    if (isFavorited) {
      updatedFavorites = favorites.filter((id) => id !== userId);
      favoriteCount = (data.favoriteCount || 1) - 1;
    } else {
      updatedFavorites = [...favorites, userId];
      favoriteCount = (data.favoriteCount || 0) + 1;
    }

    await doc.ref.update({
      favorites: updatedFavorites,
      favoriteCount,
    });

    res.json({
      success: true,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      data: {
        isFavorited: !isFavorited,
        favoriteCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update favorite status',
      error: error.message,
    });
  }
});

// Delete legacy entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await req.db.collection('familyLegacy').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Legacy entry not found',
      });
    }

    await doc.ref.delete();

    res.json({
      success: true,
      message: 'Legacy entry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete legacy entry',
      error: error.message,
    });
  }
});

export default router;
