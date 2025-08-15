#!/usr/bin/env node

/**
 * Add Sample Guestbook Entries to Production Database
 * This script adds some beautiful sample guestbook entries to make the site look lived-in
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin (using environment variables)
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.GCP_PROJECT_ID,
  private_key_id: process.env.GCP_PRIVATE_KEY_ID,
  private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GCP_CLIENT_EMAIL,
  client_id: process.env.GCP_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GCP_CLIENT_EMAIL}`,
};

try {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.GCP_PROJECT_ID,
  });
} catch (error) {
  console.log('Firebase already initialized or error:', error.message);
}

const db = getFirestore();

// Sample guestbook entries that sound realistic and heartfelt
const sampleEntries = [
  {
    name: 'Sarah & Mike Johnson',
    message:
      "What a beautiful wedding! Austin & Jordyn, you two are perfect together. Thank you for letting us be part of your special day. Here's to a lifetime of happiness! 💕",
    timestamp: new Date('2025-07-15T18:30:00Z'), // Wedding day evening
  },
  {
    name: 'The Martinez Family',
    message:
      'Congratulations to the happy couple! The ceremony was absolutely magical and the reception was so much fun. Wishing you both all the love in the world! ✨',
    timestamp: new Date('2025-07-15T19:45:00Z'),
  },
  {
    name: 'Emily Thompson',
    message:
      'Jordyn, you looked absolutely stunning! And Austin, the way you looked at her during the ceremony made everyone cry happy tears. So excited for your journey together! 👰💒',
    timestamp: new Date('2025-07-15T20:15:00Z'),
  },
  {
    name: 'Coach Williams',
    message:
      "Austin, I've watched you grow up and I couldn't be prouder of the man you've become. Jordyn, welcome to the family! You two are meant to be. 🏀❤️",
    timestamp: new Date('2025-07-15T21:00:00Z'),
  },
  {
    name: 'Jessica & David',
    message:
      'The first dance was PERFECTION! You could see the love radiating from both of you. Thank you for the amazing celebration - we danced all night! 💃🕺',
    timestamp: new Date('2025-07-15T22:30:00Z'),
  },
  {
    name: 'Grandma Rose',
    message:
      'My dear Austin and sweet Jordyn, seeing you both so happy fills my heart with joy. May your love story continue to inspire everyone around you. All my love! 🌹',
    timestamp: new Date('2025-07-16T10:00:00Z'), // Next morning
  },
  {
    name: 'The College Crew',
    message:
      "Best wedding EVER! From the emotional ceremony to the epic dance party - you two know how to celebrate! Can't wait for the next reunion. Love you both! 🎉",
    timestamp: new Date('2025-07-16T14:30:00Z'),
  },
  {
    name: 'Aunt Linda & Uncle Bob',
    message:
      "What a perfect day for two perfect people! The venue was gorgeous, the food was delicious, and watching you two say 'I do' was the highlight of our year. Much love! 💒",
    timestamp: new Date('2025-07-17T09:15:00Z'),
  },
  {
    name: 'Work Squad',
    message:
      'Jordyn, we loved seeing you so radiant and happy! Austin is one lucky guy. Thanks for the open bar and the amazing cake - still thinking about it! 🍰🥂',
    timestamp: new Date('2025-07-17T16:45:00Z'),
  },
  {
    name: 'The Photography Team',
    message:
      'It was an honor to capture your special day! The love between you two made our job easy - every shot was magical. Congratulations on your beautiful beginning! 📸✨',
    timestamp: new Date('2025-07-18T11:20:00Z'),
  },
];

async function addSampleEntries() {
  console.log('🎊 Adding sample guestbook entries...');

  try {
    // Check if entries already exist to avoid duplicates
    const existingSnapshot = await db.collection('guestbookEntries').limit(1).get();

    if (!existingSnapshot.empty) {
      console.log('⚠️  Guestbook already has entries. Skipping sample data to avoid duplicates.');
      console.log('   If you want to add sample data anyway, clear the guestbook first.');
      return;
    }

    // Add each sample entry
    for (const entry of sampleEntries) {
      const docRef = await db.collection('guestbookEntries').add({
        name: entry.name,
        message: entry.message,
        timestamp: Timestamp.fromDate(entry.timestamp),
      });

      console.log(`✅ Added entry from "${entry.name}" (ID: ${docRef.id})`);
    }

    console.log(`\n🎉 Successfully added ${sampleEntries.length} sample guestbook entries!`);
    console.log('📝 Your guestbook now has realistic entries to make the site feel lived-in.');
  } catch (error) {
    console.error('❌ Error adding sample entries:', error);

    if (error.message.includes('permission')) {
      console.log('\n💡 This might be a permissions issue. Make sure:');
      console.log('   - Your GCP service account has Firestore write access');
      console.log('   - All environment variables are properly set');
    }
  }
}

// Run the script
addSampleEntries()
  .then(() => {
    console.log('🏁 Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
