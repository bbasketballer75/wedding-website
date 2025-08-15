#!/usr/bin/env node

/**
 * Import Path Auto-Fixer
 * Automatically updates import paths after project reorganization
 */

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');

// Mapping of old paths to new paths based on our organization
const pathMappings = {
  // Components that moved to organized directories
  '../AdminDashboard.jsx': '../admin/AdminDashboard.jsx',
  '../ModerationCard.jsx': '../admin/ModerationCard.jsx',
  '../PostWeddingAnalytics.jsx': '../admin/PostWeddingAnalytics.jsx',

  '../AccessibilityEnhancements.tsx': '../accessibility/AccessibilityEnhancements.tsx',
  '../SkipLinks.tsx': '../accessibility/SkipLinks.tsx',
  '../OrientationOverlay.jsx': '../accessibility/OrientationOverlay.jsx',

  '../DigitalTimeCapsule.jsx': '../features/DigitalTimeCapsule.jsx',
  '../FamilyTree.jsx': '../features/FamilyTree.jsx',
  '../InteractiveLoveTimeline.jsx': '../features/InteractiveLoveTimeline.jsx',
  '../MagicalPhotoGallery.jsx': '../features/MagicalPhotoGallery.jsx',

  '../UploadForm.jsx': '../forms/UploadForm.jsx',
  '../GuestPhotoUpload.jsx': '../forms/GuestPhotoUpload.jsx',
  '../PasswordPrompt.jsx': '../forms/PasswordPrompt.jsx',

  '../PhotoGallery.jsx': '../media/PhotoGallery.jsx',
  '../VideoPlayer.jsx': '../media/VideoPlayer.jsx',
  '../VideoModal.jsx': '../media/VideoModal.jsx',
  '../MusicPlayer.jsx': '../media/MusicPlayer.jsx',
  '../OptimizedImage.jsx': '../media/OptimizedImage.jsx',

  '../PerformanceMonitor.tsx': '../performance/PerformanceMonitor.tsx',
  '../ServiceWorkerRegistration.tsx': '../performance/ServiceWorkerRegistration.tsx',
  '../PWAInstallPrompt.tsx': '../performance/PWAInstallPrompt.tsx',

  '../ModernButtons.tsx': '../ui/ModernButtons.tsx',
  '../ModernCards.tsx': '../ui/ModernCards.tsx',
  '../ModernNavigation.jsx': '../ui/ModernNavigation.jsx',
  '../ModernFooter.tsx': '../ui/ModernFooter.tsx',
  '../LoadingScreen.tsx': '../ui/LoadingScreen.tsx',

  // Page components
  '../../page-components/AdminPage.jsx': '../../page-components/admin/AdminPage.jsx',
  '../AdminPage.jsx': '../admin/AdminPage.jsx',

  '../../page-components/HomePage.jsx': '../../page-components/core/HomePage.jsx',
  '../HomePage.jsx': '../core/HomePage.jsx',
  '../../page-components/ModernHomePage.jsx': '../../page-components/core/ModernHomePage.jsx',
  '../ModernHomePage.jsx': '../core/ModernHomePage.jsx',

  '../../page-components/AlbumPage.jsx': '../../page-components/gallery/AlbumPage.jsx',
  '../AlbumPage.jsx': '../gallery/AlbumPage.jsx',
  '../../page-components/EnhancedAlbumPage.jsx':
    '../../page-components/gallery/EnhancedAlbumPage.jsx',
  '../EnhancedAlbumPage.jsx': '../gallery/EnhancedAlbumPage.jsx',
  '../../page-components/MagicalAlbumPage.jsx':
    '../../page-components/gallery/MagicalAlbumPage.jsx',
  '../MagicalAlbumPage.jsx': '../gallery/MagicalAlbumPage.jsx',

  '../../page-components/FamilyTreePage.jsx': '../../page-components/family/FamilyTreePage.jsx',
  '../FamilyTreePage.jsx': '../family/FamilyTreePage.jsx',
  '../../page-components/FamilyWeddingPartyPage.tsx':
    '../../page-components/family/FamilyWeddingPartyPage.tsx',
  '../FamilyWeddingPartyPage.tsx': '../family/FamilyWeddingPartyPage.tsx',

  '../../page-components/GuestbookPage.jsx': '../../page-components/interactive/GuestbookPage.jsx',
  '../GuestbookPage.jsx': '../interactive/GuestbookPage.jsx',
  '../../page-components/MapPage.jsx': '../../page-components/interactive/MapPage.jsx',
  '../MapPage.jsx': '../interactive/MapPage.jsx',
  '../../page-components/WeddingPartyPage.jsx':
    '../../page-components/interactive/WeddingPartyPage.jsx',
  '../WeddingPartyPage.jsx': '../interactive/WeddingPartyPage.jsx',

  // Utils
  '../analytics': '../core/analytics',
  '../performanceMonitor': '../core/performanceMonitor',
  '../featureDetection': '../core/featureDetection',

  // Special case for components that reference other moved components
  './GuestPhotoUpload': './forms/GuestPhotoUpload',

  // Cross-references that need updating
  '../../page-components/': '../../page-components/',
  '../': '../',
};

