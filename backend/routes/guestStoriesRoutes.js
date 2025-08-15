import express from 'express';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * 💝 Guest Story Collection Routes
 * Handles guest story submissions, categorization, and display
 */

// Get all approved guest stories
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, limit = 20, offset = 0 } = req.query;

    let storiesQuery = query(
      collection(db, 'guestStories'),
      where('approved', '==', true),
      orderBy('submittedAt', 'desc')
    );

    if (category && category !== 'all') {
      storiesQuery = query(
        collection(db, 'guestStories'),
        where('approved', '==', true),
        where('category', '==', category),
        orderBy('submittedAt', 'desc')
      );
    }

    const snapshot = await getDocs(storiesQuery);
    const stories = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt,
      });
    });

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedStories = stories.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        stories: paginatedStories,
        total: stories.length,
        hasMore: endIndex < stories.length,
        categories: await getStoryCategories(),
      },
    });
  })
);

// Submit a new guest story
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      guestName,
      relationship,
      storyTitle,
      storyContent,
      favoriteMemory,
      wishForCouple,
      category,
      photos = [],
    } = req.body;

    // Validation
    if (!guestName || !storyTitle || !storyContent) {
      return res.status(400).json({
        success: false,
        error: { message: 'Guest name, story title, and content are required' },
      });
    }

    // Auto-categorize if not provided
    const autoCategory = category || categorizeStory(storyContent, favoriteMemory);

    const storyData = {
      guestName: guestName.trim(),
      relationship: relationship || 'Friend',
      storyTitle: storyTitle.trim(),
      storyContent: storyContent.trim(),
      favoriteMemory: favoriteMemory?.trim() || '',
      wishForCouple: wishForCouple?.trim() || '',
      category: autoCategory,
      photos: photos.slice(0, 5), // Limit to 5 photos
      submittedAt: new Date(),
      approved: false, // Requires admin approval
      featured: false,
      likes: 0,
      tags: extractTags(storyContent, favoriteMemory),
    };

    const docRef = await addDoc(collection(db, 'guestStories'), storyData);

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        message: 'Your story has been submitted! It will appear after admin approval.',
        story: {
          ...storyData,
          id: docRef.id,
          submittedAt: storyData.submittedAt.toISOString(),
        },
      },
    });
  })
);

// Get story categories with counts
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = await getStoryCategories();

    res.json({
      success: true,
      data: { categories },
    });
  })
);

// Get featured stories
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const featuredQuery = query(
      collection(db, 'guestStories'),
      where('approved', '==', true),
      where('featured', '==', true),
      orderBy('submittedAt', 'desc')
    );

    const snapshot = await getDocs(featuredQuery);
    const stories = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt,
      });
    });

    res.json({
      success: true,
      data: { stories },
    });
  })
);

// Admin: Get all stories (including unapproved)
router.get(
  '/admin/all',
  asyncHandler(async (req, res) => {
    // In a real app, add admin authentication middleware here

    const allStoriesQuery = query(collection(db, 'guestStories'), orderBy('submittedAt', 'desc'));

    const snapshot = await getDocs(allStoriesQuery);
    const stories = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt,
      });
    });

    res.json({
      success: true,
      data: { stories },
    });
  })
);

// Admin: Approve/reject a story
router.patch(
  '/admin/:storyId/status',
  asyncHandler(async (req, res) => {
    const { storyId } = req.params;
    const { approved, featured = false } = req.body;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: { message: 'Approved status must be true or false' },
      });
    }

    const storyRef = doc(db, 'guestStories', storyId);
    await updateDoc(storyRef, {
      approved,
      featured: approved ? featured : false,
      reviewedAt: new Date(),
    });

    res.json({
      success: true,
      data: {
        message: `Story ${approved ? 'approved' : 'rejected'} successfully`,
        storyId,
        approved,
        featured,
      },
    });
  })
);

// Helper Functions
async function getStoryCategories() {
  const categoriesQuery = query(collection(db, 'guestStories'), where('approved', '==', true));
  const snapshot = await getDocs(categoriesQuery);

  const categoryCounts = {};
  snapshot.forEach((doc) => {
    const category = doc.data().category || 'uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const categoryLabels = {
    'wedding-day': 'Wedding Day Memories',
    friendship: 'Friendship Stories',
    family: 'Family Memories',
    funny: 'Funny Moments',
    romantic: 'Romantic Stories',
    advice: 'Marriage Advice',
    wishes: 'Well Wishes',
    memories: 'Special Memories',
    uncategorized: 'Other Stories',
  };

  return Object.entries(categoryCounts).map(([category, count]) => ({
    id: category,
    label: categoryLabels[category] || category,
    count,
  }));
}

function categorizeStory(content, memory) {
  const text = `${content} ${memory}`.toLowerCase();

  const categories = {
    'wedding-day': ['wedding day', 'ceremony', 'reception', 'altar', 'vows', 'dress', 'tux'],
    funny: ['funny', 'hilarious', 'laugh', 'joke', 'humor', 'silly', 'crazy'],
    romantic: ['love', 'romantic', 'kiss', 'sweet', 'adorable', 'cute couple'],
    family: ['family', 'parents', 'siblings', 'mom', 'dad', 'brother', 'sister'],
    friendship: ['friend', 'college', 'school', 'met', 'friendship'],
    advice: ['advice', 'tips', 'marriage', 'relationship', 'future'],
    wishes: ['wish', 'hope', 'blessing', 'congratulations', 'happy'],
    memories: ['remember', 'memory', 'moment', 'time', 'never forget'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return 'memories'; // Default category
}

function extractTags(content, memory) {
  const text = `${content} ${memory}`.toLowerCase();
  const commonTags = {
    emotional: ['emotional', 'tears', 'crying', 'touched', 'moved'],
    fun: ['fun', 'party', 'dance', 'music', 'celebration'],
    special: ['special', 'unique', 'amazing', 'wonderful', 'beautiful'],
    heartwarming: ['heart', 'warm', 'sweet', 'touching', 'precious'],
  };

  const tags = [];
  for (const [tag, keywords] of Object.entries(commonTags)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      tags.push(tag);
    }
  }

  return tags.slice(0, 3); // Limit to 3 tags
}

export default router;
