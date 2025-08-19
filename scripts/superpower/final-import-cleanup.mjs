#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

console.log('🧹 Final Import Path Cleanup...');

try {
  // Find all TypeScript and JavaScript files
  const files = await glob('src/**/*.{ts,tsx,js,jsx}', { absolute: true });

  let fixedCount = 0;

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');

      // Fix broken import paths
      let newContent = content
        .replace(
          /import\s+{\s*OptimizedImage\s*}\s+from\s+['"'][^'"]*utils\/optimization\/ImageOptimizer['"'];\s*\n/g,
          ''
        )
        .replace(
          /import\s+OptimizedImage\s+from\s+['"'][^'"]*utils\/optimization\/ImageOptimizer['"'];\s*\n/g,
          ''
        )
        .replace(
          /import\s+{\s*OptimizedImage\s*}\s+from\s+['"'][^'"]*ImageOptimizer['"'];\s*\n/g,
          ''
        );

      if (content !== newContent) {
        await writeFile(file, newContent);
        fixedCount++;
        console.log(`✅ Fixed: ${file.replace(process.cwd(), '.')}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log(`🎉 Import cleanup complete! Fixed ${fixedCount} files.`);
} catch (error) {
  console.error('❌ Script failed:', error.message);
}
