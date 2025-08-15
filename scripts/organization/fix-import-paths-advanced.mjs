#!/usr/bin/env node

/**
 * Advanced Import Path Auto-Fixer
 * Handles cross-directory imports, CSS files, and service imports after organization
 */

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');

// Additional path mappings for cross-directory imports
const crossDirectoryMappings = {
  // From organized components to services (need to go up more levels)
  '../services/api': '../../services/api',

  // From page-components to services (different depth)
  '../services/api': '../../services/api',

  // From organized page-components to components (need updated paths)
  '../components/LoadingScreen': '../../components/ui/LoadingScreen',
  '../components/AdminDashboard': '../../components/admin/AdminDashboard',
  '../components/PasswordPrompt': '../../components/forms/PasswordPrompt',
  '../components/GuestPhotoUpload': '../../components/forms/GuestPhotoUpload',
  '../components/VideoModal': '../../components/media/VideoModal',

  // CSS files that need relative path adjustments
  './LoadingScreen.css': '../LoadingScreen.css',
  './MusicPlayer.css': '../MusicPlayer.css',
  './VideoModal.css': '../VideoModal.css',
  './VideoPlayer.css': '../VideoPlayer.css',
  './OrientationOverlay.css': '../OrientationOverlay.css',
  './PasswordPrompt.css': '../PasswordPrompt.css',
  './UploadForm.css': '../UploadForm.css',
  './AdminDashboard.css': '../AdminDashboard.css',
  './HomePage-premium.css': '../HomePage-premium.css',
  './WeddingPartyPage.css': '../WeddingPartyPage.css',
  './PhotoGallery.css': '../PhotoGallery.css',

  // Component cross-references from root tests
  '../components/PhotoGallery.jsx': '../components/media/PhotoGallery.jsx',
  '../components/ModernFooter': '../components/ui/ModernFooter',
  '../components/ModernNavigation': '../components/ui/ModernNavigation',
  '../page-components/HomePage': '../page-components/core/HomePage',
  '../page-components/AlbumPage.jsx': '../page-components/gallery/AlbumPage.jsx',
  '../page-components/GuestbookPage.jsx': '../page-components/interactive/GuestbookPage.jsx',

  // Dynamic imports in root tests
  '../page-components/AlbumPage.jsx': '../page-components/gallery/AlbumPage.jsx',
};

// Path depth adjustments for different source locations
const depthAdjustments = {
  // For files in organized subdirectories, services need an extra "../"
  'src/components/admin/': '../../services/',
  'src/components/forms/': '../../services/',
  'src/components/media/': '../../services/',
  'src/components/features/': '../../services/',
  'src/components/ui/': '../../services/',
  'src/components/accessibility/': '../../services/',
  'src/components/performance/': '../../services/',

  'src/page-components/admin/': '../../services/',
  'src/page-components/core/': '../../services/',
  'src/page-components/gallery/': '../../services/',
  'src/page-components/family/': '../../services/',
  'src/page-components/interactive/': '../../services/',

  'src/utils/core/': '../',
  'src/utils/features/': '../',
  'src/utils/performance/': '../',
  'src/utils/security/': '../',
  'src/utils/seo/': '../',
};

function getCorrectServicePath(filePath) {
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');

  for (const [dirPattern, servicePath] of Object.entries(depthAdjustments)) {
    if (relativePath.startsWith(dirPattern)) {
      return servicePath + 'api';
    }
  }

  return '../services/api'; // fallback
}

function updateImportPaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');

    // Handle service imports with correct depth
    if (content.includes('../services/api') || content.includes('../services/')) {
      const correctServicePath = getCorrectServicePath(filePath);
      content = content.replace(
        /from\s+['"](\.\.\/)+services\/([^'"]*)['"]/g,
        (match, dots, serviceName) => {
          modified = true;
          console.log(
            `  Updated service import: ${match} → from '${correctServicePath}${serviceName ? '/' + serviceName : ''}'`
          );
          return `from '${correctServicePath}${serviceName ? '/' + serviceName : ''}'`;
        }
      );
    }

    // Update CSS imports with correct relative paths
    content = content.replace(/import\s+['"]\.\/([\w-]+\.css)['"]/g, (match, cssFile) => {
      if (relativePath.includes('/components/') && !relativePath.includes('/__tests__/')) {
        // Components in organized folders need to go up one level for CSS
        modified = true;
        console.log(`  Updated CSS import: ${match} → import '../${cssFile}'`);
        return `import '../${cssFile}'`;
      }
      return match;
    });

    // Handle cross-directory component imports
    for (const [oldPath, newPath] of Object.entries(crossDirectoryMappings)) {
      if (content.includes(oldPath)) {
        content = content.replace(
          new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          newPath
        );
        modified = true;
        console.log(`  Updated cross-directory import: ${oldPath} → ${newPath}`);
      }
    }

    // Handle imports from app/page.tsx specifically
    if (relativePath.includes('src/app/page.tsx')) {
      content = content.replace(
        /from\s+['"](\.\.\/components\/[\w-]+)['"]/g,
        (match, importPath) => {
          if (importPath === '../components/ModernFooter') {
            modified = true;
            console.log(
              `  Updated app page import: ${match} → from '../components/ui/ModernFooter'`
            );
            return `from '../components/ui/ModernFooter'`;
          } else if (importPath === '../components/ModernNavigation') {
            modified = true;
            console.log(
              `  Updated app page import: ${match} → from '../components/ui/ModernNavigation'`
            );
            return `from '../components/ui/ModernNavigation'`;
          }
          return match;
        }
      );

      content = content.replace(
        /from\s+['"](\.\.\/page-components\/[\w-]+)['"]/g,
        (match, importPath) => {
          if (importPath === '../page-components/ModernHomePage') {
            modified = true;
            console.log(
              `  Updated app page import: ${match} → from '../page-components/core/ModernHomePage'`
            );
            return `from '../page-components/core/ModernHomePage'`;
          }
          return match;
        }
      );
    }

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
  console.log('🔧 Advanced import path fixing for cross-directory references...\n');

  const filesToUpdate = findFilesToUpdate();
  let updatedCount = 0;

  for (const filePath of filesToUpdate) {
    console.log(`Checking: ${path.relative(projectRoot, filePath)}`);

    if (updateImportPaths(filePath)) {
      updatedCount++;
    }
  }

  console.log(`\n✅ Advanced import path fix complete!`);
  console.log(`📊 Updated ${updatedCount} files out of ${filesToUpdate.length} checked`);

  if (updatedCount > 0) {
    console.log('\n📝 Next steps:');
    console.log('  1. Run tests: npm run test:frontend');
    console.log('  2. Check for any remaining import issues');
    console.log('  3. If tests pass, commit changes');
  }
}

main();
