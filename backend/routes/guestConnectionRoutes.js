import express from 'express';

const router = express.Router();

/**
 * 🤝 Guest Connection Portal API Routes
 * Facilitating meaningful connections between wedding guests
 */

// Get all guest connections
router.get('/', async (req, res) => {
  try {
    const { status, type, limit = 50, page = 1 } = req.query;

    let query = req.db.collection('guestConnections');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }

    if (type) {
      query = query.where('connectionType', '==', type);
    }

    // Add ordering and pagination
    query = query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await query.get();
    const connections = [];

    snapshot.forEach((doc) => {
      connections.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      });
    });

    // Get total count for pagination
    const totalSnapshot = await req.db.collection('guestConnections').get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: {
        connections,
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
      message: 'Failed to fetch guest connections',
      error: error.message,
    });
  }
});

// Create new connection request
router.post('/', async (req, res) => {
  try {
    const { fromGuest, toGuest, connectionType, message, sharedInterests, contactPreferences } =
      req.body;

    // Validation
    if (!fromGuest || !toGuest || !connectionType) {
      return res.status(400).json({
        success: false,
        message: 'From guest, to guest, and connection type are required',
      });
    }

    // Check if connection already exists
    const existingConnection = await req.db
      .collection('guestConnections')
      .where('fromGuest.email', '==', fromGuest.email)
      .where('toGuest.email', '==', toGuest.email)
      .get();

    if (!existingConnection.empty) {
      return res.status(409).json({
        success: false,
        message: 'Connection request already exists between these guests',
      });
    }

    // Auto-detect shared interests based on profiles
    const detectedInterests = sharedInterests || [];
    const commonInterests = ['music', 'travel', 'food', 'sports', 'books', 'movies'];

    // Simulate interest matching (in real app, this would use guest profiles)
    if (detectedInterests.length === 0) {
      detectedInterests.push(...commonInterests.slice(0, Math.floor(Math.random() * 3) + 1));
    }

    const connection = {
      fromGuest: {
        name: fromGuest.name,
        email: fromGuest.email,
        table: fromGuest.table || null,
        relationship: fromGuest.relationship || 'guest',
      },
      toGuest: {
        name: toGuest.name,
        email: toGuest.email,
        table: toGuest.table || null,
        relationship: toGuest.relationship || 'guest',
      },
      connectionType: connectionType, // 'social', 'professional', 'family', 'hobby'
      message: message || '',
      sharedInterests: detectedInterests,
      contactPreferences: {
        allowEmail: contactPreferences?.allowEmail ?? true,
        allowPhone: contactPreferences?.allowPhone ?? false,
        allowSocial: contactPreferences?.allowSocial ?? true,
        preferredMethod: contactPreferences?.preferredMethod || 'email',
      },
      status: 'pending', // pending, accepted, declined, blocked
      matchScore: calculateMatchScore(fromGuest, toGuest, detectedInterests),
      createdAt: new Date(),
      updatedAt: new Date(),
      responseDate: null,
      lastInteraction: new Date(),
    };

    const docRef = await req.db.collection('guestConnections').add(connection);

    // Send notification (would integrate with email service)
    const notification = {
      type: 'connection_request',
      recipient: toGuest.email,
      sender: fromGuest.name,
      message: `${fromGuest.name} would like to connect with you!`,
      connectionId: docRef.id,
      createdAt: new Date(),
    };

    await req.db.collection('notifications').add(notification);

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: {
        id: docRef.id,
        ...connection,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create connection request',
      error: error.message,
    });
  }
});

// Respond to connection request
router.post('/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { response, message } = req.body; // 'accept' or 'decline'

    if (!['accept', 'decline'].includes(response)) {
      return res.status(400).json({
        success: false,
        message: 'Response must be either "accept" or "decline"',
      });
    }

    const doc = await req.db.collection('guestConnections').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    const data = doc.data();
    if (data.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Connection request has already been responded to',
      });
    }

    const updates = {
      status: response === 'accept' ? 'accepted' : 'declined',
      responseDate: new Date(),
      responseMessage: message || '',
      updatedAt: new Date(),
    };

    await doc.ref.update(updates);

    // Create notification for the original requester
    const notification = {
      type: 'connection_response',
      recipient: data.fromGuest.email,
      sender: data.toGuest.name,
      message: `${data.toGuest.name} ${response === 'accept' ? 'accepted' : 'declined'} your connection request`,
      connectionId: id,
      createdAt: new Date(),
    };

    await req.db.collection('notifications').add(notification);

    res.json({
      success: true,
      message: `Connection request ${response}ed successfully`,
      data: {
        id: doc.id,
        ...data,
        ...updates,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to respond to connection request',
      error: error.message,
    });
  }
});

