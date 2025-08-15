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
 * 🎉 Guest Reunion Planning Routes
 * Handles anniversary party planning, RSVPs, and guest coordination
 */

// Get all upcoming reunion events
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const now = new Date();

    const eventsQuery = query(
      collection(db, 'reunionEvents'),
      where('eventDate', '>=', now),
      orderBy('eventDate', 'asc')
    );

    const snapshot = await getDocs(eventsQuery);
    const events = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const eventDate = data.eventDate?.toDate?.() || new Date(data.eventDate);

      events.push({
        id: doc.id,
        ...data,
        eventDate: eventDate.toISOString(),
        daysUntilEvent: Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24)),
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        rsvpStats: calculateRSVPStats(data.rsvps || []),
      });
    });

    res.json({
      success: true,
      data: {
        events,
        upcomingEvent: events[0] || null,
      },
    });
  })
);

// Get past reunion events
router.get(
  '/past',
  asyncHandler(async (req, res) => {
    const now = new Date();

    const pastEventsQuery = query(
      collection(db, 'reunionEvents'),
      where('eventDate', '<', now),
      orderBy('eventDate', 'desc')
    );

    const snapshot = await getDocs(pastEventsQuery);
    const pastEvents = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      pastEvents.push({
        id: doc.id,
        ...data,
        eventDate: data.eventDate?.toDate?.()?.toISOString() || data.eventDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        rsvpStats: calculateRSVPStats(data.rsvps || []),
      });
    });

    res.json({
      success: true,
      data: { pastEvents },
    });
  })
);

// Get a specific reunion event
router.get(
  '/:eventId',
  asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    const eventRef = doc(db, 'reunionEvents', eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Reunion event not found' },
      });
    }

    const data = eventSnap.data();
    const eventDate = data.eventDate?.toDate?.() || new Date(data.eventDate);
    const now = new Date();

    res.json({
      success: true,
      data: {
        id: eventSnap.id,
        ...data,
        eventDate: eventDate.toISOString(),
        daysUntilEvent: Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24)),
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        rsvpStats: calculateRSVPStats(data.rsvps || []),
        attendeesList: (data.rsvps || [])
          .filter((rsvp) => rsvp.response === 'yes')
          .map((rsvp) => ({
            name: rsvp.guestName,
            plusOnes: rsvp.plusOnes || 0,
            dietaryRestrictions: rsvp.dietaryRestrictions || '',
            rsvpDate: rsvp.submittedAt,
          })),
      },
    });
  })
);

// Create a new reunion event
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      eventTitle,
      eventDescription,
      eventDate,
      eventTime,
      location,
      eventType,
      maxCapacity,
      requiresRSVP = true,
      isVirtual = false,
      virtualLink = '',
      organizerName,
      organizerEmail,
      organizerPhone = '',
      eventDetails = {},
    } = req.body;

    // Validation
    if (!eventTitle || !eventDate || !location || !organizerName) {
      return res.status(400).json({
        success: false,
        error: { message: 'Event title, date, location, and organizer name are required' },
      });
    }

    const eventDateTime = new Date(`${eventDate}T${eventTime || '18:00'}`);
    const now = new Date();

    if (eventDateTime <= now) {
      return res.status(400).json({
        success: false,
        error: { message: 'Event date must be in the future' },
      });
    }

    const eventData = {
      eventTitle: eventTitle.trim(),
      eventDescription: eventDescription?.trim() || '',
      eventDate: eventDateTime,
      location: location.trim(),
      eventType: eventType || 'anniversary-party',
      maxCapacity: maxCapacity || null,
      requiresRSVP,
      isVirtual,
      virtualLink: isVirtual ? virtualLink : '',
      organizerName: organizerName.trim(),
      organizerEmail: organizerEmail?.trim() || '',
      organizerPhone: organizerPhone.trim(),
      eventDetails: {
        ...eventDetails,
        dressCode: eventDetails.dressCode || 'Casual',
        giftSuggestions: eventDetails.giftSuggestions || '',
        specialInstructions: eventDetails.specialInstructions || '',
      },
      createdAt: new Date(),
      status: 'active',
      rsvps: [],
      eventCode: generateEventCode(),
      remindersSent: [],
      photos: [],
      attendanceTracking: {
        expectedAttendees: 0,
        actualAttendees: 0,
        checkInTimes: [],
      },
    };

    const docRef = await addDoc(collection(db, 'reunionEvents'), eventData);

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        message: 'Reunion event created successfully!',
        event: {
          ...eventData,
          id: docRef.id,
          eventDate: eventData.eventDate.toISOString(),
          createdAt: eventData.createdAt.toISOString(),
        },
        eventInvite: {
          eventCode: eventData.eventCode,
          shareUrl: `${process.env.REACT_APP_BASE_URL}/reunion/${docRef.id}`,
          inviteMessage: generateInviteMessage(eventTitle, eventDateTime, location),
        },
      },
    });
  })
);

