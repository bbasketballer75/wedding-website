/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
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
};
