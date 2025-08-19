#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';

console.log('🔧 Final Variable Cleanup...');

try {
  const filePath = 'src/app/memory-vault/MemoryVaultComponent.tsx';
  const content = await readFile(filePath, 'utf-8');

  // Replace all remaining file state references with uploadFiles
  let newContent = content
    .replace(/\bfiles\b/g, 'uploadFiles')
    .replace(/\bsetFiles\b/g, 'setUploadFiles')
    // Fix duplicate aria-modal and other attributes
    .replace(/aria-modal="true"\s+aria-modal="true"/g, 'aria-modal="true"')
    // Fix any parameter type issues
    .replace(/\(\s*([^:,)]+),?\s*([^:,)]+)\s*\)\s*=>/g, '($1: any, $2: any) =>')
    // Add missing import for HTMLInputElement type
    .replace(/^('use client';)/m, '$1\n\ndeclare global {\n  interface HTMLInputElement {}\n}');

  await writeFile(filePath, newContent);
  console.log('✅ Fixed variable references in MemoryVaultComponent');
} catch (error) {
  console.error('❌ Script failed:', error.message);
}
