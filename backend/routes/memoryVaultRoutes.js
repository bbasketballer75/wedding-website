import express from 'express';

const router = express.Router();

/**
 * 📸 Wedding Memory Vault API Routes
 * Secure storage and sharing of wedding memories
 */

// Get all memory vault entries
router.get('/', async (req, res) => {
  try {
    const { category, privacy, uploader, limit = 50, page = 1 } = req.query;

    let query = req.db.collection('memoryVault');

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }

    if (privacy) {
      query = query.where('privacy', '==', privacy);
    }

    if (uploader) {
      query = query.where('uploader.email', '==', uploader);
    }

    // Add ordering and pagination
    query = query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await query.get();
    const memories = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      memories.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });

    // Get total count for pagination
    const totalSnapshot = await req.db.collection('memoryVault').get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: {
        memories,
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
      message: 'Failed to fetch memory vault entries',
      error: error.message,
    });
  }
});

// Upload new memory
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      tags,
      location,
      eventDate,
      uploader,
      privacy = 'public',
      allowDownload = true,
      allowComments = true,
    } = req.body;

    // Validation
    if (!title || !mediaType || !mediaUrl || !uploader) {
      return res.status(400).json({
        success: false,
        message: 'Title, media type, media URL, and uploader are required',
      });
    }

    // Auto-categorize based on content and metadata
    const categories = {
      ceremony: ['ceremony', 'vows', 'altar', 'aisle', 'rings'],
      reception: ['reception', 'party', 'dancing', 'dinner', 'cake'],
      portraits: ['portrait', 'couple', 'bride', 'groom', 'family'],
      candid: ['candid', 'moment', 'laugh', 'fun', 'spontaneous'],
      details: ['detail', 'decoration', 'flower', 'dress', 'rings'],
      guests: ['guest', 'friend', 'family', 'group', 'table'],
    };

    let detectedCategory = category;
    if (!detectedCategory) {
      const contentLower = (title + ' ' + (description || '')).toLowerCase();
      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some((keyword) => contentLower.includes(keyword))) {
          detectedCategory = cat;
          break;
        }
      }
      detectedCategory = detectedCategory || 'candid';
    }

    // Extract additional metadata
    const metadata = {
      fileSize: 0, // Would be calculated from actual file
      dimensions: null, // Would be extracted from image/video
      duration: mediaType.startsWith('video') ? null : undefined,
      colorProfile: null,
      camera: null,
      location: location || null,
    };

    // Auto-generate tags
    const autoTags = tags || [];
    const titleWords = title.toLowerCase().split(/\s+/);
    const commonTags = ['wedding', 'love', 'celebration', 'memories', 'beautiful', 'special'];

    commonTags.forEach((tag) => {
      if (titleWords.some((word) => word.includes(tag)) && !autoTags.includes(tag)) {
        autoTags.push(tag);
      }
    });

    const memory = {
      title: title.trim(),
      description: (description || '').trim(),
      category: detectedCategory,
      mediaType, // 'image', 'video', 'audio'
      mediaUrl,
      thumbnailUrl: thumbnailUrl || mediaUrl,
      tags: autoTags.slice(0, 15), // Limit to 15 tags
      location: location || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      uploader: {
        name: uploader.name,
        email: uploader.email,
        relationship: uploader.relationship || 'guest',
      },
      privacy, // 'public', 'family_only', 'private'
      allowDownload,
      allowComments,
      metadata,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      downloadCount: 0,
      favoriteCount: 0,
      commentCount: 0,
      shareCount: 0,
    };

    const docRef = await req.db.collection('memoryVault').add(memory);

    res.status(201).json({
      success: true,
      message: 'Memory uploaded successfully',
      data: {
        id: docRef.id,
        ...memory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload memory',
      error: error.message,
    });
  }
});

// Get single memory
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await req.db.collection('memoryVault').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
      });
    }

    // Increment view count
    await doc.ref.update({
      viewCount: (doc.data().viewCount || 0) + 1,
      lastViewed: new Date(),
    });

    const data = doc.data();

    // Get comments for this memory
    const commentsSnapshot = await req.db
      .collection('memoryComments')
      .where('memoryId', '==', id)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const comments = [];
    commentsSnapshot.forEach((commentDoc) => {
      const commentData = commentDoc.data();
      comments.push({
        id: commentDoc.id,
        ...commentData,
        createdAt: commentData.createdAt?.toDate?.() || commentData.createdAt,
      });
    });

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        comments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch memory',
      error: error.message,
    });
  }
});

// Add comment to memory
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;

    if (!content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Content and author are required',
      });
    }

    // Check if memory exists
    const memoryDoc = await req.db.collection('memoryVault').doc(id).get();
    if (!memoryDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
      });
    }

    const comment = {
      memoryId: id,
      content: content.trim(),
      author: {
        name: author.name,
        email: author.email,
        avatar: author.avatar || null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
    };

    const commentRef = await req.db.collection('memoryComments').add(comment);

    // Update comment count on memory
    await memoryDoc.ref.update({
      commentCount: (memoryDoc.data().commentCount || 0) + 1,
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        id: commentRef.id,
        ...comment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    });
  }
});

