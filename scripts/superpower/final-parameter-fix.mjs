#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

console.log('🔧 Final Parameter Fixes...');

try {
  // Find all TypeScript files
  const files = await glob('src/**/*.{ts,tsx}', { absolute: true });

  let fixedCount = 0;

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');

      // Fix parameter naming issues
      let newContent = content
        .replace(
          /const\s+(\w+)\s*=\s*async\s*\(\s*__(\w+):\s*([^)]+)\)\s*=>/g,
          'const $1 = async ($2: $3) =>'
        )
        .replace(/const\s+(\w+)\s*=\s*\(\s*_(\w+):\s*([^)]+)\)\s*=>/g, 'const $1 = ($2: $3) =>')
        .replace(/function\s+(\w+)\s*\(\s*_(\w+):\s*([^)]+)\)/g, 'function $1($2: $3)')
        .replace(/(\w+)\s*:\s*\(\s*_(\w+):\s*([^)]+)\)\s*=>/g, '$1: ($2: $3) =>')
        .replace(/\(\s*_(\w+):\s*([^)]+)\)\s*=>\s*{/g, '($1: $2) => {');

      if (content !== newContent) {
        await writeFile(file, newContent);
        fixedCount++;
        console.log(`✅ Fixed: ${file.replace(process.cwd(), '.')}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log(`🎉 Parameter fixes complete! Fixed ${fixedCount} files.`);
} catch (error) {
  console.error('❌ Script failed:', error.message);
}
