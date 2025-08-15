#!/usr/bin/env node

import fs from 'fs';

const files = [
  'c:/Users/Austin/Downloads/wedding-website/backend/controllers/albumController.js',
  'c:/Users/Austin/Downloads/wedding-website/backend/routes/guestMemories.js',
];

for (const filePath of files) {
  console.log(`Fixing ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace cloudStorage usage with function calls
  content = content.replace(/cloudStorage\./g, 'getCloudStorage().');
  content = content.replace(/cloudStorageService\./g, 'getCloudStorage().');

  // Fix imports
  content = content.replace(
    /import cloudStorage from '\.\.\/services\/cloudStorage\.js';/g,
    "import getCloudStorage from '../services/cloudStorage.js';"
  );
  content = content.replace(
    /import cloudStorageService from '\.\.\/services\/cloudStorage\.js';/g,
    "import getCloudStorage from '../services/cloudStorage.js';"
  );

  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${filePath}`);
}

console.log('All cloudStorage files updated!');
