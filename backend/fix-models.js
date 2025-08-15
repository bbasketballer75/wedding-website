#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const modelFiles = ['backend/models/VisitorLog.firestore.js', 'backend/models/Photo.firestore.js'];

const rootDir = 'c:/Users/Austin/Downloads/wedding-website';

for (const file of modelFiles) {
  const filePath = path.join(rootDir, file);
  console.log(`Fixing ${file}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import
  content = content.replace(
    "import dbPromise from '../config/firestore.js';",
    "import getDbPromise from '../config/firestore.js';"
  );

  // Replace all usage
  content = content.replace(/const db = await dbPromise;/g, 'const db = await getDbPromise();');

  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${file}`);
}

console.log('All model files updated!');