// RSVP to a reunion event
router.post(
  '/:eventId/rsvp',
  asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const {
      guestName,
      guestEmail,
      response, // 'yes', 'no', 'maybe'
      plusOnes = 0,
      dietaryRestrictions = '',
      specialRequests = '',
      message = '',
    } = req.body;

    // Validation
    if (!guestName || !response || !['yes', 'no', 'maybe'].includes(response)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Guest name and valid response (yes/no/maybe) are required' },
      });
    }

    const eventRef = doc(db, 'reunionEvents', eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Reunion event not found' },
      });
    }

    const eventData = eventSnap.data();
    const eventDate = eventData.eventDate?.toDate?.() || new Date(eventData.eventDate);

    if (new Date() > eventDate) {
      return res.status(400).json({
        success: false,
        error: { message: 'Cannot RSVP to past events' },
      });
    }

    // Check capacity
    if (eventData.maxCapacity && response === 'yes') {
      const currentYesRSVPs = (eventData.rsvps || [])
        .filter((rsvp) => rsvp.response === 'yes')
        .reduce((total, rsvp) => total + 1 + (rsvp.plusOnes || 0), 0);

      const newTotal = currentYesRSVPs + 1 + plusOnes;

      if (newTotal > eventData.maxCapacity) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Event is at capacity',
            availableSpots: Math.max(0, eventData.maxCapacity - currentYesRSVPs),
          },
        });
      }
    }

    const rsvpData = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      guestName: guestName.trim(),
      guestEmail: guestEmail?.trim() || '',
      response,
      plusOnes: Math.max(0, plusOnes),
      dietaryRestrictions: dietaryRestrictions.trim(),
      specialRequests: specialRequests.trim(),
      message: message.trim(),
      submittedAt: new Date(),
      checkedIn: false,
    };

    // Remove any existing RSVP from this guest and add new one
    const existingRSVPs = (eventData.rsvps || []).filter(
      (rsvp) => rsvp.guestEmail !== guestEmail && rsvp.guestName !== guestName
    );

    const updatedRSVPs = [...existingRSVPs, rsvpData];

    await updateDoc(eventRef, {
      rsvps: updatedRSVPs,
      lastRSVPUpdate: new Date(),
    });

    res.json({
      success: true,
      data: {
        message: `RSVP submitted successfully! Response: ${response}`,
        rsvp: {
          ...rsvpData,
          submittedAt: rsvpData.submittedAt.toISOString(),
        },
        eventDetails: {
          eventTitle: eventData.eventTitle,
          eventDate: eventDate.toISOString(),
          location: eventData.location,
        },
      },
    });
  })
);

// Get RSVP statistics for an event
router.get(
  '/:eventId/rsvps',
  asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    const eventRef = doc(db, 'reunionEvents', eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Reunion event not found' },
      });
    }

    const eventData = eventSnap.data();
    const rsvps = eventData.rsvps || [];

    const stats = calculateRSVPStats(rsvps);

    res.json({
      success: true,
      data: {
        stats,
        rsvps: rsvps.map((rsvp) => ({
          ...rsvp,
          submittedAt: rsvp.submittedAt?.toDate?.()?.toISOString() || rsvp.submittedAt,
        })),
        capacity: {
          maxCapacity: eventData.maxCapacity,
          currentAttendees: stats.attendeeCount,
          spotsRemaining: eventData.maxCapacity
            ? Math.max(0, eventData.maxCapacity - stats.attendeeCount)
            : null,
        },
      },
    });
  })
);

// Update event details
router.patch(
  '/:eventId',
  asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.rsvps;
    delete updates.eventCode;
    delete updates.createdAt;
    delete updates.organizerEmail; // Prevent email hijacking

    if (updates.eventDate) {
      updates.eventDate = new Date(updates.eventDate);

      if (updates.eventDate <= new Date()) {
        return res.status(400).json({
          success: false,
          error: { message: 'Event date must be in the future' },
        });
      }
    }

    const eventRef = doc(db, 'reunionEvents', eventId);
    await updateDoc(eventRef, {
      ...updates,
      lastModifiedAt: new Date(),
    });

    res.json({
      success: true,
      data: {
        message: 'Event updated successfully',
        eventId,
      },
    });
  })
);

// Helper Functions
function calculateRSVPStats(rsvps) {
  const stats = {
    total: rsvps.length,
    yes: 0,
    no: 0,
    maybe: 0,
    attendeeCount: 0,
    dietaryRestrictions: [],
    specialRequests: [],
  };

  rsvps.forEach((rsvp) => {
    stats[rsvp.response]++;

    if (rsvp.response === 'yes') {
      stats.attendeeCount += 1 + (rsvp.plusOnes || 0);
    }

    if (rsvp.dietaryRestrictions) {
      stats.dietaryRestrictions.push({
        guest: rsvp.guestName,
        restrictions: rsvp.dietaryRestrictions,
      });
    }

    if (rsvp.specialRequests) {
      stats.specialRequests.push({
        guest: rsvp.guestName,
        request: rsvp.specialRequests,
      });
    }
  });

  return stats;
}

function generateEventCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateInviteMessage(eventTitle, eventDate, location) {
  return `You're invited to ${eventTitle}! 🎉

Join us on ${eventDate.toDateString()} at ${location} for a special reunion celebration.

Please RSVP so we can plan accordingly. We can't wait to see you there!

Best regards,
Austin & Jordyn`;
}

export default router;
