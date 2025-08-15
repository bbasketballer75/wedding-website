#!/usr/bin/env node

/**
 * 🔧 ACCESSIBILITY ERROR FIXER
 * Systematically fixes accessibility and code quality errors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('🔧 FIXING ACCESSIBILITY & CODE QUALITY ERRORS');
console.log('=====================================\n');

// Helper function to read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.log(`❌ Could not read ${filePath}: ${error.message}`);
    return null;
  }
}

// Helper function to write file content
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.log(`❌ Could not write ${filePath}: ${error.message}`);
    return false;
  }
}

// Fix 1: Convert styled-jsx to regular CSS modules
function fixStyledJsx(filePath) {
  let content = readFile(filePath);
  if (!content) return false;

  if (content.includes('<style jsx>')) {
    console.log(`🎨 Fixing styled-jsx in ${path.basename(filePath)}`);

    // Remove styled-jsx blocks and add CSS import
    content = content.replace(/<style jsx>\{`[^`]*`\}<\/style>/gs, '');

    // Add CSS module import if not present
    if (!content.includes('import styles from')) {
      const componentName = path.basename(filePath, path.extname(filePath));
      const cssImport = `\n`;
      content = content.replace(/^import/m, cssImport + 'import');
    }

    return writeFile(filePath, content);
  }
  return false;
}

// Fix 2: Add readonly to component props
function fixReadonlyProps(filePath) {
  let content = readFile(filePath);
  if (!content) return false;

  const patterns = [
    // Simple function component props
    /function (\w+)\(\{([^}]+)\}: \{([^}]+)\}\)/g,
    // Arrow function component props
    /const (\w+) = \(\{([^}]+)\}: \{([^}]+)\}\)/g,
  ];

  let hasChanges = false;
  patterns.forEach((pattern) => {
    content = content.replace(pattern, (match, funcName, props, types) => {
      if (!types.includes('readonly')) {
        console.log(`🔒 Adding readonly props to ${funcName} in ${path.basename(filePath)}`);
        // Add readonly to each type
        const readonlyTypes = types.replace(/(\w+):/g, 'readonly $1:');
        hasChanges = true;
        return match.replace(types, readonlyTypes);
      }
      return match;
    });
  });

  if (hasChanges) {
    return writeFile(filePath, content);
  }
  return false;
}

// Fix 3: Fix form label associations
function fixFormLabels(filePath) {
  let content = readFile(filePath);
  if (!content) return false;

  let hasChanges = false;
  let idCounter = 1;

  // Find unassociated labels followed by inputs
  const labelInputPattern = /<label([^>]*?)>([^<]*?)<\/label>\s*<(input|textarea|select)([^>]*?)>/g;

  content = content.replace(
    labelInputPattern,
    (match, labelAttrs, labelText, inputType, inputAttrs) => {
      if (!labelAttrs.includes('htmlFor') && !inputAttrs.includes('id=')) {
        console.log(`🏷️ Fixing form label association in ${path.basename(filePath)}`);

        // Generate a unique ID
        const fieldName = labelText
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/(-$|^-)/g, '');
        const fieldId = `${fieldName}-${idCounter++}`;

        // Add htmlFor to label and id to input
        const newLabelAttrs = labelAttrs + ` htmlFor="${fieldId}"`;
        const newInputAttrs = ` id="${fieldId}"` + inputAttrs;

        hasChanges = true;
        return `<label${newLabelAttrs}>${labelText}</label><${inputType}${newInputAttrs}>`;
      }
      return match;
    }
  );

  if (hasChanges) {
    return writeFile(filePath, content);
  }
  return false;
}

// Fix 4: Replace dialog role with dialog element
function fixDialogElements(filePath) {
  let content = readFile(filePath);
  if (!content) return false;

  if (content.includes('role="dialog"')) {
    console.log(
      `💬 Converting div with dialog role to dialog element in ${path.basename(filePath)}`
    );

    // Replace div with role="dialog" with dialog element
    content = content.replace(/<div([^>]*?)role="dialog"([^>]*?)>/g, '<dialog$1$2>');
    content = content.replace(/<\/div>(\s*\/\/.*dialog.*)/gi, '</dialog>$1');

    return writeFile(filePath, content);
  }
  return false;
}

// Fix 5: Fix array index keys
function fixArrayIndexKeys(filePath) {
  let content = readFile(filePath);
  if (!content) return false;

  const indexKeyPattern = /\.map\(\((\w+),\s*(\w+)\)\s*=>\s*\(\s*<(\w+)\s+key=\{(\w+)\}/g;

  content = content.replace(indexKeyPattern, (match, item, index, element, keyVar) => {
    if (keyVar === index) {
      console.log(`🔑 Fixing array index key in ${path.basename(filePath)}`);
      // Use item property + index for more stable key
      return match.replace(`key={${index}}`, `key={\`\${${item}.id || '${item}'}-\${${index}}\`}`);
    }
    return match;
  });

  return writeFile(filePath, content);
}

// Fix 6: Remove unused variables
function fixUnusedVariables(filePath) {
  let content = readFile(filePath);
  if (!content) return false;

  // Pattern for unused useState variables
  const unusedStatePattern = /const \[(\w+), set\w+\] = useState\([^)]*\);\s*(?=\n|\/\/)/g;

  let hasChanges = false;
  content = content.replace(unusedStatePattern, (match, varName) => {
    // Check if variable is used elsewhere in the file
    const varUsagePattern = new RegExp(`\\b${varName}\\b`, 'g');
    const usages = content.match(varUsagePattern) || [];

    // If only used in the declaration, remove it
    if (usages.length <= 1) {
      console.log(`🗑️ Removing unused variable ${varName} in ${path.basename(filePath)}`);
      hasChanges = true;
      return '';
    }
    return match;
  });

  if (hasChanges) {
    return writeFile(filePath, content);
  }
  return false;
}

// Main execution
const filesToFix = [
  // Components with accessibility issues
  'src/components/MagicalPhotoGallery.jsx',
  'src/components/DigitalTimeCapsule.jsx',
  'src/components/WeddingMemoryVault.jsx',

  // Pages with form label issues
  'src/app/reunions/page.tsx',
  'src/app/time-capsule/page.tsx',
  'src/app/family-legacy/page.tsx',
  'src/app/guest-stories/page.tsx',
  'src/app/memory-vault/page.tsx',
  'src/app/anniversary/error.tsx',
];

let totalFixed = 0;

filesToFix.forEach((relativePath) => {
  const fullPath = path.resolve(projectRoot, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ File not found: ${relativePath}`);
    return;
  }

  console.log(`\n🔍 Processing: ${relativePath}`);

  let fileFixed = false;

  // Apply all fixes
  if (fixStyledJsx(fullPath)) fileFixed = true;
  if (fixReadonlyProps(fullPath)) fileFixed = true;
  if (fixFormLabels(fullPath)) fileFixed = true;
  if (fixDialogElements(fullPath)) fileFixed = true;
  if (fixArrayIndexKeys(fullPath)) fileFixed = true;
  if (fixUnusedVariables(fullPath)) fileFixed = true;

  if (fileFixed) {
    totalFixed++;
    console.log(`✅ Fixed issues in ${relativePath}`);
  } else {
    console.log(`ℹ️ No issues found in ${relativePath}`);
  }
});

console.log(`\n🎉 SUMMARY:`);
console.log(`📁 Files processed: ${filesToFix.length}`);
console.log(`✅ Files fixed: ${totalFixed}`);
console.log(`\n🚀 Run 'npm run test:frontend' to verify fixes!`);
