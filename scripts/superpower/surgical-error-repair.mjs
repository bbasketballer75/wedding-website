/**
 * 🔧 SURGICAL ERROR REPAIR SYSTEM
 * August 2025 Critical Build Fix Edition
 *
 * This script specifically targets build-breaking syntax errors:
 * - Malformed function declarations
 * - Misplaced 'use client' directives
 * - Broken async/await syntax
 * - Invalid parameter names
 */

import fs from 'fs/promises';
import path from 'path';

class SurgicalErrorRepair {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
  }

  async repairFile(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      const originalContent = content;
      let hasChanges = false;

      // Fix 1: Move 'use client' to top of file
      if (content.includes("'use client';") && !content.startsWith("'use client';")) {
        content = content.replace(/.*'use client';.*\n?/g, '');
        content = `'use client';\n\n${content}`;
        hasChanges = true;
      }

      // Fix 2: Repair malformed function parameters with underscores
      content = content.replace(
        /export async function \(__?([a-zA-Z][a-zA-Z0-9]*): /g,
        'export async function GET($1: '
      );
      content = content.replace(
        /export async function \(_([a-zA-Z][a-zA-Z0-9]*): /g,
        'export async function GET($1: '
      );

      if (content !== originalContent) hasChanges = true;

      // Fix 3: Repair broken async function syntax in AIWeddingFeatures
      if (filePath.includes('AIWeddingFeatures')) {
        content = content.replace(
          /const mapFunction = \(async \(photo\) =>/g,
          'const mapFunction = async (photo) =>'
        );

        // Fix the extracted function structure
        content = content.replace(
          /\/\/ Extracted to reduce nesting\s*const mapFunction = async \(photo\) =>\s*const analysis = await this\.analyzePhoto\(photo\.src\);\s*return \{/g,
          `// Extracted to reduce nesting
      const mapFunction = async (photo) => {
        const analysis = await this.analyzePhoto(photo.src);
        return {`
        );

        if (content !== originalContent) hasChanges = true;
      }

      // Fix 4: Repair any remaining syntax issues
      content = content
        // Fix function parameter syntax
        .replace(/function \(__([a-zA-Z]+):/g, 'function GET($1:')
        .replace(/function \(_([a-zA-Z]+):/g, 'function GET($1:')

        // Fix arrow function syntax
        .replace(/=> \{([^}]+)=> /g, '=> {\n$1\n=> ')

        // Fix missing closing braces in extracted functions
        .replace(
          /const mapFunction = async \(([^)]+)\) =>\s*([^{]+)\s*return \{([^}]+)\s*$/gm,
          'const mapFunction = async ($1) => {\n  $2\n  return {\n    $3\n  };\n};'
        )

        // Fix incomplete extractions
        .replace(
          /\/\/ Extracted to reduce nesting\s*const mapFunction = ([^;]+);([^}]+)\.map\(mapFunction\)/g,
          '// Extracted to reduce nesting\nconst mapFunction = $1;\n$2.map(mapFunction)'
        );

      if (content !== originalContent) hasChanges = true;

      // Save if changes were made
      if (hasChanges) {
        await fs.writeFile(filePath, content, 'utf8');
        this.fixedFiles.push(path.relative(process.cwd(), filePath));
        console.log(`🔧 Surgically repaired ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      this.errors.push(`Error repairing ${filePath}: ${error.message}`);
      console.error(`❌ Error repairing ${filePath}:`, error.message);
    }
  }

  async run() {
    console.log('🔧 SURGICAL ERROR REPAIR SYSTEM ACTIVATED');
    console.log('🎯 Targeting critical build-breaking syntax errors...\n');

    const criticalFiles = [
      './src/components/ai/AIWeddingFeatures.tsx',
      './src/app/admin/page.jsx',
      './src/app/api/album/route.ts',
      './src/app/api/analytics/route.ts',
      './src/app/api/guestbook/route.ts',
      './src/app/api/map/locations/route.ts',
      './src/app/api/performance/route.ts',
      './src/app/api/performance-alerts/route.ts',
      './src/app/api/performance-metrics/route.ts',
    ];

    const startTime = Date.now();

    for (const file of criticalFiles) {
      if (await this.fileExists(file)) {
        await this.repairFile(file);
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n🎉 SURGICAL REPAIR MISSION COMPLETE!');
    console.log(`⚡ Processed ${criticalFiles.length} critical files in ${duration}s`);
    console.log(`✅ Repaired ${this.fixedFiles.length} files`);

    if (this.errors.length > 0) {
      console.log(`❌ Encountered ${this.errors.length} errors`);
    }

    if (this.fixedFiles.length > 0) {
      console.log('\n🔧 Surgically repaired files:');
      this.fixedFiles.forEach((file) => console.log(`   💫 ${file}`));
    }

    console.log('\n🚀 Ready for build test!');
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Run the surgical repair
const repair = new SurgicalErrorRepair();
repair.run().catch(console.error);
