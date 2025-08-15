#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('🔧 Comprehensive import path cleanup...\n');

// Function to fix a single file
function fixFileImports(filePath) {
  if (!fs.existsSync(filePath)) return false;

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  const changes = [];

  // Fix service imports - point to the correct api.js file
  const serviceImportPatterns = [
    {
      from: /from ['"]\.\.\/\.\.\/\.\.\/services\/api\/api['"]/,
      to: 'from "../../../services/api"',
    },
    { from: /from ['"]\.\.\/\.\.\/services\/api\/api['"]/, to: 'from "../../services/api"' },
    { from: /from ['"]\.\.\/\.\.\/services\/api\/api\.js['"]/, to: 'from "../../services/api.js"' },
    { from: /from ['"]\.\.\/services\/api\/api\.js['"]/, to: 'from "../services/api.js"' },
    {
      from: /import\(['"]\.\.\/\.\.\/\.\.\/services\/api\/api['"]\)/,
      to: 'import("../../../services/api")',
    },
    {
      from: /import\(['"]\.\.\/\.\.\/services\/api\/api\.js['"]\)/,
      to: 'import("../../services/api.js")',
    },
    {
      from: /import\(['"]\.\.\/\.\.\/\.\.\/services\/api\.js['"]\)/,
      to: 'import("../../../services/api")',
    },
    {
      from: /import\(['"]\.\.\/\.\.\/\.\.\/services\/api['"]\)/,
      to: 'import("../../../services/api")',
    },
  ];

  serviceImportPatterns.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changes.push(`Fixed service import`);
      hasChanges = true;
    }
  });

  // Fix CSS imports - remove corrupted ... paths
  const cssImportPatterns = [
    { from: /import ['"]\.\.\.\/([^'"]+\.css)['"]/, to: 'import "./$1"' },
    { from: /import ['"]\.\.\.\/([^'"]+)['"]/, to: 'import "../$1"' },
  ];

  cssImportPatterns.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changes.push(`Fixed CSS import`);
      hasChanges = true;
    }
  });

  // Fix specific component CSS imports for moved components
  const componentCssPatterns = [
    { from: /import ['"]\.\/([^'"]+\.css)['"]/, to: 'import "./$1"' }, // Keep local imports
    { from: /import ['"]\.\.\/([^'"]+\.css)['"]/, to: 'import "./$1"' }, // Convert ../ to ./ for moved files
  ];

  // Only apply CSS fixes for files in component subdirectories
  if (
    filePath.includes('components/') &&
    (filePath.includes('/ui/') ||
      filePath.includes('/forms/') ||
      filePath.includes('/media/') ||
      filePath.includes('/admin/') ||
      filePath.includes('/accessibility/'))
  ) {
    componentCssPatterns.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        changes.push(`Fixed component CSS import`);
        hasChanges = true;
      }
    });
  }

  // Fix specific broken imports
  const specificFixes = [
    {
      from: /import\(['"]\.\.\/page-components\/MapPage\.jsx['"]\)/,
      to: 'import("../page-components/interactive/MapPage.jsx")',
    },
    {
      from: /import ['"]\.\.\/styles\/modern-2025-design\.css['"]/,
      to: 'import "../../styles/modern-2025-design.css"',
    },
  ];

  specificFixes.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changes.push(`Fixed specific import`);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    return changes;
  }

  return false;
}

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

// Process all source files
const srcDir = path.join(projectRoot, 'src');
const allFiles = findAllFiles(srcDir);

let updatedCount = 0;
let checkedCount = 0;

console.log(`Processing ${allFiles.length} files...\n`);

for (const filePath of allFiles) {
  const relativePath = path.relative(projectRoot, filePath);

  const changes = fixFileImports(filePath);
  if (changes) {
    console.log(`✅ ${relativePath}`);
    changes.forEach((change) => console.log(`  ${change}`));
    updatedCount++;
  }

  checkedCount++;
}

console.log(`\n✅ Comprehensive import cleanup complete!`);
console.log(`📊 Updated ${updatedCount} files out of ${checkedCount} checked`);

// Now create any missing CSS files that might be expected
console.log(`\n🔍 Checking for missing CSS files...`);

const missingCssFiles = [
  'src/components/ui/LoadingScreen.css',
  'src/components/media/PhotoGallery.css',
  'src/components/media/VideoModal.css',
  'src/components/media/VideoPlayer.css',
  'src/components/media/MusicPlayer.css',
  'src/components/forms/PasswordPrompt.css',
  'src/components/forms/UploadForm.css',
  'src/components/accessibility/OrientationOverlay.css',
  'src/components/admin/AdminDashboard.css',
  'src/styles/modern-2025-design.css',
];

let createdCssFiles = 0;

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
    const basicCss = `/* ${componentName} styles */\n\n.${componentName.toLowerCase()} {\n  /* Add styles here */\n}\n`;

    fs.writeFileSync(fullPath, basicCss);
    console.log(`✅ Created: ${cssFile}`);
    createdCssFiles++;
  }
}

if (createdCssFiles > 0) {
  console.log(`📊 Created ${createdCssFiles} missing CSS files`);
} else {
  console.log(`📊 All expected CSS files already exist`);
}

console.log(`\n📝 Next steps:`);
console.log(`  1. Run tests: npm run test:frontend`);
console.log(`  2. Check for any remaining import issues`);
console.log(`  3. If tests pass, commit comprehensive organization changes`);
