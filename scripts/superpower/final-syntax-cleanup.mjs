#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';

/**
 * Final Syntax Cleanup Script
 * Removes unused OptimizedImage imports that are causing build errors
 */

const filesToClean = [
  'src/page-components/VideoHomePage.jsx',
  'src/page-components/core/ModernHomePage.jsx',
];

console.log('🧹 Starting final syntax cleanup...');

for (const filePath of filesToClean) {
  try {
    const content = await readFile(filePath, 'utf-8');

    // Remove unused OptimizedImage import lines
    const cleanedContent = content
      .replace(/import\s+{\s*OptimizedImage\s*}\s+from\s+['""][^'"]*['""];\s*\n/g, '')
      .replace(/import\s+OptimizedImage\s+from\s+['""][^'"]*['""];\s*\n/g, '');

    if (content !== cleanedContent) {
      await writeFile(filePath, cleanedContent);
      console.log(`✅ Cleaned: ${filePath}`);
    } else {
      console.log(`⚪ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
  }
}

console.log('🎉 Final syntax cleanup complete!');
