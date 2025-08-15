#!/usr/bin/env node

/**
 * 🔧 ESLint Error Auto-Fixer
 * Fixes common ESLint errors across the codebase
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('🔧 Starting ESLint Error Auto-Fixer...\n');

async function findFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = [];

  async function scan(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        // Skip node_modules, .next, coverage, etc.
        if (
          entry.isDirectory() &&
          !['node_modules', '.next', 'coverage', 'dist', 'build'].includes(entry.name)
        ) {
          await scan(fullPath);
        } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan ${currentDir}: ${error.message}`);
    }
  }

  await scan(dir);
  return files;
}

async function fixFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let changed = false;
    const originalContent = content;

    // Remove unused imports
    const unusedImports = [
      /import\s+{\s*[^}]*React[^}]*\s*}\s+from\s+['"]react['"];?\s*\n/g,
      /import\s+React\s+from\s+['"]react['"];?\s*\n/g,
    ];

    // Only remove React import if it's not used
    if (!content.includes('React.') && !content.includes('<') && !content.includes('jsx')) {
      for (const pattern of unusedImports) {
        const newContent = content.replace(pattern, '');
        if (newContent !== content) {
          content = newContent;
          changed = true;
        }
      }
    }

    // Add PropTypes for components that need them
    if (
      content.includes('is missing in props validation') ||
      content.includes('react/prop-types')
    ) {
      if (!content.includes("import PropTypes from 'prop-types'")) {
        // Find the last import statement
        const importRegex = /^import\s+.*?;$/gm;
        const imports = content.match(importRegex);
        if (imports) {
          const lastImport = imports[imports.length - 1];
          const lastImportIndex = content.lastIndexOf(lastImport);
          content =
            content.slice(0, lastImportIndex + lastImport.length) +
            "\nimport PropTypes from 'prop-types';" +
            content.slice(lastImportIndex + lastImport.length);
          changed = true;
        }
      }
    }

    // Remove unused variables (common patterns)
    const unusedPatterns = [
      // Remove unused state setters that are never used
      /const \[([^,]+),\s*set[A-Z][^,\]]*\] = useState\([^)]*\);\s*\n/g,
    ];

    for (const pattern of unusedPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          // Only remove if the setter is truly unused
          const setterName = match.match(/set([A-Z][^,\]]*)/)?.[0];
          if (setterName && !content.includes(setterName + '(')) {
            content = content.replace(match, '');
            changed = true;
          }
        }
      }
    }

    // Fix styled-jsx issues
    content = content.replace(/<style jsx>/g, '<style>');
    if (content !== originalContent && content.includes('<style>')) {
      changed = true;
    }

    // Add accessibility attributes for interactive elements
    if (content.includes('onClick') && !content.includes('onKeyDown')) {
      // This is complex and needs manual review
    }

    // Remove console.log statements (keep warn and error)
    const consolePattern = /console\.log\([^)]*\);\s*\n?/g;
    const newContent = content.replace(consolePattern, '');
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }

    if (changed) {
      await fs.writeFile(filePath, content, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.warn(`Warning: Could not fix ${filePath}: ${error.message}`);
    return false;
  }
}

async function main() {
  const srcDir = path.join(projectRoot, 'src');
  const files = await findFiles(srcDir);

  console.log(`Found ${files.length} files to check...\n`);

  let fixedCount = 0;

  for (const file of files) {
    const relativePath = path.relative(projectRoot, file);

    // Skip test files for now - they have different requirements
    if (file.includes('__tests__') || file.includes('.test.')) {
      continue;
    }

    const wasFixed = await fixFile(file);
    if (wasFixed) {
      console.log(`✅ Fixed: ${relativePath}`);
      fixedCount++;
    }
  }

  console.log(`\n🎉 Auto-fixed ${fixedCount} files!`);
  console.log('\n📋 Next steps:');
  console.log('   1. Run ESLint again to see remaining issues');
  console.log('   2. Manually review accessibility issues');
  console.log('   3. Add PropTypes where needed');
  console.log('   4. Fix test file parsing errors');
}

main().catch(console.error);
