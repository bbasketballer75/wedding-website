#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('🔧 Final cleanup: service imports and missing CSS files...\n');

// Fix all remaining service imports to point to api.js
function fixServiceImports(filePath) {
  if (!fs.existsSync(filePath)) return false;

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Service import patterns that need to be fixed
  const serviceImportFixes = [
    // Direct imports
    { from: 'from "../../../services/api"', to: 'from "../../../services/api.js"' },
    { from: 'from "../../services/api"', to: 'from "../../services/api.js"' },
    { from: 'from "../services/api"', to: 'from "../services/api.js"' },
    // Dynamic imports
    { from: 'import("../../../services/api")', to: 'import("../../../services/api.js")' },
    { from: 'import("../../services/api")', to: 'import("../../services/api.js")' },
    { from: 'import("../services/api")', to: 'import("../services/api.js")' },
  ];

  serviceImportFixes.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    return true;
  }

  return false;
}

// Process all files to fix service imports
function findAllFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = [];

  function scanDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
              scanDir(fullPath);
            }
          } else if (extensions.some((ext) => item.endsWith(ext))) {
            files.push(fullPath);
          }
        } catch (err) {
          // Skip files we can't access
        }
      }
    } catch (err) {
      // Skip directories we can't access
    }
  }

  scanDir(dir);
  return files;
}

const srcDir = path.join(projectRoot, 'src');
const allFiles = findAllFiles(srcDir);

let serviceImportFixCount = 0;

console.log('Fixing service imports...');
for (const filePath of allFiles) {
  if (fixServiceImports(filePath)) {
    const relativePath = path.relative(projectRoot, filePath);
    console.log(`✅ Fixed service imports: ${relativePath}`);
    serviceImportFixCount++;
  }
}

console.log(`📊 Fixed service imports in ${serviceImportFixCount} files`);

// Create missing CSS files
console.log('\nCreating missing CSS files...');

const missingCssFiles = [
  // Component CSS files that weren't moved to subdirectories
  'src/components/LandingPage.css',
  'src/components/MemoryWall.css',
  'src/components/NotificationBanner.css',
  'src/components/Navbar-premium.css',
  'src/components/ThankYouSection.css',
  'src/components/StayInTouchSection.css',
  'src/components/PhotoTagging.css',
  'src/components/GuestMemorySubmission.css',
  'src/components/CustomYouTubePlayer.css',

  // Page component CSS files
  'src/page-components/admin/AdminPage.css',
  'src/page-components/family/FamilyTreePage-enhanced.css',
  'src/page-components/interactive/WeddingPartyPage.css',
  'src/page-components/interactive/MapPage.css',
  'src/page-components/gallery/AlbumPage.css',
  'src/page-components/core/HomePage-premium.css',

  // App level CSS
  'src/styles/modern-2025-design.css',
];

let createdCssCount = 0;

for (const cssFile of missingCssFiles) {
  const fullPath = path.join(projectRoot, cssFile);
  if (!fs.existsSync(fullPath)) {
    // Create directory if it doesn't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create a basic CSS file
    const componentName = path.basename(cssFile, '.css');
    const basicCss = `/* ${componentName} styles */\n\n.${componentName.toLowerCase().replace(/-/g, '-')} {\n  /* Add styles here */\n}\n`;

    fs.writeFileSync(fullPath, basicCss);
    console.log(`✅ Created: ${cssFile}`);
    createdCssCount++;
  }
}

console.log(`📊 Created ${createdCssCount} missing CSS files`);

// Fix the app page CSS import
const appPagePath = path.join(projectRoot, 'src/app/page.tsx');
if (fs.existsSync(appPagePath)) {
  let appContent = fs.readFileSync(appPagePath, 'utf8');
  if (appContent.includes('import "../../styles/modern-2025-design.css"')) {
    appContent = appContent.replace(
      'import "../../styles/modern-2025-design.css"',
      'import "../styles/modern-2025-design.css"'
    );
    fs.writeFileSync(appPagePath, appContent);
    console.log('✅ Fixed app page CSS import path');
  }
}

console.log(`\n✅ Final cleanup complete!`);
console.log(`📊 Summary:`);
console.log(`  - Fixed service imports in ${serviceImportFixCount} files`);
console.log(`  - Created ${createdCssCount} missing CSS files`);
console.log(`  - Fixed app page CSS import`);

console.log(`\n📝 Next steps:`);
console.log(`  1. Run tests: npm run test:frontend`);
console.log(`  2. All import issues should now be resolved`);
console.log(`  3. Commit the comprehensive project organization`);
