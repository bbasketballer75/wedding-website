#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

console.log('🔧 Fixing global type declarations...');

try {
  // Find all TypeScript files with global declarations
  const files = await glob('src/**/*.{ts,tsx}', { absolute: true });

  let fixedCount = 0;

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');

      // Fix duplicate global declarations
      let newContent = content.replace(
        /declare global \{[\s\S]*?\n  \}\n  const SpeechRecognition: unknown;[\s\S]*?\n\}/,
        `declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    SpeechRecognition: unknown;
  }
}`
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

  console.log(`🎉 Global declarations fixed! Fixed ${fixedCount} files.`);
} catch (error) {
  console.error('❌ Script failed:', error.message);
}
