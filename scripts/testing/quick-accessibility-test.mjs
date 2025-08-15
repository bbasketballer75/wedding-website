#!/usr/bin/env node

/**
 * Quick Accessibility Test Runner
 * Automated accessibility tests for immediate feedback
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('♿ AUTOMATED ACCESSIBILITY TESTING');
console.log('=================================\n');

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

// Check for common accessibility issues
console.log('🔍 COMMON ACCESSIBILITY CHECKS:');
console.log('==============================');

const checks = [
  {
    name: 'Skip links present',
    file: 'src/app/page.jsx',
    pattern: 'skip-link',
    result: false,
  },
  {
    name: 'Alt text on images',
    file: 'src',
    pattern: 'alt=',
    result: false,
  },
  {
    name: 'Form labels',
    file: 'src',
    pattern: 'htmlFor=|<label',
    result: false,
  },
  {
    name: 'Semantic HTML',
    file: 'src',
    pattern: '<main|<nav|<header|<footer|<section|<article',
    result: false,
  },
  {
    name: 'Focus management',
    file: 'src',
    pattern: 'focus|tabIndex',
    result: false,
  },
];

checks.forEach((check) => {
  try {
    if (fs.existsSync(check.file)) {
      const searchCmd = `grep -r "${check.pattern}" ${check.file}`;
      const result = execSync(searchCmd, { encoding: 'utf8' });
      if (result.trim()) {
        console.log(`✅ ${check.name}: Found implementations`);
      }
    }
  } catch {
    console.log(`⚠️ ${check.name}: Not found or needs review`);
  }
});

console.log('\n📋 MANUAL TESTING CHECKLIST:');
console.log('============================');
console.log('□ Test Tab navigation through all interactive elements');
console.log('□ Test Shift+Tab (reverse navigation)');
console.log('□ Test Enter/Space activation of buttons');
console.log('□ Test Escape key functionality');
console.log('□ Verify focus indicators are visible');
console.log('□ Test with screen reader (NVDA on Windows)');
console.log('□ Test with browser zoom up to 200%');
console.log('□ Check color contrast in dev tools');
console.log('□ Test on mobile with TalkBack/VoiceOver');

console.log('\n🎯 QUICK BROWSER TESTS:');
console.log('=======================');
console.log('1. 🔍 Chrome DevTools > Lighthouse > Accessibility');
console.log('2. 🔍 Chrome DevTools > Elements > Accessibility panel');
console.log('3. 🔍 Install axe DevTools extension for detailed scans');
console.log('4. 🔍 Test with Windows High Contrast mode');

console.log('\n💡 IMPROVEMENT PRIORITIES:');
console.log('=========================');
console.log('□ Improve automated accessibility score (current: 59%)');
console.log('□ Add more ARIA labels for complex interactions');
console.log('□ Ensure all images have meaningful alt text');
console.log('□ Test keyboard navigation flows');
console.log('□ Verify screen reader announcements');

console.log('\n🎊 Accessibility testing complete!');
console.log('Use the manual checklist above to test your live site at www.theporadas.com');
