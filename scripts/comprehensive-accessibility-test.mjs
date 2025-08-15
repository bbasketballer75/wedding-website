#!/usr/bin/env node

/**
 * Comprehensive Accessibility Test Runner
 * Automated accessibility tests + manual testing checklist
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('♿ COMPREHENSIVE ACCESSIBILITY TESTING');
console.log('====================================\n');

// Windows-compatible file search function
function searchFiles(directory, pattern) {
  try {
    if (!fs.existsSync(directory)) return [];

    const results = [];
    const searchDirectory = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          searchDirectory(fullPath);
        } else if (file.includes(pattern) || file.match(new RegExp(pattern))) {
          results.push(fullPath);
        }
      });
    };
    searchDirectory(directory);
    return results;
  } catch (error) {
    console.log(`⚠️ Could not search ${directory}:`, error.message);
    return [];
  }
}

// Function to count pattern occurrences in file
function countPatternInFile(filePath, pattern) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(new RegExp(pattern, 'gi'));
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

try {
  // Run accessibility audit
  console.log('🔍 Running accessibility audit...');
  execSync('npm run audit:a11y', { encoding: 'utf8' });

  console.log('✅ Accessibility audit completed');
  console.log('📄 Check accessibility-audit-report.html for detailed results\n');
} catch (error) {
  console.log('⚠️ Accessibility audit encountered issues:');
  console.log(error.stdout || error.message);
}

// Check for accessibility implementations
console.log('🔍 ACCESSIBILITY IMPLEMENTATION ANALYSIS:');
console.log('========================================');

const checks = [
  {
    name: 'Skip links',
    pattern: 'skip-link|Skip to main',
    directory: 'src',
  },
  {
    name: 'ARIA labels',
    pattern: 'aria-label|aria-labelledby|aria-describedby',
    directory: 'src',
  },
  {
    name: 'Semantic HTML',
    pattern: '<main|<nav|<header|<footer|<section|<article',
    directory: 'src',
  },
  {
    name: 'Form labels',
    pattern: 'htmlFor=|<label',
    directory: 'src',
  },
  {
    name: 'Alt text on images',
    pattern: 'alt=',
    directory: 'src',
  },
  {
    name: 'Focus management',
    pattern: 'focus|tabIndex|:focus',
    directory: 'src',
  },
  {
    name: 'Live regions',
    pattern: 'aria-live|role="alert"|role="status"',
    directory: 'src',
  },
  {
    name: 'Required fields',
    pattern: 'required|aria-required',
    directory: 'src',
  },
];

let totalScore = 0;
checks.forEach((check) => {
  const files = searchFiles(check.directory, '.jsx').concat(searchFiles(check.directory, '.tsx'));
  let count = 0;

  files.forEach((file) => {
    count += countPatternInFile(file, check.pattern);
  });

  if (count > 0) {
    console.log(`✅ ${check.name}: ${count} implementations found`);
    totalScore += 1;
  } else {
    console.log(`⚠️ ${check.name}: No implementations found`);
  }
});

const scorePercentage = Math.round((totalScore / checks.length) * 100);
console.log(`\n📊 IMPLEMENTATION SCORE: ${scorePercentage}% (${totalScore}/${checks.length})`);

console.log('\n📋 MANUAL TESTING CHECKLIST:');
console.log('============================');
console.log('□ Keyboard Navigation Tests:');
console.log('  □ Tab through all interactive elements');
console.log('  □ Shift+Tab (reverse navigation)');
console.log('  □ Enter/Space activation of buttons');
console.log('  □ Escape key functionality');
console.log('  □ Arrow keys in galleries/lists');
console.log('');
console.log('□ Focus Management Tests:');
console.log('  □ Focus indicators are visible on all elements');
console.log('  □ Focus stays within modals/dialogs');
console.log('  □ Focus moves logically through content');
console.log('  □ Skip links work correctly');
console.log('');
console.log('□ Screen Reader Tests (NVDA on Windows):');
console.log('  □ Download NVDA: https://www.nvaccess.org/download/');
console.log('  □ Navigate through headings (H key)');
console.log('  □ Navigate through landmarks (D key)');
console.log('  □ Test form field announcements');
console.log('  □ Test image alt text announcements');
console.log('  □ Test dynamic content announcements');
console.log('');
console.log('□ Visual Tests:');
console.log('  □ Test with browser zoom up to 200%');
console.log('  □ Check color contrast in dev tools');
console.log('  □ Test with Windows High Contrast mode');
console.log('  □ Test on mobile with TalkBack/VoiceOver');
console.log('');
console.log('□ Form Accessibility Tests:');
console.log('  □ All form fields have labels');
console.log('  □ Required fields are clearly marked');
console.log('  □ Error messages are announced');
console.log('  □ Success messages are announced');

console.log('\n🎯 BROWSER TESTING TOOLS:');
console.log('=========================');
console.log('1. 🔍 Chrome DevTools:');
console.log('   - Lighthouse > Accessibility audit');
console.log('   - Elements > Accessibility panel');
console.log('   - Rendering > Emulate vision deficiencies');
console.log('');
console.log('2. 🔍 Browser Extensions:');
console.log('   - axe DevTools (most comprehensive)');
console.log('   - WAVE Web Accessibility Evaluator');
console.log('   - Accessibility Insights for Web');
console.log('');
console.log('3. 🔍 Automated Tools:');
console.log('   - Run: npm run audit:a11y');
console.log('   - Check report: accessibility-audit-report.html');

console.log('\n💡 PRIORITY IMPROVEMENTS:');
console.log('=========================');
console.log('□ Current target: Improve accessibility score from 59% to 80%+');
console.log('□ Ensure all images have meaningful alt text');
console.log('□ Add more ARIA labels for complex interactions');
console.log('□ Test keyboard navigation flows thoroughly');
console.log('□ Verify screen reader announcements work correctly');
console.log('□ Improve form field descriptions and error handling');

console.log('\n🚀 QUICK TEST COMMANDS:');
console.log('=======================');
console.log('Test live site: node scripts/analyze-live-site.mjs');
console.log('Local lighthouse: npx lighthouse http://localhost:3000');
console.log('Local server: npm run dev');

console.log('\n🎊 Accessibility testing guide complete!');
console.log('Use this checklist to test your live site at www.theporadas.com');
console.log(
  `Implementation score: ${scorePercentage}% - ${scorePercentage >= 75 ? 'Good!' : 'Needs improvement'}`
);
