#!/usr/bin/env node

import { promises as fs } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');

// Files that need API import fixes
const filesToFix = [
  'src/page-components/__tests__/AlbumPage.test.jsx',
  'src/page-components/interactive/MapPage.jsx',
  'src/page-components/interactive/GuestbookPage.jsx',
  'src/page-components/gallery/AlbumPage.jsx',
  'src/page-components/gallery/MagicalAlbumPage.jsx',
  'src/page-components/__tests__/GuestbookPage.error.test.jsx',
  'src/components/admin/AdminDashboard.jsx',
  'src/components/forms/UploadForm.jsx',
  'src/components/__tests__/AdminDashboard.auth.test.jsx',
  'src/components/__tests__/AdminDashboard.session.test.jsx',
  'src/components/__tests__/AlbumPage.empty.test.jsx',
  'src/components/__tests__/UploadForm.test.jsx',
];

// Mapping for correct import paths from different directory levels
const importPathMapping = {
  // From page-components
  'src/page-components/interactive/': '../../services/api',
  'src/page-components/gallery/': '../../services/api',
  'src/page-components/__tests__/': '../services/api',

  // From components
  'src/components/admin/': '../../services/api',
  'src/components/forms/': '../../services/api',
  'src/components/__tests__/': '../services/api',
};

function getCorrectImportPath(filePath) {
  for (const [dirPattern, correctPath] of Object.entries(importPathMapping)) {
    if (filePath.startsWith(dirPattern)) {
      return correctPath;
    }
  }
  // Default fallback
  return '../services/api';
}

async function fixApiImports() {
  let fixedFiles = 0;

  console.log('🔧 Fixing API imports...\n');

  for (const filePath of filesToFix) {
    const fullPath = join(rootDir, filePath);

    try {
      const content = await fs.readFile(fullPath, 'utf8');
      const correctImportPath = getCorrectImportPath(filePath);

      // Fix various patterns of API imports
      let updatedContent = content
        // Fix imports with .js extension
        .replace(/from\s+["'](.*)\/services\/api\.js["']/g, `from "${correctImportPath}"`)
        // Fix imports without .js but incorrect paths
        .replace(/from\s+["'](\.\.\/)*services\/api["']/g, `from "${correctImportPath}"`)
        // Fix specific patterns that might be using wrong relative paths
        .replace(
          /from\s+["']\.\.\/\.\.\/\.\.\/services\/api\.js["']/g,
          `from "${correctImportPath}"`
        )
        .replace(/from\s+["']\.\.\/\.\.\/services\/api\.js["']/g, `from "${correctImportPath}"`)
        .replace(/from\s+["']\.\.\/services\/api\.js["']/g, `from "${correctImportPath}"`);

      if (updatedContent !== content) {
        await fs.writeFile(fullPath, updatedContent, 'utf8');
        console.log(`✅ Fixed API imports in: ${filePath}`);
        console.log(`   Import path: "${correctImportPath}"`);
        fixedFiles++;
      } else {
        console.log(`ℹ️  No changes needed: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  console.log(`\n🎉 Fixed API imports in ${fixedFiles} files!`);
}

// Also check for any remaining CSS import issues
async function checkForMissingCssFiles() {
  console.log('\n🔍 Checking for missing CSS files...\n');

  // Check for common CSS files that might be missing
  const cssChecks = [
    { file: 'src/components/Navbar-premium.css', pattern: 'Navbar-premium.css' },
    { file: 'src/styles/modern-2025-design.css', pattern: 'modern-2025-design.css' },
    { file: 'src/components/LandingPage.css', pattern: 'LandingPage.css' },
    { file: 'src/components/MemoryWall.css', pattern: 'MemoryWall.css' },
    { file: 'src/components/NotificationBanner.css', pattern: 'NotificationBanner.css' },
  ];

  for (const { file, pattern } of cssChecks) {
    const fullPath = join(rootDir, file);
    try {
      await fs.access(fullPath);
      console.log(`✅ CSS file exists: ${file}`);
    } catch {
      console.log(`❌ CSS file missing: ${file}`);

      // Create a basic CSS file
      const basicCss = `/* ${pattern} - Auto-generated CSS file */

/* Basic styles for ${pattern.replace('.css', '')} */
.${pattern.replace('.css', '').toLowerCase().replace('-', '_')} {
  /* Add your styles here */
}
`;

      try {
        await fs.mkdir(dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, basicCss, 'utf8');
        console.log(`✅ Created basic CSS file: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to create CSS file ${file}:`, error.message);
      }
    }
  }
}

// Run the fixes
await fixApiImports();
await checkForMissingCssFiles();

console.log('\n✨ API import fixes completed!');
