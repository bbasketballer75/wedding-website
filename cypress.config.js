import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'm7s6t6',
  e2e: {
    // Use environment variable for baseUrl, default to development port
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3001',

    // Set longer timeout for CI environments
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    // Retry configuration for flaky tests
    retries: {
      runMode: 2,
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      // Register logA11yViolations task for a11y debugging
      on('task', {
        logA11yViolations(violations) {
          if (Array.isArray(violations)) {
            violations.forEach((v) => {
              // Print summary and nodes
              console.log(
                `A11Y Violation: ${v.id} - ${v.help}\nImpact: ${v.impact}\nDescription: ${v.description}\nHelp: ${v.helpUrl}`
              );
              v.nodes.forEach((node, idx) => {
                console.log(`  Node ${idx + 1}:`, node);
              });
            });
          }
          return null;
        },
      });

      return config;
    },
  },
});
