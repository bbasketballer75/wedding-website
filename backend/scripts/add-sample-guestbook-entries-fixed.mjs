#!/usr/bin/env node

/**
 * Add Sample Guestbook Entries to Production Database
 * This script adds some beautiful sample guestbook entries to make the site look lived-in
 */

import { Timestamp } from 'firebase-admin/firestore';
import dbPromise from '../config/firestore.js';

// Wait for database connection
console.log('Connecting to Firestore...');
const db = await dbPromise;
console.log('Connected to Firestore successfully');

// Sample guestbook entries that sound realistic and heartfelt
const sampleEntries = [
  {
    name: 'Sarah & Mike Johnson',
    message:
      'Austin and Jordyn, what a magical day! Your love for each other was so evident in every moment. Thank you for letting us be part of your beautiful beginning. Wishing you a lifetime of happiness! 💕',
    timestamp: Timestamp.fromDate(new Date('2024-12-15T16:30:00Z')),
    approved: true,
  },
  {
    name: 'The Williams Family',
    message:
      "We've watched Austin grow up and it's been such a joy to see him find his perfect match in Jordyn. You two complement each other so beautifully. Here's to many years of love and laughter!",
    timestamp: Timestamp.fromDate(new Date('2024-12-15T17:45:00Z')),
    approved: true,
  },
  {
    name: 'Emma & David',
    message:
      "From college friends to newlyweds - it's been amazing to witness your journey! The ceremony was absolutely perfect and your happiness was contagious. Love you both! ❤️",
    timestamp: Timestamp.fromDate(new Date('2024-12-15T18:15:00Z')),
    approved: true,
  },
  {
    name: 'Grandma Rose',
    message:
      'My dear Austin and sweet Jordyn, seeing you two together fills my heart with so much joy. May your marriage be blessed with love, laughter, and beautiful memories. With all my love! 💐',
    timestamp: Timestamp.fromDate(new Date('2024-12-15T19:00:00Z')),
    approved: true,
  },
  {
    name: 'The Peterson Crew',
    message:
      'What an incredible celebration! The venue was stunning, but nothing compared to the love radiating from you two. Thank you for such a wonderful evening. Cheers to the happy couple! 🥂',
    timestamp: Timestamp.fromDate(new Date('2024-12-15T20:30:00Z')),
    approved: true,
  },
  {
    name: 'Jessica & Ryan',
    message:
      "Austin & Jordyn, your wedding was absolutely beautiful! We're so grateful to have been there to celebrate with you. Wishing you endless happiness and adventures together! 💒",
    timestamp: Timestamp.fromDate(new Date('2024-12-16T10:20:00Z')),
    approved: true,
  },
  {
    name: 'Coach Martinez',
    message:
      "Austin, I've seen you grow from a young athlete to an incredible man, and Jordyn, you've brought out the best in him. What a perfect match! Congratulations to you both! 🏆",
    timestamp: Timestamp.fromDate(new Date('2024-12-16T14:45:00Z')),
    approved: true,
  },
  {
    name: 'The Thompson Family',
    message:
      'Such a beautiful ceremony and reception! Your love story is truly inspiring. Thank you for including us in your special day. Wishing you both a lifetime of happiness! 🌟',
    timestamp: Timestamp.fromDate(new Date('2024-12-16T16:30:00Z')),
    approved: true,
  },
];

/**
 * Add sample guestbook entries to Firestore
 */
async function addSampleEntries() {
  try {
    console.log('Adding sample guestbook entries...');
    const guestbookRef = db.collection('guestbook');

    // Check if entries already exist
    const existingEntries = await guestbookRef.limit(1).get();
    if (!existingEntries.empty) {
      console.log('Guestbook already has entries. Skipping sample data insertion.');
      return;
    }

    const batch = db.batch();

    sampleEntries.forEach((entry, index) => {
      const docRef = guestbookRef.doc(); // Auto-generate ID
      batch.set(docRef, entry);
      console.log(`Queued entry ${index + 1}: ${entry.name}`);
    });

    await batch.commit();
    console.log(`Successfully added ${sampleEntries.length} sample guestbook entries!`);

    // Verify the entries were added
    const snapshot = await guestbookRef.get();
    console.log(`Total guestbook entries in database: ${snapshot.size}`);
  } catch (error) {
    console.error('Error adding sample guestbook entries:', error);
    throw error;
  }
}

// Execute the script
if (import.meta.url === `file://${process.argv[1]}`) {
  addSampleEntries()
    .then(() => {
      console.log('Sample guestbook entries script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { addSampleEntries };
