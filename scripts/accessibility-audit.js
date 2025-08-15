#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * Comprehensive accessibility testing and reporting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WCAG 2.1 AA Guidelines checklist
const ACCESSIBILITY_CHECKLIST = {
  'Color Contrast': {
    description:
      'Text must have sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)',
    automated: true,
    status: 'checking...',
  },
  'Keyboard Navigation': {
    description: 'All interactive elements must be keyboard accessible',
    automated: false,
    status: 'manual-check-required',
  },
  'Screen Reader Support': {
    description: 'Proper ARIA labels, roles, and semantic HTML',
    automated: true,
    status: 'checking...',
  },
  'Focus Management': {
    description: 'Visible focus indicators and logical tab order',
    automated: false,
    status: 'manual-check-required',
  },
  'Alternative Text': {
    description: 'All images must have appropriate alt text',
    automated: true,
    status: 'checking...',
  },
  'Form Labels': {
    description: 'All form controls must have associated labels',
    automated: true,
    status: 'checking...',
  },
  'Heading Structure': {
    description: 'Proper heading hierarchy (h1 → h2 → h3, etc.)',
    automated: true,
    status: 'checking...',
  },
  'Language Declaration': {
    description: 'Page language must be declared',
    automated: true,
    status: 'checking...',
  },
  'Skip Links': {
    description: 'Skip navigation links for screen readers',
    automated: true,
    status: 'checking...',
  },
  'Error Identification': {
    description: 'Form errors must be clearly identified and described',
    automated: false,
    status: 'manual-check-required',
  },
};

function scanForImages() {
  const imageDir = path.join(__dirname, '..', 'src');
  const issues = [];

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Check for img tags without alt attributes
        const imgRegex = /<img[^>]*>/g;
        const matches = content.match(imgRegex);

        if (matches) {
          matches.forEach((match) => {
            if (!match.includes('alt=')) {
              issues.push({
                file: path.relative(imageDir, fullPath),
                issue: 'Image without alt attribute',
                code: match,
                severity: 'error',
              });
            }
          });
        }
      }
    });
  }

  scanDirectory(imageDir);
  return issues;
}

function scanForHeadings() {
  const srcDir = path.join(__dirname, '..', 'src');
  const issues = [];

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Extract heading levels
        const headingRegex = /<h([1-6])[^>]*>/g;
        const headings = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
          headings.push(parseInt(match[1]));
        }

        // Check heading hierarchy
        for (let i = 1; i < headings.length; i++) {
          const current = headings[i];
          const previous = headings[i - 1];

          if (current > previous + 1) {
            issues.push({
              file: path.relative(srcDir, fullPath),
              issue: `Heading level ${current} follows h${previous} (skipped h${previous + 1})`,
              severity: 'warning',
            });
          }
        }
      }
    });
  }

  scanDirectory(srcDir);
  return issues;
}

function scanForFormLabels() {
  const srcDir = path.join(__dirname, '..', 'src');
  const issues = [];

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Check for form inputs without labels or aria-label
        const inputRegex = /<input[^>]*>/g;
        const matches = content.match(inputRegex);

        if (matches) {
          matches.forEach((match) => {
            if (!match.includes('aria-label=') && !match.includes('id=')) {
              issues.push({
                file: path.relative(srcDir, fullPath),
                issue: 'Input without proper labeling',
                code: match,
                severity: 'error',
              });
            }
          });
        }
      }
    });
  }

  scanDirectory(srcDir);
  return issues;
}

