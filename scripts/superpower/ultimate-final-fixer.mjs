/**
 * 🎯 ULTIMATE FINAL BUILD SUCCESS FIXER
 * August 2025 Victory Edition
 *
 * Final targeted fixes for:
 * - ImageOptimizer import path resolution
 * - AIWeddingFeatures syntax completion
 * - All remaining build-breaking issues
 */

import fs from 'fs/promises';
import path from 'path';

class UltimateFinalFixer {
  constructor() {
    this.fixedFiles = [];
  }

  getCorrectImageOptimizerPath(fromFile) {
    // Calculate the correct relative path to src/utils/optimization/ImageOptimizer
    const fromDir = path.dirname(fromFile);
    const toFile = 'src/utils/optimization/ImageOptimizer';
    const relativePath = path.relative(fromDir, toFile);

    // Convert Windows paths to Unix-style for imports
    return relativePath.replace(/\\/g, '/');
  }

  async fixFile(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      const originalContent = content;
      let hasChanges = false;

      // Fix 1: Correct ImageOptimizer import paths
      if (content.includes("from '../utils/optimization/ImageOptimizer'")) {
        const correctPath = this.getCorrectImageOptimizerPath(filePath);
        content = content.replace(
          /from '[^']*\/utils\/optimization\/ImageOptimizer'/g,
          `from '${correctPath}'`
        );
        hasChanges = true;
      }

      // Fix 2: Fix AIWeddingFeatures syntax error
      if (filePath.includes('AIWeddingFeatures')) {
        // Fix the broken Promise.all structure
        content = content.replace(
          /const analyzed = await Promise\.all\(\s*const analysis = await this\.analyzePhoto\(photo\.src\);\s*return \{/g,
          `const analyzed = await Promise.all(
        photos.map(async (photo) => {
          const analysis = await this.analyzePhoto(photo.src);
          return {`
        );

        // Ensure proper closing of the structure
        content = content.replace(
          /return \{\s*\.\.\.photo,\s*analysis\s*\};?\s*\}\s*\);?\s*$/gm,
          `return {
            ...photo,
            analysis
          };
        })
      );`
        );

        hasChanges = true;
      }

      // Fix 3: Handle any remaining path issues
      if (content.includes('../utils/optimization/ImageOptimizer')) {
        const correctPath = this.getCorrectImageOptimizerPath(filePath);
        content = content.replace(/\.\.\/utils\/optimization\/ImageOptimizer/g, correctPath);
        hasChanges = true;
      }

      // Save if changes were made
      if (hasChanges) {
        await fs.writeFile(filePath, content, 'utf8');
        this.fixedFiles.push(path.relative(process.cwd(), filePath));
        console.log(`✅ FINAL FIX: ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }

  async run() {
    console.log('🎯 ULTIMATE FINAL BUILD SUCCESS FIXER ACTIVATED');
    console.log('⚡ Resolving FINAL build issues for COMPLETE SUCCESS...\n');

    // Target the specific failing files
    const failingFiles = [
      './src/app/admin/page.jsx',
      './src/app/memory-vault/MemoryVaultComponent.tsx',
      './src/app/test-component/page.jsx',
      './src/components/admin/ModerationCard.jsx',
      './src/components/ai/AIWeddingFeatures.tsx',
    ];

    const startTime = Date.now();

    for (const file of failingFiles) {
      try {
        await fs.access(file);
        await this.fixFile(file);
      } catch (error) {
        console.log(`⚠️ File not found: ${file}`);
      }
    }

    // Also fix any other files that might have the same import issue
    const allFiles = await this.findFilesWithImageOptimizerImports();
    for (const file of allFiles) {
      if (!failingFiles.includes(file)) {
        await this.fixFile(file);
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n🎉 ULTIMATE FINAL MISSION COMPLETE!');
    console.log(`⚡ Processed files in ${duration}s`);
    console.log(`✅ Final fixes applied to ${this.fixedFiles.length} files`);

    if (this.fixedFiles.length > 0) {
      console.log('\n🔧 Final fixes applied:');
      this.fixedFiles.forEach((file) => console.log(`   💫 ${file}`));
    }

    console.log('\n🚀 BUILD SUCCESS SHOULD NOW BE ACHIEVED! 🎊');
  }

  async findFilesWithImageOptimizerImports() {
    const files = [];

    async function scanDirectory(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDirectory(fullPath);
          } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
            try {
              const content = await fs.readFile(fullPath, 'utf8');
              if (content.includes('ImageOptimizer')) {
                files.push(fullPath);
              }
            } catch (error) {
              // Skip files that can't be read
            }
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    await scanDirectory('./src');
    return files;
  }
}

// Execute the ultimate final fixer
const fixer = new UltimateFinalFixer();
fixer.run().catch(console.error);
