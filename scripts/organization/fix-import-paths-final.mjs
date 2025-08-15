#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('🔧 Final import path fixes for remaining issues...\n');

// Service import corrections - the file is actually api.js, not api/api
const serviceImportFixes = {
  'from "../../../services/api/api"': 'from "../../../services/api"',
  'from "../../services/api/api"': 'from "../../services/api"',
  'from "../../services/api/api.js"': 'from "../../services/api.js"',
  'from "../services/api/api.js"': 'from "../services/api.js"',
  'import("../../../services/api/api")': 'import("../../../services/api")',
  'import("../../services/api/api.js")': 'import("../../services/api.js")',
  'import("../../../services/api.js")': 'import("../../../services/api")',
};

// CSS import corrections - remove the corrupted ... paths
const cssImportFixes = {
  'import ".../': 'import "../',
  '".../': '"../',
  'import "../': 'import "./', // For components that moved to subdirectories
};

// Missing page-component references
const pageComponentFixes = {
  'import("../page-components/MapPage.jsx")':
    'import("../page-components/interactive/MapPage.jsx")',
  '../page-components/MapPage': '../page-components/interactive/MapPage',
};

// App page CSS fixes
const appPageFixes = {
  'import "../styles/modern-2025-design.css"': 'import "../../styles/modern-2025-design.css"',
};

function fixFileImports(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  const changes = [];

  // Apply service import fixes
  Object.entries(serviceImportFixes).forEach(([oldImport, newImport]) => {
    if (content.includes(oldImport)) {
      content = content.replace(
        new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        newImport
      );
      changes.push(`Updated service import: ${oldImport} → ${newImport}`);
      hasChanges = true;
    }
  });

  // Apply CSS import fixes
  Object.entries(cssImportFixes).forEach(([oldImport, newImport]) => {
    if (content.includes(oldImport)) {
      content = content.replace(
        new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        newImport
      );
      changes.push(`Fixed CSS import: ${oldImport} → ${newImport}`);
      hasChanges = true;
    }
  });

  // Apply page component fixes
  Object.entries(pageComponentFixes).forEach(([oldImport, newImport]) => {
    if (content.includes(oldImport)) {
      content = content.replace(
        new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        newImport
      );
      changes.push(`Fixed page component import: ${oldImport} → ${newImport}`);
      hasChanges = true;
    }
  });

  // Apply app page fixes
  Object.entries(appPageFixes).forEach(([oldImport, newImport]) => {
    if (content.includes(oldImport)) {
      content = content.replace(
        new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        newImport
      );
      changes.push(`Fixed app page CSS: ${oldImport} → ${newImport}`);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    changes.forEach((change) => console.log(`  ${change}`));
    return true;
  }

  return false;
}

function findAllFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = [];

  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git
        if (!['node_modules', '.git', '.next'].includes(item)) {
          scanDir(fullPath);
        }
      } else if (extensions.some((ext) => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  scanDir(dir);
  return files;
}

// Find all files to process
const srcDir = path.join(projectRoot, 'src');
const allFiles = findAllFiles(srcDir);

let updatedCount = 0;
let checkedCount = 0;

// Process each file
for (const filePath of allFiles) {
  const relativePath = path.relative(projectRoot, filePath);
  console.log(`Checking: ${relativePath}`);

  if (fixFileImports(filePath)) {
    console.log(`✅ Updated: ${relativePath}`);
    updatedCount++;
  }

  checkedCount++;
}

console.log(`\n✅ Final import path fix complete!`);
console.log(`📊 Updated ${updatedCount} files out of ${checkedCount} checked`);

console.log(`\n📝 Next steps:`);
console.log(`  1. Run tests: npm run test:frontend`);
console.log(`  2. Check for any remaining import issues`);
console.log(`  3. If tests pass, commit comprehensive organization changes`);
