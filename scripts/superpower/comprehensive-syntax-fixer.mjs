#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';

/**
 * Comprehensive Syntax Fix Script
 * Fixes critical JavaScript/TypeScript syntax errors across multiple files
 */

const syntaxFixes = [
  {
    file: 'src/components/ui/StateOfTheArtNavigation.jsx',
    fixes: [
      {
        search: `          {/* Desktop Navigation */}
          <div className="nav-items desktop-only">
            // Extracted to reduce nesting

            const mapFunction = ((item) =>
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <StateOfTheArtButton
                  key={item.href;

            {navItems.map(mapFunction)
                  variant={isActive ? 'primary' : 'ghost'}`,
        replace: `          {/* Desktop Navigation */}
          <div className="nav-items desktop-only">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <StateOfTheArtButton
                  key={item.href}
                  variant={isActive ? 'primary' : 'ghost'}`,
      },
    ],
  },
  {
    file: 'src/components/performance/PerformanceDashboard.tsx',
    fixes: [
      {
        search: "import OptimizedImage from '../media/OptimizedImage';",
        replace: "import { OptimizedImage } from '../../utils/optimization/ImageOptimizer';",
      },
      {
        search: '  const getMetricColor = (_metricName: string, value: number) => {',
        replace: '  const getMetricColor = (metricName: string, value: number) => {',
      },
    ],
  },
];

console.log('🔧 Starting comprehensive syntax fixes...');

for (const { file, fixes } of syntaxFixes) {
  try {
    let content = await readFile(file, 'utf-8');
    let modified = false;

    for (const { search, replace } of fixes) {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        modified = true;
        console.log(`✅ Fixed syntax in: ${file}`);
      }
    }

    if (modified) {
      await writeFile(file, content);
    } else {
      console.log(`⚪ No fixes needed for: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
}

console.log('🎉 Comprehensive syntax fixes complete!');
