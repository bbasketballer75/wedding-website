import dotenv from 'dotenv';
dotenv.config();

import { getGoogleCredentials } from './config/gcp-credentials.js';

console.log('Testing credential loading...');
try {
  const creds = getGoogleCredentials();
  console.log('✅ Credentials loaded successfully');
  console.log('Project ID:', creds.project_id);
  console.log('Client Email:', creds.client_email);
  console.log('Private key length:', creds.private_key.length);
} catch (error) {
  console.error('❌ Error loading credentials:', error.message);
  console.error('Stack:', error.stack);
}
