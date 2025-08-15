#!/usr/bin/env node

/**
 * Pre-commit hook to automatically fix common issues
 * This runs before each git commit to ensure code quality
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

const log = {
  info: (msg) => console.log(chalk.blue('ℹ️ ' + msg)),
  success: (msg) => console.log(chalk.green('✅ ' + msg)),
  warning: (msg) => console.log(chalk.yellow('⚠️ ' + msg)),
  error: (msg) => console.log(chalk.red('❌ ' + msg)),
};

function runCommand(command, description) {
  try {
    log.info(`Running: ${description}`);
    execSync(command, { stdio: 'inherit' });
    log.success(`${description} completed`);
    return true;
  } catch (error) {
    log.error(`${description} failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(chalk.cyan('\n🔧 Pre-commit Quality Checks\n'));

  let hasErrors = false;

  // 1. Fix ESLint issues automatically
  if (!runCommand('npm run lint:fix', 'ESLint auto-fix')) {
    hasErrors = true;
  }

  // 2. Format code
  if (!runCommand('npm run format', 'Code formatting')) {
    hasErrors = true;
  }

  // 3. Run tests
  if (!runCommand('npm run test:frontend', 'Frontend tests')) {
    hasErrors = true;
  }

  if (!runCommand('npm run test:backend', 'Backend tests')) {
    hasErrors = true;
  }

  // 4. Check build
  if (!runCommand('npm run build', 'Production build')) {
    hasErrors = true;
  }

  if (hasErrors) {
    log.error('Some checks failed. Please fix the issues before committing.');
    process.exit(1);
  } else {
    log.success('All checks passed! Commit proceeding...');
  }
}

main().catch((error) => {
  log.error('Pre-commit hook failed:', error.message);
  process.exit(1);
});
