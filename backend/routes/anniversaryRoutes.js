import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

/**
 * 🎊 Anniversary & Milestone Management Routes
 * Handles anniversary calculations, countdown widgets, and milestone tracking
 */

// Get upcoming milestones and anniversary information
router.get(
  '/milestones',
  asyncHandler(async (req, res) => {
    const weddingDate = new Date('2025-06-14');
    const now = new Date();
    const daysSinceWedding = Math.floor((now - weddingDate) / (1000 * 60 * 60 * 24));

    const milestones = {
      special: [
        { days: 100, name: '100 Days Married' },
        { days: 365, name: 'First Year Complete' },
        { days: 1000, name: '1000 Days of Love' },
        { days: 1825, name: '5 Years Together' }, // 5 years
        { days: 3650, name: '10 Years Together' }, // 10 years
      ],
    };

    const upcoming = milestones.special
      .filter((milestone) => daysSinceWedding < milestone.days)
      .map((milestone) => ({
        type: 'special',
        name: milestone.name,
        daysUntil: milestone.days - daysSinceWedding,
        date: new Date(weddingDate.getTime() + milestone.days * 24 * 60 * 60 * 1000),
        percentage: ((milestone.days - (milestone.days - daysSinceWedding)) / milestone.days) * 100,
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil);

    // Add monthly anniversaries
    const monthsMarried = Math.floor(daysSinceWedding / 30);
    const nextMonthlyAnniversary = {
      type: 'monthly',
      name: `${monthsMarried + 1} Month Anniversary`,
      daysUntil: (monthsMarried + 1) * 30 - daysSinceWedding,
      date: new Date(weddingDate.getTime() + (monthsMarried + 1) * 30 * 24 * 60 * 60 * 1000),
      percentage: ((daysSinceWedding % 30) / 30) * 100,
    };

    if (nextMonthlyAnniversary.daysUntil > 0) {
      upcoming.push(nextMonthlyAnniversary);
    }

    // Sort by days until
    upcoming.sort((a, b) => a.daysUntil - b.daysUntil);

    const inspirationalQuotes = [
      'Every love story is beautiful, but ours is my favorite.',
      'Together is a wonderful place to be.',
      'Love grows more tremendously full, swift, poignant, as the years multiply.',
      'The best thing to hold onto in life is each other.',
      'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.',
      'In all the world, there is no heart for me like yours.',
    ];

    res.json({
      success: true,
      data: {
        weddingDate: weddingDate.toISOString(),
        daysSinceWedding,
        monthsMarried,
        yearsMarried: Math.floor(daysSinceWedding / 365),
        upcomingMilestones: upcoming.slice(0, 5), // Next 5 milestones
        nextMilestone: upcoming[0] || null,
        inspirationalQuote:
          inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)],
        stats: {
          totalMilestones: milestones.special.length,
          milestonesReached: milestones.special.filter((m) => daysSinceWedding >= m.days).length,
          nextMajorMilestone: upcoming.find((m) => m.type === 'special') || null,
        },
      },
    });
  })
);

// Get anniversary countdown widget data
router.get(
  '/countdown',
  asyncHandler(async (req, res) => {
    const weddingDate = new Date('2025-06-14');
    const now = new Date();
    const daysSinceWedding = Math.floor((now - weddingDate) / (1000 * 60 * 60 * 24));

    // Get next anniversary (yearly)
    const nextAnniversaryYear = Math.floor(daysSinceWedding / 365) + 1;
    const nextAnniversaryDate = new Date(weddingDate);
    nextAnniversaryDate.setFullYear(weddingDate.getFullYear() + nextAnniversaryYear);

    const daysUntilAnniversary = Math.floor((nextAnniversaryDate - now) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      data: {
        nextAnniversary: {
          year: nextAnniversaryYear,
          date: nextAnniversaryDate.toISOString(),
          daysUntil: daysUntilAnniversary,
          title: `${nextAnniversaryYear} Year Anniversary`,
          percentage: ((365 - daysUntilAnniversary) / 365) * 100,
        },
        currentStats: {
          daysTogether: daysSinceWedding,
          weeksTogether: Math.floor(daysSinceWedding / 7),
          monthsTogether: Math.floor(daysSinceWedding / 30),
          yearsTogether: Math.floor(daysSinceWedding / 365),
        },
      },
    });
  })
);

// Generate anniversary celebration content
router.get(
  '/celebration-content/:milestoneId',
  asyncHandler(async (req, res) => {
    const { milestoneId } = req.params;

    const celebrationTemplates = {
      '100-days': {
        title: '100 Days of Marriage! 🎉',
        message: 'Austin & Jordyn have been married for 100 amazing days!',
        socialShareText:
          'Celebrating 100 days of marriage! Austin & Jordyn are living their best life together! 💕 #100DaysMarried #ThePoradas',
        emailSubject: '🎊 Celebrating 100 Days of Marriage!',
        celebrationIdeas: [
          'Recreate your first date',
          'Write love letters to each other',
          'Plant a tree together',
          'Create a photo album of your first 100 days',
        ],
      },
      '1-year': {
        title: 'Our First Year Together! 💕',
        message: 'Austin & Jordyn are celebrating their first wedding anniversary!',
        socialShareText:
          'One year ago today, Austin & Jordyn said "I do"! Here\'s to many more years of love and happiness! 💍 #FirstAnniversary #ThePoradas',
        emailSubject: '🥂 Happy First Anniversary!',
        celebrationIdeas: [
          'Return to your wedding venue',
          'Recreate your wedding cake',
          'Watch your wedding video',
          'Plan a romantic getaway',
        ],
      },
      default: {
        title: 'Another Milestone Reached! 🎊',
        message: 'Austin & Jordyn continue their beautiful journey together!',
        socialShareText:
          "Celebrating another milestone in Austin & Jordyn's love story! 💕 #MilestoneReached #ThePoradas",
        emailSubject: '🎉 Milestone Celebration!',
        celebrationIdeas: [
          'Plan a special date night',
          'Create new memories together',
          'Reflect on your journey so far',
          'Set goals for the future',
        ],
      },
    };

    const content = celebrationTemplates[milestoneId] || celebrationTemplates.default;

    res.json({
      success: true,
      data: content,
    });
  })
);

// Save anniversary notification preferences
router.post(
  '/notifications',
  asyncHandler(async (req, res) => {
    const { email, milestones, frequency } = req.body;

    if (!email || !milestones) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and milestone preferences are required' },
      });
    }

    // In a real app, save to database
    // For now, just return success
    res.json({
      success: true,
      data: {
        message: 'Anniversary notification preferences saved!',
        preferences: {
          email,
          milestones,
          frequency,
          savedAt: new Date().toISOString(),
        },
      },
    });
  })
);

export default router;
