import express from 'express';
import {
  addDoc,
  collection,
  doc,
  getDoc,
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
 * 🎁 Digital Time Capsule Routes
 * Handles time capsule creation, sealing, and scheduled opening
 */

// Get all accessible time capsules (public + user's own)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const now = new Date();

    // Get all time capsules that are either public or have passed their open date
    const capsulesQuery = query(collection(db, 'timeCapsules'), orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(capsulesQuery);
    const capsules = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const openDate = data.openDate?.toDate?.() || new Date(data.openDate);
      const isAccessible = data.isPublic || now >= openDate;

      if (isAccessible) {
        capsules.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          openDate: openDate.toISOString(),
          isOpen: now >= openDate,
          daysUntilOpen: Math.max(0, Math.ceil((openDate - now) / (1000 * 60 * 60 * 24))),
        });
      }
    });

    res.json({
      success: true,
      data: {
        capsules,
        stats: {
          total: capsules.length,
          open: capsules.filter((c) => c.isOpen).length,
          sealed: capsules.filter((c) => !c.isOpen).length,
        },
      },
    });
  })
);

// Get a specific time capsule
router.get(
  '/:capsuleId',
  asyncHandler(async (req, res) => {
    const { capsuleId } = req.params;
    const now = new Date();

    const capsuleRef = doc(db, 'timeCapsules', capsuleId);
    const capsuleSnap = await getDoc(capsuleRef);

    if (!capsuleSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Time capsule not found' },
      });
    }

    const data = capsuleSnap.data();
    const openDate = data.openDate?.toDate?.() || new Date(data.openDate);
    const isAccessible = data.isPublic || now >= openDate;

    if (!isAccessible) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'This time capsule is still sealed',
          openDate: openDate.toISOString(),
          daysUntilOpen: Math.ceil((openDate - now) / (1000 * 60 * 60 * 24)),
        },
      });
    }

    res.json({
      success: true,
      data: {
        id: capsuleSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        openDate: openDate.toISOString(),
        isOpen: now >= openDate,
        daysUntilOpen: Math.max(0, Math.ceil((openDate - now) / (1000 * 60 * 60 * 24))),
      },
    });
  })
);

// Create a new time capsule
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      openDate,
      contents,
      isPublic = false,
      creatorName,
      creatorEmail,
    } = req.body;

    // Validation
    if (!title || !openDate || !contents || contents.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title, open date, and contents are required' },
      });
    }

    const openDateTime = new Date(openDate);
    const now = new Date();

    if (openDateTime <= now) {
      return res.status(400).json({
        success: false,
        error: { message: 'Open date must be in the future' },
      });
    }

    // Generate capsule code for sealing ceremony
    const capsuleCode = generateCapsuleCode();

    const capsuleData = {
      title: title.trim(),
      description: description?.trim() || '',
      openDate: openDateTime,
      createdAt: new Date(),
      isPublic,
      creatorName: creatorName?.trim() || 'Anonymous',
      creatorEmail: creatorEmail?.trim() || '',
      capsuleCode,
      status: 'sealed',
      contents: contents.map((content) => ({
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: content.type || 'text',
        title: content.title || '',
        content: content.content || '',
        mediaUrl: content.mediaUrl || '',
        addedAt: new Date(),
      })),
      sealingCeremony: {
        sealedAt: new Date(),
        sealingMessage: generateSealingMessage(title, openDateTime),
        witnessedBy: [],
      },
      openingStats: {
        timesViewed: 0,
        firstOpenedAt: null,
        lastViewedAt: null,
      },
    };

    const docRef = await addDoc(collection(db, 'timeCapsules'), capsuleData);

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        message: 'Time capsule created and sealed successfully!',
        capsule: {
          ...capsuleData,
          id: docRef.id,
          createdAt: capsuleData.createdAt.toISOString(),
          openDate: capsuleData.openDate.toISOString(),
        },
        sealingCertificate: {
          capsuleCode,
          title,
          sealedAt: capsuleData.sealingCeremony.sealedAt.toISOString(),
          openDate: openDateTime.toISOString(),
          message: capsuleData.sealingCeremony.sealingMessage,
        },
      },
    });
  })
);