// Additional cross-directory mappings
const crossDirectoryMappings = {
  // From tests to organized components
  '../AdminDashboard.jsx': '../admin/AdminDashboard.jsx',
  '../GuestPhotoUpload.jsx': '../forms/GuestPhotoUpload.jsx',
  '../PasswordPrompt.jsx': '../forms/PasswordPrompt.jsx',
  '../UploadForm.jsx': '../forms/UploadForm.jsx',
  '../PhotoGallery.jsx': '../media/PhotoGallery.jsx',
  '../VideoPlayer.jsx': '../media/VideoPlayer.jsx',
  '../VideoModal.jsx': '../media/VideoModal.jsx',
  '../MusicPlayer.jsx': '../media/MusicPlayer.jsx',
  '../LoadingScreen.jsx': '../ui/LoadingScreen.jsx',
  '../OrientationOverlay.jsx': '../accessibility/OrientationOverlay.jsx',
  '../FamilyTree.jsx': '../features/FamilyTree.jsx',
};

function updateImportPaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Update import statements
    content = content.replace(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g, (match, importPath) => {
      let newPath = pathMappings[importPath] || crossDirectoryMappings[importPath];

      if (newPath) {
        modified = true;
        console.log(`  Updated: ${importPath} → ${newPath}`);
        return match.replace(importPath, newPath);
      }

      return match;
    });

    // Update dynamic imports
    content = content.replace(/import\(['"]([^'"]+)['"]\)/g, (match, importPath) => {
      let newPath = pathMappings[importPath] || crossDirectoryMappings[importPath];

      if (newPath) {
        modified = true;
        console.log(`  Updated dynamic import: ${importPath} → ${newPath}`);
        return match.replace(importPath, newPath);
      }

      return match;
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${path.relative(projectRoot, filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function findFilesToUpdate() {
  const filesToUpdate = [];

  // Find all JavaScript/TypeScript files that might have imports
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
        filesToUpdate.push(fullPath);
      }
    }
  }

  scanDirectory(path.join(projectRoot, 'src'));
  return filesToUpdate;
}

function main() {
  console.log('🔧 Auto-fixing import paths after reorganization...\n');

  const filesToUpdate = findFilesToUpdate();
  let updatedCount = 0;

  for (const filePath of filesToUpdate) {
    console.log(`Checking: ${path.relative(projectRoot, filePath)}`);

    if (updateImportPaths(filePath)) {
      updatedCount++;
    }
  }

  console.log(`\n✅ Import path fix complete!`);
  console.log(`📊 Updated ${updatedCount} files out of ${filesToUpdate.length} checked`);

  if (updatedCount > 0) {
    console.log('\n📝 Next steps:');
    console.log('  1. Run tests: npm run test:frontend');
    console.log('  2. Check for any remaining import issues');
    console.log(
      '  3. Commit the changes: git add . && git commit -m "Fix import paths after reorganization"'
    );
  }
}

main();
