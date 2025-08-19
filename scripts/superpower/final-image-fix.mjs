#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

console.log('🖼️ Final OptimizedImage Replacement...');

try {
  // Find all files that might reference OptimizedImage
  const files = await glob('src/**/*.{ts,tsx,js,jsx}', { absolute: true });

  let fixedCount = 0;

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');

      // Replace all OptimizedImage usage with regular img tags
      let newContent = content
        .replace(/<OptimizedImage([^>]*)\/>/g, (match, props) => {
          // Extract common props
          const srcMatch = props.match(/src="([^"]*)"/) || props.match(/src={([^}]*)}/);
          const altMatch = props.match(/alt="([^"]*)"/) || props.match(/alt={([^}]*)}/);
          const classMatch =
            props.match(/className="([^"]*)"/) || props.match(/className={([^}]*)}/);

          const src = srcMatch
            ? srcMatch[1].startsWith('{')
              ? srcMatch[1]
              : `"${srcMatch[1]}"`
            : '""';
          const alt = altMatch
            ? altMatch[1].startsWith('{')
              ? altMatch[1]
              : `"${altMatch[1]}"`
            : '"Image"';
          const className = classMatch
            ? classMatch[1].startsWith('{')
              ? classMatch[1]
              : `"${classMatch[1]} w-full h-auto object-cover"`
            : '"w-full h-auto object-cover"';

          return `<img src=${src} alt=${alt} className=${className} loading="lazy" />`;
        })
        .replace(/<OptimizedImage([^>]*)>[\s\S]*?<\/OptimizedImage>/g, (match, props) => {
          const srcMatch = props.match(/src="([^"]*)"/) || props.match(/src={([^}]*)}/);
          const altMatch = props.match(/alt="([^"]*)"/) || props.match(/alt={([^}]*)}/);
          const classMatch =
            props.match(/className="([^"]*)"/) || props.match(/className={([^}]*)}/);

          const src = srcMatch
            ? srcMatch[1].startsWith('{')
              ? srcMatch[1]
              : `"${srcMatch[1]}"`
            : '""';
          const alt = altMatch
            ? altMatch[1].startsWith('{')
              ? altMatch[1]
              : `"${altMatch[1]}"`
            : '"Image"';
          const className = classMatch
            ? classMatch[1].startsWith('{')
              ? classMatch[1]
              : `"${classMatch[1]} w-full h-auto object-cover"`
            : '"w-full h-auto object-cover"';

          return `<img src=${src} alt=${alt} className=${className} loading="lazy" />`;
        });

      if (content !== newContent) {
        await writeFile(file, newContent);
        fixedCount++;
        console.log(`✅ Fixed: ${file.replace(process.cwd(), '.')}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log(`🎉 OptimizedImage replacement complete! Fixed ${fixedCount} files.`);
} catch (error) {
  console.error('❌ Script failed:', error.message);
}