// Add content to an existing unsealed time capsule
router.post(
  '/:capsuleId/contents',
  asyncHandler(async (req, res) => {
    const { capsuleId } = req.params;
    const { type, title, content, mediaUrl } = req.body;

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        error: { message: 'Content type and content are required' },
      });
    }

    const capsuleRef = doc(db, 'timeCapsules', capsuleId);
    const capsuleSnap = await getDoc(capsuleRef);

    if (!capsuleSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Time capsule not found' },
      });
    }

    const capsuleData = capsuleSnap.data();
    const openDate = capsuleData.openDate?.toDate?.() || new Date(capsuleData.openDate);

    if (new Date() >= openDate) {
      return res.status(403).json({
        success: false,
        error: { message: 'Cannot add content to an opened time capsule' },
      });
    }

    const newContent = {
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      title: title || '',
      content,
      mediaUrl: mediaUrl || '',
      addedAt: new Date(),
    };

    const updatedContents = [...(capsuleData.contents || []), newContent];

    await updateDoc(capsuleRef, {
      contents: updatedContents,
      lastModifiedAt: new Date(),
    });

    res.json({
      success: true,
      data: {
        message: 'Content added to time capsule successfully!',
        content: {
          ...newContent,
          addedAt: newContent.addedAt.toISOString(),
        },
      },
    });
  })
);

// Record time capsule opening/viewing
router.post(
  '/:capsuleId/open',
  asyncHandler(async (req, res) => {
    const { capsuleId } = req.params;
    const { viewerName } = req.body;

    const capsuleRef = doc(db, 'timeCapsules', capsuleId);
    const capsuleSnap = await getDoc(capsuleRef);

    if (!capsuleSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Time capsule not found' },
      });
    }

    const data = capsuleSnap.data();
    const openDate = data.openDate?.toDate?.() || new Date(data.openDate);
    const now = new Date();

    if (now < openDate && !data.isPublic) {
      return res.status(403).json({
        success: false,
        error: { message: 'Time capsule is still sealed' },
      });
    }

    const currentStats = data.openingStats || {};
    const updatedStats = {
      timesViewed: (currentStats.timesViewed || 0) + 1,
      firstOpenedAt: currentStats.firstOpenedAt || now,
      lastViewedAt: now,
      viewers: [
        ...(currentStats.viewers || []),
        {
          name: viewerName || 'Anonymous',
          viewedAt: now,
        },
      ].slice(-10), // Keep last 10 viewers
    };

    await updateDoc(capsuleRef, {
      openingStats: updatedStats,
    });

    res.json({
      success: true,
      data: {
        message: 'Time capsule opened successfully!',
        openingStats: {
          ...updatedStats,
          firstOpenedAt: updatedStats.firstOpenedAt.toISOString(),
          lastViewedAt: updatedStats.lastViewedAt.toISOString(),
        },
      },
    });
  })
);

// Get time capsule opening schedule
router.get(
  '/schedule/upcoming',
  asyncHandler(async (req, res) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 10); // Next 10 years

    const upcomingQuery = query(
      collection(db, 'timeCapsules'),
      where('openDate', '>', now),
      where('openDate', '<=', futureDate),
      orderBy('openDate', 'asc')
    );

    const snapshot = await getDocs(upcomingQuery);
    const upcomingCapsules = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const openDate = data.openDate?.toDate?.() || new Date(data.openDate);

      upcomingCapsules.push({
        id: doc.id,
        title: data.title,
        openDate: openDate.toISOString(),
        daysUntilOpen: Math.ceil((openDate - now) / (1000 * 60 * 60 * 24)),
        creatorName: data.creatorName,
        isPublic: data.isPublic,
      });
    });

    res.json({
      success: true,
      data: {
        upcomingCapsules,
        nextOpening: upcomingCapsules[0] || null,
      },
    });
  })
);

// Helper Functions
function generateCapsuleCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateSealingMessage(title, openDate) {
  const messages = [
    `"${title}" has been sealed with love and will be opened on ${openDate.toDateString()}.`,
    `This time capsule contains precious memories that will be revealed on ${openDate.toDateString()}.`,
    `Sealed today with hopes and dreams, to be opened on ${openDate.toDateString()}.`,
    `The memories within "${title}" await their moment on ${openDate.toDateString()}.`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

export default router;
