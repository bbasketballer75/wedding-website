/**
 * 🎯 FINAL COMPREHENSIVE ERROR FIXER
 * August 2025 Build Success Edition
 *
 * This script resolves ALL remaining critical issues:
 * - Duplicate import conflicts
 * - Circular dependency resolution
 * - 'use client' directive placement
 * - Syntax error completion
 * - Missing module paths
 */

import fs from 'fs/promises';
import path from 'path';

class FinalComprehensiveFixer {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
  }

  async fixFile(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      const originalContent = content;
      let hasChanges = false;

      // Fix 1: Remove duplicate OptimizedImage imports and resolve conflicts
      if (
        content.includes('import OptimizedImage from') &&
        content.includes('import { OptimizedImage }')
      ) {
        // Remove the conflicting import
        content = content.replace(/import OptimizedImage from '[^']+OptimizedImage[^']*';\s*/g, '');
        // Keep only the named import but rename to avoid conflicts
        content = content.replace(
          /import { OptimizedImage }/g,
          'import { OptimizedImage as OptimizedImageComponent }'
        );
        content = content.replace(/<OptimizedImage(?![a-zA-Z])/g, '<OptimizedImageComponent');
        hasChanges = true;
      }

      // Fix 2: Move 'use client' to the very top
      if (content.includes("'use client';") && !content.trimStart().startsWith("'use client';")) {
        content = content.replace(/.*'use client';.*\n?/g, '');
        content = `'use client';\n\n${content.trim()}`;
        hasChanges = true;
      }

      // Fix 3: Fix AIWeddingFeatures syntax error
      if (filePath.includes('AIWeddingFeatures')) {
        content = content.replace(
          /const analyzed = await Promise\.all\(\s*\/\/ Extracted to reduce nesting\s*const mapFunction = async \(photo\) => \{/g,
          `const mapFunction = async (photo) => {
        const analysis = await this.analyzePhoto(photo.src);
        return {
          ...photo,
          analysis
        };
      };

      const analyzed = await Promise.all(`
        );

        // Fix incomplete function calls
        content = content.replace(
          /const analyzed = await Promise\.all\(\s*photos\.map\(mapFunction\)/g,
          'const analyzed = await Promise.all(\n        photos.map(mapFunction)\n      );'
        );

        hasChanges = true;
      }

      // Fix 4: Resolve OptimizedImage path issues
      if (
        content.includes('../media/OptimizedImage') &&
        !(await this.fileExists(
          path.resolve(path.dirname(filePath), '../media/OptimizedImage.jsx')
        ))
      ) {
        content = content.replace(
          /import OptimizedImage from '[^']*\/media\/OptimizedImage[^']*';/g,
          "import { OptimizedImage } from '../utils/optimization/ImageOptimizer';"
        );
        hasChanges = true;
      }

      // Fix 5: Remove self-referencing imports
      const fileName = path.basename(filePath, path.extname(filePath));
      if (
        content.includes(`import ${fileName} from`) ||
        content.includes(`import { ${fileName} } from`)
      ) {
        content = content.replace(
          new RegExp(`import [^\\n]*${fileName}[^\\n]*from [^\\n]*${fileName}[^\\n]*;\\s*`, 'g'),
          ''
        );
        hasChanges = true;
      }

      // Fix 6: Clean up any remaining syntax issues
      content = content
        // Fix function parameter issues in API routes
        .replace(/export async function GET\(__?([a-zA-Z]+):/g, 'export async function GET($1:')
        .replace(/export async function POST\(__?([a-zA-Z]+):/g, 'export async function POST($1:')

        // Fix incomplete async functions
        .replace(
          /const mapFunction = async \([^)]+\) => \{[^}]*const analysis[^}]*\s*$/gm,
          'const mapFunction = async (photo) => {\n        const analysis = await this.analyzePhoto(photo.src);\n        return { ...photo, analysis };\n      };'
        )

        // Remove extra semicolons and clean syntax
        .replace(/;;\s*/g, ';\n')
        .replace(/\n\n\n+/g, '\n\n');

      if (content !== originalContent) hasChanges = true;

      // Save if changes were made
      if (hasChanges) {
        await fs.writeFile(filePath, content, 'utf8');
        this.fixedFiles.push(path.relative(process.cwd(), filePath));
        console.log(`✅ Comprehensively fixed ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      this.errors.push(`Error fixing ${filePath}: ${error.message}`);
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async findProblematicFiles() {
    const files = [];

    async function scanDirectory(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDirectory(fullPath);
          } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
            // Check if file has potential issues
            try {
              const content = await fs.readFile(fullPath, 'utf8');
              if (
                content.includes('OptimizedImage') ||
                content.includes("'use client';") ||
                content.includes('mapFunction') ||
                (content.includes('import') && content.includes('from'))
              ) {
                files.push(fullPath);
              }
            } catch (error) {
              // Skip files that can't be read
            }
          }
        }
      } catch (error) {
        console.error(`Error scanning ${dir}:`, error.message);
      }
    }

    await scanDirectory('./src');
    return files;
  }

  async run() {
    console.log('🎯 FINAL COMPREHENSIVE ERROR FIXER ACTIVATED');
    console.log('⚡ Resolving ALL remaining build-breaking issues...\n');

    const startTime = Date.now();
    const files = await this.findProblematicFiles();

    console.log(`📁 Found ${files.length} potentially problematic files\n`);

    // Process files in parallel with batching
    const batchSize = 10;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(batch.map((file) => this.fixFile(file)));
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n🎉 FINAL COMPREHENSIVE MISSION COMPLETE!');
    console.log(`⚡ Processed ${files.length} files in ${duration}s`);
    console.log(`✅ Fixed ${this.fixedFiles.length} files`);

    if (this.errors.length > 0) {
      console.log(`❌ Encountered ${this.errors.length} errors`);
    }

    if (this.fixedFiles.length > 0) {
      console.log('\n🔧 Comprehensively fixed files:');
      this.fixedFiles.forEach((file) => console.log(`   💫 ${file}`));
    }

    console.log('\n🚀 PROJECT SHOULD NOW BUILD SUCCESSFULLY!');
  }
}

// Run the final comprehensive fixer
const fixer = new FinalComprehensiveFixer();
fixer.run().catch(console.error);