// Get connection recommendations
router.get('/recommendations/:guestEmail', async (req, res) => {
  try {
    const { guestEmail } = req.params;
    const { limit = 10 } = req.query;

    // Get all guests (in real app, this would be from a guests table)
    const guestsSnapshot = await req.db.collection('guestConnections').get();
    const allGuests = new Set();

    guestsSnapshot.forEach((doc) => {
      const data = doc.data();
      allGuests.add(JSON.stringify(data.fromGuest));
      allGuests.add(JSON.stringify(data.toGuest));
    });

    // Get existing connections for this guest
    const existingConnections = await req.db
      .collection('guestConnections')
      .where('fromGuest.email', '==', guestEmail)
      .get();

    const connectedEmails = new Set();
    existingConnections.forEach((doc) => {
      connectedEmails.add(doc.data().toGuest.email);
    });

    // Also check reverse connections
    const reverseConnections = await req.db
      .collection('guestConnections')
      .where('toGuest.email', '==', guestEmail)
      .get();

    reverseConnections.forEach((doc) => {
      connectedEmails.add(doc.data().fromGuest.email);
    });

    // Generate recommendations
    const recommendations = [];
    const guestList = Array.from(allGuests).map((g) => JSON.parse(g));

    for (const guest of guestList) {
      if (guest.email !== guestEmail && !connectedEmails.has(guest.email)) {
        const matchScore = Math.random() * 100; // In real app, calculate based on interests, table, etc.
        const sharedInterests = ['music', 'travel', 'food'].slice(
          0,
          Math.floor(Math.random() * 3) + 1
        );

        recommendations.push({
          guest,
          matchScore: Math.round(matchScore),
          sharedInterests,
          reasonsToConnect: generateConnectionReasons(guest, sharedInterests),
          mutualConnections: Math.floor(Math.random() * 5),
        });
      }
    }

    // Sort by match score and limit results
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: {
        recommendations: recommendations.slice(0, parseInt(limit)),
        totalRecommendations: recommendations.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get connection recommendations',
      error: error.message,
    });
  }
});

// Get connection statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const snapshot = await req.db.collection('guestConnections').get();

    const stats = {
      totalConnections: 0,
      pendingRequests: 0,
      acceptedConnections: 0,
      declinedRequests: 0,
      connectionTypes: {},
      popularInterests: {},
      averageMatchScore: 0,
      recentActivity: [],
    };

    let totalMatchScore = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      stats.totalConnections++;

      // Count by status
      if (data.status === 'pending') stats.pendingRequests++;
      else if (data.status === 'accepted') stats.acceptedConnections++;
      else if (data.status === 'declined') stats.declinedRequests++;

      // Count connection types
      const type = data.connectionType || 'social';
      stats.connectionTypes[type] = (stats.connectionTypes[type] || 0) + 1;

      // Count interests
      if (data.sharedInterests) {
        data.sharedInterests.forEach((interest) => {
          stats.popularInterests[interest] = (stats.popularInterests[interest] || 0) + 1;
        });
      }

      // Calculate average match score
      if (data.matchScore) {
        totalMatchScore += data.matchScore;
      }

      // Recent activity
      stats.recentActivity.push({
        id: doc.id,
        fromGuest: data.fromGuest.name,
        toGuest: data.toGuest.name,
        status: data.status,
        connectionType: data.connectionType,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      });
    });

    stats.averageMatchScore =
      stats.totalConnections > 0 ? Math.round(totalMatchScore / stats.totalConnections) : 0;

    // Sort recent activity by date
    stats.recentActivity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    stats.recentActivity = stats.recentActivity.slice(0, 10);

    // Convert interests to sorted array
    stats.popularInterests = Object.entries(stats.popularInterests)
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connection statistics',
      error: error.message,
    });
  }
});

// Get guest's connections
router.get('/guest/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { status } = req.query;

    // Get connections where this guest is the sender
    let sentQuery = req.db.collection('guestConnections').where('fromGuest.email', '==', email);

    if (status) {
      sentQuery = sentQuery.where('status', '==', status);
    }

    const sentSnapshot = await sentQuery.get();
    const sentConnections = [];

    sentSnapshot.forEach((doc) => {
      sentConnections.push({
        id: doc.id,
        type: 'sent',
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      });
    });

    // Get connections where this guest is the recipient
    let receivedQuery = req.db.collection('guestConnections').where('toGuest.email', '==', email);

    if (status) {
      receivedQuery = receivedQuery.where('status', '==', status);
    }

    const receivedSnapshot = await receivedQuery.get();
    const receivedConnections = [];

    receivedSnapshot.forEach((doc) => {
      receivedConnections.push({
        id: doc.id,
        type: 'received',
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      });
    });

    // Combine and sort by date
    const allConnections = [...sentConnections, ...receivedConnections];
    allConnections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        connections: allConnections,
        summary: {
          total: allConnections.length,
          sent: sentConnections.length,
          received: receivedConnections.length,
          accepted: allConnections.filter((c) => c.status === 'accepted').length,
          pending: allConnections.filter((c) => c.status === 'pending').length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guest connections',
      error: error.message,
    });
  }
});

// Helper function to calculate match score
function calculateMatchScore(fromGuest, toGuest, sharedInterests) {
  let score = 50; // Base score

  // Shared interests boost
  score += sharedInterests.length * 10;

  // Same table boost
  if (fromGuest.table && toGuest.table && fromGuest.table === toGuest.table) {
    score += 20;
  }

  // Relationship type boost
  if (fromGuest.relationship === toGuest.relationship) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

// Helper function to generate connection reasons
function generateConnectionReasons(guest, sharedInterests) {
  const reasons = [];

  if (guest.table) {
    reasons.push(`Both seated at table ${guest.table}`);
  }

  if (sharedInterests.length > 0) {
    reasons.push(`Shared interests: ${sharedInterests.join(', ')}`);
  }

  if (guest.relationship) {
    reasons.push(`Fellow ${guest.relationship} of the couple`);
  }

  const genericReasons = [
    'Lives in the same area',
    'Similar professional background',
    'Attended same school',
    'Common hobbies and activities',
  ];

  if (reasons.length < 3) {
    const randomReason = genericReasons[Math.floor(Math.random() * genericReasons.length)];
    reasons.push(randomReason);
  }

  return reasons.slice(0, 3);
}

export default router;