// Toggle favorite status
router.post('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const doc = await req.db.collection('memoryVault').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
      });
    }

    const data = doc.data();
    const favorites = data.favorites || [];
    const isFavorited = favorites.includes(userId);

    let updatedFavorites;
    let favoriteCount;

    if (isFavorited) {
      updatedFavorites = favorites.filter((id) => id !== userId);
      favoriteCount = Math.max(0, (data.favoriteCount || 1) - 1);
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

// Download memory
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await req.db.collection('memoryVault').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
      });
    }

    const data = doc.data();

    if (!data.allowDownload) {
      return res.status(403).json({
        success: false,
        message: 'Download not allowed for this memory',
      });
    }

    // Increment download count
    await doc.ref.update({
      downloadCount: (data.downloadCount || 0) + 1,
    });

    res.json({
      success: true,
      data: {
        downloadUrl: data.mediaUrl,
        filename: `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.${data.mediaType.split('/')[1] || 'jpg'}`,
        mediaType: data.mediaType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process download',
      error: error.message,
    });
  }
});

// Get memory vault statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const snapshot = await req.db.collection('memoryVault').get();

    const stats = {
      totalMemories: 0,
      totalViews: 0,
      totalDownloads: 0,
      totalComments: 0,
      categories: {},
      mediaTypes: {},
      topUploaders: {},
      recentUploads: [],
      popularMemories: [],
    };

    const memories = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      stats.totalMemories++;
      stats.totalViews += data.viewCount || 0;
      stats.totalDownloads += data.downloadCount || 0;
      stats.totalComments += data.commentCount || 0;

      // Count categories
      const category = data.category || 'uncategorized';
      stats.categories[category] = (stats.categories[category] || 0) + 1;

      // Count media types
      const mediaType = data.mediaType || 'unknown';
      stats.mediaTypes[mediaType] = (stats.mediaTypes[mediaType] || 0) + 1;

      // Count uploaders
      const uploaderName = data.uploader?.name || 'Anonymous';
      stats.topUploaders[uploaderName] = (stats.topUploaders[uploaderName] || 0) + 1;

      // Collect memories for sorting
      memories.push({
        id: doc.id,
        title: data.title,
        viewCount: data.viewCount || 0,
        favoriteCount: data.favoriteCount || 0,
        uploader: data.uploader?.name || 'Anonymous',
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      });
    });

    // Sort for recent uploads
    stats.recentUploads = memories
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Sort for popular memories
    stats.popularMemories = memories
      .sort((a, b) => b.viewCount + b.favoriteCount - (a.viewCount + a.favoriteCount))
      .slice(0, 10);

    // Convert top uploaders to sorted array
    stats.topUploaders = Object.entries(stats.topUploaders)
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
      message: 'Failed to fetch memory vault statistics',
      error: error.message,
    });
  }
});

// Search memories
router.get('/search', async (req, res) => {
  try {
    const { q, category, mediaType, uploader, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // Note: This is a basic search. For production, you'd want to use
    // a proper search service like Algolia or Elasticsearch
    let query = req.db.collection('memoryVault');

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }

    if (mediaType) {
      query = query.where('mediaType', '==', mediaType);
    }

    if (uploader) {
      query = query.where('uploader.email', '==', uploader);
    }

    const snapshot = await query.limit(parseInt(limit)).get();
    const searchResults = [];
    const searchTerm = q.toLowerCase();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const searchableText = [
        data.title,
        data.description,
        ...(data.tags || []),
        data.uploader?.name,
        data.category,
      ]
        .join(' ')
        .toLowerCase();

      if (searchableText.includes(searchTerm)) {
        searchResults.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          relevanceScore: calculateRelevanceScore(searchableText, searchTerm),
        });
      }
    });

    // Sort by relevance
    searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      success: true,
      data: {
        results: searchResults,
        totalResults: searchResults.length,
        query: q,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search memories',
      error: error.message,
    });
  }
});

// Create memory album/collection
router.post('/albums', async (req, res) => {
  try {
    const { title, description, memoryIds, isPublic = true, creator } = req.body;

    if (!title || !creator) {
      return res.status(400).json({
        success: false,
        message: 'Title and creator are required',
      });
    }

    const album = {
      title: title.trim(),
      description: (description || '').trim(),
      memoryIds: memoryIds || [],
      isPublic,
      creator: {
        name: creator.name,
        email: creator.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      memoryCount: (memoryIds || []).length,
    };

    const docRef = await req.db.collection('memoryAlbums').add(album);

    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: {
        id: docRef.id,
        ...album,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create album',
      error: error.message,
    });
  }
});

// Helper function to calculate search relevance
function calculateRelevanceScore(text, searchTerm) {
  const words = searchTerm.split(/\s+/);
  let score = 0;

  words.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length;
    }
  });

  return score;
}

export default router;