function generateReport() {
  console.log('🔍 Running Accessibility Audit...\n');

  const imageIssues = scanForImages();
  const headingIssues = scanForHeadings();
  const formIssues = scanForFormLabels();

  // Update checklist status
  ACCESSIBILITY_CHECKLIST['Alternative Text'].status = imageIssues.length === 0 ? 'pass' : 'fail';
  ACCESSIBILITY_CHECKLIST['Heading Structure'].status =
    headingIssues.length === 0 ? 'pass' : 'fail';
  ACCESSIBILITY_CHECKLIST['Form Labels'].status = formIssues.length === 0 ? 'pass' : 'fail';

  // Check for skip links
  const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
  if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    ACCESSIBILITY_CHECKLIST['Skip Links'].status = appContent.includes('skip-link')
      ? 'pass'
      : 'fail';
  }

  // Check for language declaration
  const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    ACCESSIBILITY_CHECKLIST['Language Declaration'].status = layoutContent.includes('lang=')
      ? 'pass'
      : 'fail';
  }

  // Generate report
  console.log('📊 ACCESSIBILITY AUDIT REPORT');
  console.log('================================\n');

  Object.entries(ACCESSIBILITY_CHECKLIST).forEach(([check, details]) => {
    const status = details.status;

    let icon;
    if (status === 'pass') {
      icon = '✅';
    } else if (status === 'fail') {
      icon = '❌';
    } else if (status === 'manual-check-required') {
      icon = '🔍';
    } else {
      icon = '⚠️';
    }

    console.log(`${icon} ${check}`);
    console.log(`   ${details.description}`);
    console.log(`   Status: ${status.toUpperCase()}\n`);
  });

  // Report specific issues
  if (imageIssues.length > 0) {
    console.log('🖼️  IMAGE ACCESSIBILITY ISSUES:');
    imageIssues.forEach((issue) => {
      console.log(`   ❌ ${issue.file}: ${issue.issue}`);
    });
    console.log('');
  }

  if (headingIssues.length > 0) {
    console.log('📝 HEADING STRUCTURE ISSUES:');
    headingIssues.forEach((issue) => {
      console.log(`   ⚠️  ${issue.file}: ${issue.issue}`);
    });
    console.log('');
  }

  if (formIssues.length > 0) {
    console.log('📋 FORM ACCESSIBILITY ISSUES:');
    formIssues.forEach((issue) => {
      console.log(`   ❌ ${issue.file}: ${issue.issue}`);
    });
    console.log('');
  }

  // Summary
  const totalChecks = Object.keys(ACCESSIBILITY_CHECKLIST).length;
  const passedChecks = Object.values(ACCESSIBILITY_CHECKLIST).filter(
    (check) => check.status === 'pass'
  ).length;
  const failedChecks = Object.values(ACCESSIBILITY_CHECKLIST).filter(
    (check) => check.status === 'fail'
  ).length;
  const manualChecks = Object.values(ACCESSIBILITY_CHECKLIST).filter(
    (check) => check.status === 'manual-check-required'
  ).length;

  console.log('📈 SUMMARY:');
  console.log(`   ✅ Passed: ${passedChecks}/${totalChecks}`);
  console.log(`   ❌ Failed: ${failedChecks}/${totalChecks}`);
  console.log(`   🔍 Manual Review Needed: ${manualChecks}/${totalChecks}`);

  const score = Math.round((passedChecks / (totalChecks - manualChecks)) * 100);
  console.log(`   📊 Automated Score: ${score}%\n`);

  // Recommendations
  console.log('💡 RECOMMENDATIONS:');

  if (failedChecks > 0) {
    console.log('   1. Fix all automated accessibility issues listed above');
    console.log('   2. Add proper alt text to all images');
    console.log('   3. Ensure proper form labeling');
    console.log('   4. Review heading hierarchy');
  }

  if (manualChecks > 0) {
    console.log('   5. Perform manual keyboard navigation testing');
    console.log('   6. Test with screen reader (NVDA, JAWS, or VoiceOver)');
    console.log('   7. Verify focus management and visible focus indicators');
    console.log('   8. Test form error handling and messaging');
  }

  console.log('\n🎯 Next Steps:');
  console.log('   - Run automated accessibility tests: npm run test:a11y');
  console.log('   - Use browser dev tools Lighthouse accessibility audit');
  console.log('   - Test with actual assistive technologies');
  console.log('   - Consider hiring accessibility consultant for comprehensive review');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateReport();
}

export { generateReport, scanForImages, scanForHeadings, scanForFormLabels };
